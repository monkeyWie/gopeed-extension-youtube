import { createLocalApiInnertube } from './sabr/common.js';

export function extractPlaylistId(input) {
  let url;
  try {
    url = new URL(input);
  } catch (_) {
    return null;
  }
  if (url.pathname.replace(/\/$/, '') !== '/playlist') return null;
  const id = url.searchParams.get('list');
  if (!id || !/^[A-Za-z0-9_-]+$/.test(id)) throw new MessageError('Invalid YouTube playlist URL.');
  return id;
}

export async function resolvePlaylist(id) {
  // Listing does not need player deciphering or a PoToken for every video.
  const yt = await createLocalApiInnertube({ withPlayer: false });
  let page = await yt.getPlaylist(id);
  const title = String(page.info?.title || id);
  const videos = [];
  let position = 0;
  do {
    for (const item of page.items) {
      position++;
      const videoId = item.id || item.content_id || item.on_tap_endpoint?.payload?.videoId;
      if (item.is_playable === false || !/^[A-Za-z0-9_-]{11}$/.test(videoId || '')) continue;
      videos.push({
        id: videoId,
        title: String(item.title || item.metadata?.title || item.overlay_metadata?.primary_text || videoId),
        index: position,
      });
    }
    if (!page.has_continuation) break;
    page = await page.getContinuation();
  } while (true);
  if (!videos.length) throw new MessageError('This YouTube playlist has no available videos.');
  return { title, videos };
}
