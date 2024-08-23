# Gopeed YouTube Extension

Download YouTube videos easily with [Gopeed](https://gopeed.com).

## Install

Open the `Gopeed` extension page, enter `https://github.com/monkeyWie/gopeed-extension-youtube`, and click install.

![](image/install.gif)

## Usage

Create task with youtube video url, and click `Download` button, then the video will be resolved and ready to download.

![](image/create.gif)

### Video Quality

Typically 1080p or better videos do not have audio encoded with it, this extension defaults to downloading audio and video without separation, so the video quality will all be lower than 1080p. If you want to download the highest quality video, you can choose the `audio` and `video` separately on extension settings page, and then use `ffmpeg` to merge them.

- ffmpeg command

```bash
ffmpeg -i video.webm -i audio.mp4 -c:v copy -c:a copy output.mp4
```

## Useful Links

- [YouTube.js](https://github.com/LuanRT/YouTube.js)
- [How to develop a gopeed extension](https://docs.gopeed.com/dev-extension.html)
