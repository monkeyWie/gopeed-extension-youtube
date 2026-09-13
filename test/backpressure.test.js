import test from 'node:test';
import assert from 'node:assert/strict';
import { setTimeout as delay } from 'node:timers/promises';
import { CompositeBuffer, UmpWriter } from 'googlevideo/ump';
import { UMPPartId, FormatInitializationMetadata, MediaHeader } from 'googlevideo/protos';
import { BoundedSabrStream } from '../src/lib/sabr/bounded-stream.js';

function session(mediaSize, track = 'video') {
  const sabr = new BoundedSabrStream({});
  sabr.initializedFormatsMap.set('format', {
    formatInitializationMetadata: { mimeType: track + '/mp4' },
    downloadedSegments: new Map(), lastMediaHeaders: [],
  });
  sabr.partialSegmentQueue.set(1, {
    formatIdKey: 'format', segmentNumber: 0, durationMs: '1000',
    mediaHeader: { contentLength: String(mediaSize) }, bufferedChunks: [],
  });
  return sabr;
}
function framing(type, size) {
  const buffer = new CompositeBuffer();
  const writer = new UmpWriter(buffer);
  writer.writeVarInt(type);
  writer.writeVarInt(size);
  return buffer.chunks;
}
function response(size, { splitHeader = false, truncate = false } = {}) {
  let reads = 0, cancelled = false;
  function* bytes() {
    const header = [...framing(UMPPartId.MEDIA, size + 1), new Uint8Array([1])];
    for (const bytes of header) {
      if (splitHeader) for (const byte of bytes) yield new Uint8Array([byte]);
      else yield bytes;
    }
    for (let remaining = size; remaining > 0; remaining -= 64 * 1024) {
      if (truncate && remaining < size / 2) return;
      yield new Uint8Array(Math.min(64 * 1024, remaining)).fill(42);
    }
    yield* framing(UMPPartId.MEDIA_END, 1);
    yield new Uint8Array([1]);
  }
  const iterator = bytes();
  return {
    get reads() { return reads; },
    get cancelled() { return cancelled; },
    value: new Response(new ReadableStream({
      pull(c) {
        reads++;
        const { done, value } = iterator.next();
        if (done) c.close();
        else c.enqueue(value);
      },
      cancel() { cancelled = true; },
    }, { highWaterMark: 0 }), { headers: { 'content-type': 'application/vnd.yt-ump' } }),
  };
}
async function consume(sabr, track = 'video') {
  const reader = sabr[track + 'Stream'].getReader();
  let bytes = 0;
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) return bytes;
      assert.ok(value.length <= 64 * 1024);
      assert.ok(value.every(byte => byte === 42));
      bytes += value.length;
    }
  } finally { reader.releaseLock(); }
}

test('a 64 MiB segment stops network reads when consumption stops, then resumes losslessly', async () => {
  const size = 64 * 1024 * 1024; // Deliberately larger than the native buffer.
  const sabr = session(size);
  const network = response(size, { splitHeader: true });
  const processing = sabr.processStreamingResponse(network.value).then(() => sabr.outputs.video.close());
  await delay(20);
  const stopped = network.reads;
  await delay(20);
  assert.equal(network.reads, stopped);
  assert.ok(stopped < 15, 'network must stop before receiving the whole segment');
  const reader = sabr.videoStream.getReader();
  const first = await reader.read();
  assert.equal(first.value.length, 64 * 1024);
  await delay(20);
  const stoppedAgain = network.reads;
  await delay(20);
  assert.equal(network.reads, stoppedAgain);
  reader.releaseLock();
  assert.equal(first.value.length + await consume(sabr), size);
  await processing;
  const stored = sabr.initializedFormatsMap.get('format').downloadedSegments.get(0);
  assert.equal(stored.bufferedChunks.length, 0, 'no retained media in protocol state');
});

test('a paused video request does not block the independent audio request', async () => {
  const video = session(8 * 1024 * 1024);
  const audio = session(512 * 1024, 'audio');
  const videoNetwork = response(8 * 1024 * 1024);
  const videoWork = video.processStreamingResponse(videoNetwork.value);
  const cancelled = assert.rejects(videoWork);
  const audioWork = audio.processStreamingResponse(response(512 * 1024).value)
    .then(() => audio.outputs.audio.close());
  assert.equal(await consume(audio, 'audio'), 512 * 1024);
  await audioWork;
  await video.videoStream.cancel();
  await cancelled;
  assert.equal(videoNetwork.cancelled, true);
});

test('truncated media errors the output instead of replaying partial bytes', async () => {
  const sabr = session(1024 * 1024);
  const work = sabr.processStreamingResponse(response(1024 * 1024, { truncate: true }).value);
  const failed = assert.rejects(work, /Truncated/);
  await assert.rejects(consume(sabr), /Truncated/);
  await failed;
  assert.equal(sabr._aborted, true);
});

test('oversized metadata is rejected before its payload is buffered', async () => {
  const sabr = session(0);
  const header = new CompositeBuffer(framing(999, 2 * 1024 * 1024));
  const response = new Response(new Uint8Array(header.chunks.flatMap(c => [...c])), {
    headers: { 'content-type': 'application/vnd.yt-ump' },
  });
  await assert.rejects(sabr.processStreamingResponse(response), /exceeds 1 MiB/);
});

test('protocol headers advance segment state and duplicate segments are not emitted twice', async () => {
  const sabr = new BoundedSabrStream({});
  const wire = new CompositeBuffer();
  const writer = new UmpWriter(wire);
  writer.write(UMPPartId.FORMAT_INITIALIZATION_METADATA, FormatInitializationMetadata.encode({
    formatId: { itag: 137 }, mimeType: 'video/mp4', durationUnits: '1000',
    durationTimescale: '1000', endSegmentNumber: '1',
  }).finish());
  for (const sequenceNumber of [0, 1, 1]) {
    writer.write(UMPPartId.MEDIA_HEADER, MediaHeader.encode({
      headerId: 1, itag: 137, sequenceNumber, isInitSeg: sequenceNumber === 0,
      durationMs: sequenceNumber === 0 ? '0' : '1000', contentLength: '3',
    }).finish());
    writer.write(UMPPartId.MEDIA, new Uint8Array([1, 42, 42, 42]));
    writer.write(UMPPartId.MEDIA_END, new Uint8Array([1]));
  }
  const bytes = new Uint8Array(wire.getLength());
  let offset = 0;
  for (const chunk of wire.chunks) { bytes.set(chunk, offset); offset += chunk.length; }
  const work = sabr.processStreamingResponse(new Response(bytes, {
    headers: { 'content-type': 'application/vnd.yt-ump' },
  })).then(() => {
    sabr.validateDownloadedSegments();
    sabr.outputs.video.close();
  });
  assert.equal(await consume(sabr), 6);
  await work;
  const format = sabr.initializedFormatsMap.get('137:');
  assert.equal(format.downloadedSegments.size, 2);
  assert.equal(format.lastMediaHeaders.length, 2);
});
