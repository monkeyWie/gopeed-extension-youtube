import { Innertube } from 'youtubei.js';

const youtube = await Innertube.create({
  timezone: '',
});
const info = await youtube.getInfo('aqz-KE-bpKQ');

const format = info.chooseFormat({
  type: 'video+audio',
  quality: 'best',
});
console.log(JSON.stringify(format));
console.log(format.url);
