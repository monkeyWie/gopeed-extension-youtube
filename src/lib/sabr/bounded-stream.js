import { SabrStream } from 'googlevideo/sabr-stream';
import { CompositeBuffer, UmpReader } from 'googlevideo/ump';
import { UMPPartId } from 'googlevideo/protos';

// Only one chunk can be in transit. No dependency on desiredSize, which is
// unavailable in Gopeed's minimal ReadableStream implementation.
function demandStream(cancel) {
  let controller, demand, pending, failure, ended = false;
  const stream = new ReadableStream({
    start(c) { controller = c; },
    pull() {
      return new Promise((resolve) => {
        demand = resolve;
        deliver();
      });
    },
    cancel(reason) {
      fail(reason instanceof Error ? reason : new Error(String(reason || 'Stream cancelled')));
      cancel();
    },
  }, { highWaterMark: 0 });
  function deliver() {
    if (!demand || !pending) return;
    const item = pending;
    const pulled = demand;
    pending = demand = null;
    controller.enqueue(item.chunk);
    pulled();
    item.resolve();
  }
  function fail(error) {
    if (ended) return;
    ended = true;
    failure = error;
    pending?.reject(error);
    pending = null;
    demand?.();
    demand = null;
    controller.error(error);
  }
  return {
    stream,
    write(chunk) {
      if (ended) return Promise.reject(failure || new Error('Stream closed'));
      return new Promise((resolve, reject) => {
        pending = { chunk, resolve, reject };
        deliver();
      });
    },
    close() {
      if (ended) return;
      ended = true;
      controller.close();
      demand?.();
      demand = null;
    },
    error: fail,
  };
}

// Incremental UMP framing: MEDIA payloads can be arbitrarily large; only
// metadata is assembled, with an explicit cap. Headers may cross fetch chunks.
class ResponseReader {
  constructor(reader) { this.reader = reader; this.chunk = new Uint8Array(); this.offset = 0; }
  async take(max) {
    while (this.offset === this.chunk.length) {
      const { done, value } = await this.reader.read();
      if (done) return null;
      this.chunk = value;
      this.offset = 0;
    }
    const end = Math.min(this.offset + max, this.chunk.length);
    const part = this.chunk.subarray(this.offset, end);
    this.offset = end;
    return part;
  }
  async integer(allowEOF = false) {
    const first = await this.take(1);
    if (!first) {
      if (allowEOF) return null;
      throw new Error('Truncated SABR part header');
    }
    const b = first[0];
    const length = b < 128 ? 1 : b < 192 ? 2 : b < 224 ? 3 : b < 240 ? 4 : 5;
    const bytes = new Uint8Array(length);
    bytes[0] = b;
    for (let i = 1; i < length;) {
      const next = await this.take(length - i);
      if (!next) throw new Error('Truncated SABR part header');
      bytes.set(next, i);
      i += next.length;
    }
    return new UmpReader(new CompositeBuffer([bytes])).readVarInt(0)[0];
  }
  async payload(size, consume) {
    while (size > 0) {
      const chunk = await this.take(Math.min(size, 64 * 1024));
      if (!chunk) throw new Error('Truncated SABR part payload');
      await consume(chunk);
      size -= chunk.length;
    }
  }
}

// Adapt googlevideo's protocol state machine, keeping downloaded media out of
// its whole-segment buffers. Run one instance per track so pausing one HTTP
// response cannot prevent FFmpeg from getting data from the other track.
export class BoundedSabrStream extends SabrStream {
  constructor(config) {
    super(config);
    this.activeMedia = new Map();
    this.outputs = {
      video: demandStream(() => this.abort()),
      audio: demandStream(() => this.abort()),
    };
    this.videoStream = this.outputs.video.stream;
    this.audioStream = this.outputs.audio.stream;
    this.videoController = this.outputs.video;
    this.audioController = this.outputs.audio;
  }

  abort() {
    if (this._aborted) return;
    super.abort();
    this.activeMedia.clear();
    void this.responseReader?.cancel().catch(() => {});
  }

  async processStreamingResponse(response) {
    if (!response.ok) {
      await response.body?.cancel();
      throw new Error(`Server returned ${response.status} ${response.statusText}`);
    }
    if (response.headers.get('content-type')?.split(';')[0].trim() !== 'application/vnd.yt-ump') {
      await response.body?.cancel();
      throw new Error('Unexpected SABR response content type');
    }
    const reader = response.body.getReader();
    this.responseReader = reader;
    const input = new ResponseReader(reader);
    const processed = new Set();
    try {
      while (!this._aborted) {
        const type = await input.integer(true);
        if (type === null) break;
        const size = await input.integer();
        processed.add(type);
        if (type === UMPPartId.MEDIA) {
          if (size < 1) throw new Error('Empty SABR media part');
          const header = await input.take(1);
          if (!header) throw new Error('Truncated SABR media part');
          const segment = this.partialSegmentQueue.get(header[0]);
          const format = segment && this.initializedFormatsMap.get(segment.formatIdKey);
          await input.payload(size - 1, async (chunk) => {
            // Duplicate/downloaded segments are intentionally discarded.
            if (!segment || !format) return;
            const active = this.activeMedia.get(segment.formatIdKey);
            if (active && active !== segment) throw new Error('Interleaved SABR segments for the same track');
            this.activeMedia.set(segment.formatIdKey, segment);
            segment.loadedBytes = (segment.loadedBytes || 0) + chunk.length;
            if (segment.loadedBytes > Number(segment.mediaHeader.contentLength || 0)) {
              throw new Error('SABR media segment exceeds its declared length');
            }
            if (segment.formatIdKey === this.formatToDiscard) return;
            const type = format.formatInitializationMetadata?.mimeType?.includes('video') ? 'video' : 'audio';
            await this.outputs[type].write(chunk.slice());
          });
        } else {
          if (size > 1024 * 1024) throw new Error('SABR metadata part exceeds 1 MiB');
          const data = new Uint8Array(size);
          let offset = 0;
          await input.payload(size, (chunk) => { data.set(chunk, offset); offset += chunk.length; });
          const handler = this.umpPartHandlers.get(type);
          if (handler) await handler({ type, size, data: new CompositeBuffer([data]) });
        }
      }
      if (this.partialSegmentQueue.size) throw new Error('Incomplete SABR media segment');
      if (!processed.size) throw new Error('Empty SABR response');
      return [...processed];
    } catch (error) {
      // Once bytes are delivered, replaying a partial segment would corrupt the
      // output. Abort this session; the task can retry using a fresh Blob stream.
      this.outputs.video.error(error);
      this.outputs.audio.error(error);
      this.abort();
      throw error;
    } finally {
      await reader.cancel().catch(() => {});
      reader.releaseLock();
      this.responseReader = null;
    }
  }

  handleMediaEnd(part) {
    if (!part.data.getLength()) throw new Error('Empty SABR media end');
    const headerId = part.data.getUint8(0);
    const segment = this.partialSegmentQueue.get(headerId);
    if (!segment) return;
    if ((segment.loadedBytes || 0) !== Number(segment.mediaHeader.contentLength || 0)) {
      throw new Error('SABR media segment length mismatch');
    }
    const format = this.initializedFormatsMap.get(segment.formatIdKey);
    if (format) {
      format.lastMediaHeaders.push(segment.mediaHeader);
      format.downloadedSegments.set(segment.segmentNumber, segment);
    }
    this.partialSegmentQueue.delete(headerId);
    this.activeMedia.delete(segment.formatIdKey);
  }
}
