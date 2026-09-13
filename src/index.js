import { getFileExtension, prepareSabrStreams } from './lib/sabr/index.js';

function sanitizeFileName(value) {
  // eslint-disable-next-line no-control-regex
  return (value || 'youtube').replace(/[<>:"/\\|?*\u0000-\u001f]/g, '_').trim();
}

async function executePoTokenExpression(expression) {
  const page = await gopeed.runtime.webview.open({
    headless: true,
    title: 'gopeed-youtube-sabr',
    width: 1280,
    height: 800,
  });
  try {
    await page.goto('https://www.youtube.com/robots.txt', { timeoutMs: 30000 });
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

function getContentLength(value) {
  const length = Number(value);
  return Number.isFinite(length) && length > 0 ? length : undefined;
}

function createAbortableReadableStream(stream, onCancel) {
  let reader;

  return new ReadableStream({
    start() {
      reader = stream.getReader();
    },
    async pull(controller) {
      const { done, value } = await reader.read();
      if (done) {
        controller.close();
        return;
      }
      controller.enqueue(value);
    },
    cancel(reason) {
      if (typeof onCancel === 'function') {
        onCancel();
      }
      return reader?.cancel(reason);
    },
  });
}

async function createStreamObjectURL(openStream, format) {
  return await gopeed.runtime.blob.createObjectURL(
    async () => {
      const { stream, abort } = await openStream();
      return createAbortableReadableStream(stream, abort);
    },
    {
      contentType: format.mimeType,
      size: getContentLength(format.contentLength),
    }
  );
}

gopeed.events.onResolve(async (ctx) => {
  const input = ctx.req.url;

  const quality = String(getSetting('quality', '1080p'));
  const fallbackToBest = getBooleanSetting('fallbackToBest', false);

  const prepared = await prepareSabrStreams({
    input,
    quality,
    preferWebM: false,
    preferH264: true,
    fallbackToBest,
  });

  const poToken = await executePoTokenExpression(prepared.poTokenExpression);

  const session = await prepared.prepareSession(poToken);

  const title = session.info?.basic_info?.title || session.info?.video_details?.title || prepared.videoId;
  const baseName = sanitizeFileName(title);
  const videoExtension = getFileExtension(session.selectedFormats.videoFormat.mimeType, 'mp4');
  const audioExtension = getFileExtension(session.selectedFormats.audioFormat.mimeType, 'm4a');

  const videoUrl = await createStreamObjectURL(session.openVideoStream, session.selectedFormats.videoFormat);
  const audioUrl = await createStreamObjectURL(session.openAudioStream, session.selectedFormats.audioFormat);

  ctx.res = {
    name: baseName,
    files: [
      {
        name: `${baseName}.video.${videoExtension}`,
        req: {
          url: videoUrl,
        },
        size: getContentLength(session.selectedFormats.videoFormat.contentLength),
      },
      {
        name: `${baseName}.audio.${audioExtension}`,
        req: {
          url: audioUrl,
        },
        size: getContentLength(session.selectedFormats.audioFormat.contentLength),
      },
    ],
  };
});
