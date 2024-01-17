import ytdl from 'ytdl-core';

// https://www.youtube.com/watch?v=aqz-KE-bpKQ
gopeed.events.onResolve(async (ctx) => {
  var url = ctx.req.url;
  var ytbUrl = url;
  if (url.includes('youtu.be/')) {
    ytbUrl = new URL(url).pathname.substring(1);
  }
  const video = await ytdl.getInfo(ytbUrl);
  const formats = ytdl.filterFormats(video.formats, 'videoandaudio');
  formats.sort((a, b) => b.bitrate - a.bitrate);
  const bestFormat = gopeed.settings.quality === 'lowest' ? formats[formats.length - 1] : formats[0];
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
