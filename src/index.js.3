import ytdl from 'ytdl-core';

// https://www.youtube.com/watch?v=aqz-KE-bpKQ
gopeed.events.onResolve(async (ctx) => {
  var url = ctx.req.url;
  var ytbUrl = url;
  if (url.includes('youtu.be/')) {
    ytbUrl = new URL(url).pathname.substring(1);
  }
  const info = await ytdl.getInfo(ytbUrl);
  const files = [];
  if (gopeed.settings.separateStreams === true) {
    const videoQuality = gopeed.settings.quality === 'lowest' ? 'lowestvideo' : 'highestvideo';
    const video = ytdl.chooseFormat(info.formats, { quality: videoQuality });
    const audio = getFormat(info, 'audioonly');
    files.push(
      {
        name: `${info.videoDetails.title}.${video.qualityLabel}.video${mimeTypeToExt(video.mimeType, 'mp4')}`,
        size: video.contentLength,
        req: {
          url: video.url,
        },
      },
      {
        name: `${info.videoDetails.title}.${audio.audioBitrate}kbps.audio${mimeTypeToExt(audio.mimeType, 'webm')}`,
        size: audio.contentLength,
        req: {
          url: audio.url,
        },
      }
    );
  } else {
    const bestFormat = getFormat(info, 'videoandaudio');
    files.push({
      name: `${info.videoDetails.title}.${bestFormat.qualityLabel}${mimeTypeToExt(bestFormat.mimeType, 'mp4')}`,
      size: bestFormat.contentLength,
      req: {
        url: bestFormat.url,
      },
    });
  }

  ctx.res = {
    name: info.videoDetails.title,
    files,
  };
});

function getFormat(info, filter) {
  const formats = ytdl.filterFormats(info.formats, filter);
  formats.sort((a, b) => b.bitrate - a.bitrate);
  return gopeed.settings.quality === 'lowest' ? formats[formats.length - 1] : formats[0];
}

function mimeTypeToExt(mimeType, fallback) {
  if (!mimeType) {
    return '.' + fallback;
  }
  return '.' + mimeType.split(';')[0].split('/')[1];
}
