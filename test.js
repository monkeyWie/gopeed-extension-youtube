import { Innertube } from 'youtubei.js';

const youtube = await Innertube.create({
  timezone: '',
});
const info = await youtube.getInfo('aqz-KE-bpKQ');

const format = info.chooseFormat({
  type: 'audio',
  quality: 'best',
});

const format_url = format.decipher(info.actions.session.player);
const download_url = `${format_url}&cpn=${info.cpn}`;

console.log(download_url);
