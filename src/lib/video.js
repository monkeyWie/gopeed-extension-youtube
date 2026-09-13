import { createLocalApiInnertube, extractVideoId } from './sabr/common.js';

export async function resolveVideo(input) {
  const id = extractVideoId(input);
  const yt = await createLocalApiInnertube({ withPlayer: false });
  const info = await yt.getBasicInfo(id);
  const title = info.basic_info?.title;
  if (!title) throw new MessageError(info.playability_status?.reason || 'Unable to read YouTube video information.');
  return { id, title };
}
