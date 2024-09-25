import { Innertube } from 'youtubei.js';

// https://www.youtube.com/watch?v=aqz-KE-bpKQ
// https://youtu.be/aqz-KE-bpKQ
gopeed.events.onResolve(async (ctx) => {
  let url = ctx.req.url;
  let videoId;
  if (url.includes('youtube.com/')) {
    videoId = new URL(url).searchParams.get('v');
  }
  if (url.includes('youtu.be/') || url.includes('youtube.com/shorts/')) {
    videoId = url.split('/').pop();
  }

  const youtube = await Innertube.create({
    cache: {
      get: async (key) => {
        const value = gopeed.storage.get(key);
        if (!value) {
          return;
        }
        const buffer = base64ToArrayBuffer(value);
        return buffer;
      },
      set: async (key, value) => {
        const text = arrayBufferToBase64(value);
        gopeed.storage.set(key, text);
      },
      remove: async (key) => {
        gopeed.storage.remove(key);
      },
    },
    timezone: '',
  });

  const quality = gopeed.settings.quality === 'lowest' ? '360p' : 'best';

  const info = await youtube.getInfo(videoId);

  /**
   * @type {Array<import('@gopeed/types').FileInfo>}
   */
  const files = [];
  if (gopeed.settings.separateStreams === true) {
    const video = info.chooseFormat({
      type: 'video',
      quality,
    });
    const audio = info.chooseFormat({
      type: 'audio',
      quality,
    });
    files.push(
      {
        name: `${info.basic_info.title}.${video.quality_label}.video${mimeTypeToExt(video.mime_type, 'mp4')}`,
        size: video.content_length,
        req: {
          url: getDownloadUrl(info, video),
        },
      },
      {
        name: `${info.basic_info.title}.${parseInt(audio.bitrate / 1000)}kbps.audio${mimeTypeToExt(
          audio.mime_type,
          'webm'
        )}`,
        size: audio.content_length,
        req: {
          url: getDownloadUrl(info, audio),
        },
      }
    );
  } else {
    const bestFormat = info.chooseFormat({
      type: 'video+audio',
      quality,
    });
    files.push({
      name: `${info.basic_info.title}.${bestFormat.quality_label}${mimeTypeToExt(bestFormat.mime_type, 'mp4')}`,
      size: bestFormat.content_length,
      req: {
        url: getDownloadUrl(info, bestFormat),
        extra: {
          header: {
            Referer: 'https://www.youtube.com/',
          },
        },
      },
    });
  }

  ctx.res = {
    name: info.basic_info.title,
    files,
  };
});

/**
 * Get direct download url
 * @typedef {Awaited<ReturnType<Innertube['getBasicInfo']>>} VideoInfo
 * @typedef {ReturnType<VideoInfo['chooseFormat']>} Format
 * @param {VideoInfo} info
 * @param {Format} format
 * @returns {string}
 */
function getDownloadUrl(info, format) {
  const formatUrl = format.decipher(info.actions.session.player);
  return `${formatUrl}&cpn=${info.cpn}`;
}

function arrayBufferToBase64(buffer) {
  let binary = '';
  // eslint-disable-next-line no-undef
  const bytes = new Uint8Array(buffer);
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

function base64ToArrayBuffer(base64) {
  const binaryString = atob(base64);
  const len = binaryString.length;
  // eslint-disable-next-line no-undef
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes.buffer;
}

function mimeTypeToExt(mimeType, fallback) {
  if (!mimeType) {
    return '.' + fallback;
  }
  return '.' + mimeType.split(';')[0].split('/')[1];
}
