import gopeed from 'gopeed';
import ytdl from 'ytdl-core';

// https://www.youtube.com/watch?v=aqz-KE-bpKQ
gopeed.events.onResolve(async (ctx) => {
  const video = await ytdl.getInfo(ctx.req.url);
  const bestFormat = ytdl.chooseFormat(video.formats, { quality: gopeed.settings.quality });
  gopeed.logger.debug(JSON.stringify(bestFormat));
  let fmt = '.mp4';
  if (bestFormat.mimeType) {
    fmt = '.' + bestFormat.mimeType.split(';')[0].split('/')[1];
  }
  ctx.res = {
    name: video.videoDetails.title,
    files: [
      {
        name: `${video.videoDetails.title}.${bestFormat.qualityLabel}${fmt}`,
        size: bestFormat.contentLength,
        req: {
          url: bestFormat.url,
        },
      },
    ],
  };
});
