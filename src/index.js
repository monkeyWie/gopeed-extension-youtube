import { syncWebViewCookies } from './lib/cookies.js';
import './polyfills.js';
import { resolveVideo } from './lib/video.js';
import { extractPlaylistId, resolvePlaylist } from './lib/playlist.js';
import { prepareSabrStreams } from './lib/sabr/index.js';
import { DEFAULT_BROWSER_USER_AGENT } from './lib/sabr/common.js';

function messageError(error) {
  return error instanceof MessageError ? error : new MessageError(`YouTube: ${error?.message || String(error)}`);
}

function userFacing(handler) {
  return async (...args) => {
    try {
      return await handler(...args);
    } catch (error) {
      throw messageError(error);
    }
  };
}

function sanitizeFileName(value) {
  // eslint-disable-next-line no-control-regex
  return (value || 'youtube').replace(/[<>:"/\\|?*\u0000-\u001f]/g, '_').trim() || 'youtube';
}

async function executePoTokenExpression(expression) {
  const options = {
    headless: true,
    title: 'gopeed-youtube-sabr',
    width: 1280,
    height: 800,
  };
  let page = await gopeed.runtime.webview.open(options);
  try {
    await page.goto('https://www.youtube.com/robots.txt', { timeoutMs: 30000 });
    const userAgent = await page.execute('() => navigator.userAgent');
    if (/Android/i.test(userAgent)) {
      // Android's WebView UA gets no integrity token. Keep the native UA on
      // WebKit platforms: pretending to be Chrome invalidates attestation.
      await page.close();
      page = await gopeed.runtime.webview.open({ ...options, userAgent: DEFAULT_BROWSER_USER_AGENT });
      await page.goto('https://www.youtube.com/robots.txt', { timeoutMs: 30000 });
    }
    await syncWebViewCookies(page);
    return await page.execute(expression);
  } finally {
    await page.close();
  }
}

function getSetting(name, fallback) {
  const value = gopeed.settings?.[name];
  return value === undefined || value === null || value === '' ? fallback : value;
}

function getBooleanSetting(name, fallback = false) {
  const value = gopeed.settings?.[name];

  if (value === undefined || value === null || value === '') {
    return fallback;
  }

  if (typeof value === 'boolean') {
    return value;
  }

  if (typeof value === 'string') {
    return value === 'true';
  }

  return Boolean(value);
}

function requireRuntime() {
  if (
    typeof gopeed.runtime?.ffmpeg?.merge !== 'function' ||
    typeof gopeed.runtime?.blob?.createObjectURL !== 'function'
  ) {
    throw new MessageError('Please upgrade Gopeed to a build with FFmpeg WASM and Blob support.');
  }
  if (typeof gopeed.runtime?.webview?.isAvailable !== 'function' || !gopeed.runtime.webview.isAvailable()) {
    throw new MessageError('YouTube SABR downloads require an available Gopeed WebView runtime.');
  }
}

async function prepareSession(input, quality, fallbackToBest) {
  const prepared = await prepareSabrStreams({
    input,
    quality,
    preferWebM: false,
    preferH264: true,
    fallbackToBest,
    withPlayer: false,
  });
  const verification = await executePoTokenExpression(prepared.poTokenExpression);
  return await prepared.prepareSession(verification);
}

function abortableOutput(stream, abort) {
  const reader = stream.getReader();
  let stopped = false;
  function finish() {
    if (stopped) return;
    stopped = true;
    try {
      abort();
    } finally {
      reader.releaseLock();
    }
  }
  return new ReadableStream({
    async pull(controller) {
      try {
        const { done, value } = await reader.read();
        if (stopped) return;
        if (done) {
          controller.close();
          finish();
        } else controller.enqueue(value);
      } catch (error) {
        if (!stopped) {
          controller.error(messageError(error));
          finish();
        }
      }
    },
    async cancel(reason) {
      try {
        await reader.cancel(reason);
      } finally {
        finish();
      }
    },
  });
}

async function createMergedURL(labels, initialSession) {
  const { input, quality, fallbackToBest } = labels;
  let firstSession = initialSession;
  return await gopeed.runtime.blob.createObjectURL(
    userFacing(async () => {
      // Each open starts a fresh SABR producer; stream readers are never reused.
      const session = await (firstSession ? firstSession() : prepareSession(input, quality, fallbackToBest === 'true'));
      firstSession = undefined;
      const { videoStream, audioStream, abort } = await session.openStreams();
      try {
        return abortableOutput(gopeed.runtime.ffmpeg.merge({ video: videoStream, audio: audioStream }), abort);
      } catch (error) {
        abort();
        throw error;
      }
    }),
    { contentType: 'video/mp4', range: false }
  );
}

async function refreshMergedURL(task) {
  requireRuntime();
  const req = task.meta.req;
  const previous = req.url;
  let session;
  let failure = new MessageError('YouTube download preparation did not complete.');
  // onStart errors do not stop the downloader: install a fail-closed URL first.
  const next = await createMergedURL(req.labels, async () => {
    if (!session) throw failure;
    return session;
  });
  try {
    await task.setUrl(next);
  } catch (error) {
    await gopeed.runtime.blob.revokeObjectURL(next);
    throw error;
  }
  try {
    if (previous !== req.labels.input) await gopeed.runtime.blob.revokeObjectURL(previous);
  } catch (_) {
    /* A registration from a previous Gopeed process has expired. */
  }
  try {
    session = await prepareSession(req.labels.input, req.labels.quality, req.labels.fallbackToBest === 'true');
  } catch (error) {
    failure = messageError(error);
    throw failure;
  }
}

gopeed.events.onResolve(
  userFacing(async (ctx) => {
    requireRuntime();
    const input = ctx.req.url;
    const quality = String(getSetting('quality', '1080p'));
    const fallbackToBest = getBooleanSetting('fallbackToBest', true);
    const playlistId = extractPlaylistId(input);
    if (playlistId) {
      const playlist = await resolvePlaylist(playlistId);
      const files = playlist.videos.map((video) => {
        const input = `https://www.youtube.com/watch?v=${video.id}`;
        const labels = {
          [gopeed.info.identity]: '1',
          input,
          quality,
          fallbackToBest: String(fallbackToBest),
          type: 'merged',
        };
        return {
          name: `${video.index}. ${sanitizeFileName(video.title)}.mp4`,
          req: { url: input, rawUrl: input, labels },
        };
      });
      ctx.res = { name: sanitizeFileName(playlist.title), range: false, files };
      return;
    }

    const { title } = await resolveVideo(input);
    const labels = {
      [gopeed.info.identity]: '1',
      input,
      quality,
      fallbackToBest: String(fallbackToBest),
      type: 'merged',
    };
    ctx.res = {
      range: false,
      files: [{ name: `${sanitizeFileName(title)}.mp4`, req: { url: input, rawUrl: input, labels } }],
    };
  })
);

gopeed.events.onStart(
  userFacing(async (ctx) => {
    const req = ctx.task.meta.req;
    if (req.labels.type !== 'merged') return;
    requireRuntime();
    await refreshMergedURL(ctx.task);
  })
);

gopeed.events.onError(
  userFacing(async (ctx) => {
    const req = ctx.task.meta.req;
    if (req.labels.type !== 'merged' || req.labels.retried === '1') return;
    await req.putLabel('retried', '1');
    await ctx.task.continue();
  })
);
