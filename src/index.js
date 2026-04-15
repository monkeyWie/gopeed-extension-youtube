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
    await page.navigate('https://www.youtube.com/robots.txt', { timeoutMs: 30000 });
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

gopeed.events.onResolve(async (ctx) => {
  const input = ctx.req.url;

  gopeed.logger.info(`Resolving YouTube URL: ${input}`);

  const quality = String(getSetting('quality', '1080p'));
  const fallbackToBest = getBooleanSetting('qualityFallback', false);

  const prepared = await prepareSabrStreams({
    input,
    quality,
    preferWebM: false,
    preferH264: true,
    fallbackToBest,
  });

  gopeed.logger.info(`Prepared SABR streams for videoId: ${prepared.videoId}`);

  const poToken = await executePoTokenExpression(prepared.poTokenExpression);

  gopeed.logger.info(`Obtained PO token of length ${poToken.length} for videoId: ${prepared.videoId}`);

  const result = await prepared.open(poToken);

  gopeed.logger.info(`Opened SABR streams result`);
  gopeed.logger.info(
    `Selected formats: video=${result.selectedFormats.videoFormat.itag} ${result.selectedFormats.videoFormat.mimeType}, audio=${result.selectedFormats.audioFormat.itag} ${result.selectedFormats.audioFormat.mimeType}`
  );

  const title = result.info?.basic_info?.title || result.info?.video_details?.title || prepared.videoId;
  const baseName = sanitizeFileName(title);
  const videoExtension = getFileExtension(result.selectedFormats.videoFormat.mimeType, 'mp4');
  const audioExtension = getFileExtension(result.selectedFormats.audioFormat.mimeType, 'm4a');
  gopeed.logger.info(
    `Resolved output names: video=${baseName}.video.${videoExtension}, audio=${baseName}.audio.${audioExtension}`
  );

  gopeed.logger.info(`Creating object URL for video stream`);
  const videoUrl = URL.createObjectURL(result.videoStream);
  gopeed.logger.info(`Created video object URL`);

  gopeed.logger.info(`Creating object URL for audio stream`);
  const audioUrl = URL.createObjectURL(result.audioStream);
  gopeed.logger.info(`Created audio object URL`);

  ctx.res = {
    name: baseName,
    files: [
      {
        name: `${baseName}.video.${videoExtension}`,
        req: {
          url: videoUrl,
        },
        size: getContentLength(result.selectedFormats.videoFormat.contentLength),
      },
      {
        name: `${baseName}.audio.${audioExtension}`,
        req: {
          url: audioUrl,
        },
        size: getContentLength(result.selectedFormats.audioFormat.contentLength),
      },
    ],
  };
});
