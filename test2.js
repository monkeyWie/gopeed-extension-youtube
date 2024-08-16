import ytdl from '@distube/ytdl-core';

// Get video info with download formats
const info = await ytdl.getInfo('https://www.youtube.com/shorts/AUanm4c_JfM');

const fmt = ytdl.chooseFormat(info.formats, {
  quality: 'highest',
  filter: 'audioandvideo',
});

console.log(fmt.url);
