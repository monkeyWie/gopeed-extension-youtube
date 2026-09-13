# Gopeed YouTube Extension

Download YouTube videos and playlists with [Gopeed](https://gopeed.com).

> Requires Gopeed version >= 2.0.0.

## Features

- **Videos and Shorts** — Download regular YouTube videos and Shorts.
- **Playlists** — Load a playlist and select the videos you want to download.
- **Up to 8K** — Download in up to 8K resolution when available in the source video.
- **Automatic audio/video merging** — FFmpeg combines separate video and audio tracks into a single MP4, with no manual steps.
- **Quality selection** — Choose your preferred resolution or select **Best** for the highest available quality.

## Install

Open the `Gopeed` extension page, enter `https://github.com/monkeyWie/gopeed-extension-youtube`, and click install.

![](image/install.gif)

## Usage

Open Gopeed's **Create Task** panel, paste a YouTube URL, and click **Download**. The following three URL formats are supported (replace the placeholder IDs with those from your actual link):

| Type | Example URL |
| --- | --- |
| Video | `https://www.youtube.com/watch?v=VIDEO_ID` |
| Playlist | `https://www.youtube.com/playlist?list=PLAYLIST_ID` |
| Shorts | `https://www.youtube.com/shorts/VIDEO_ID` |

For a playlist, select the videos you want to download in the panel.

> After you start a download, the speed may stay at zero for a while before data begins downloading. This is normal: the extension needs to complete YouTube’s PO Token verification first. Please wait; the download will begin automatically once verification is complete.

![](image/create.gif)

### Playlists

Paste a playlist URL into Gopeed to load its available videos, then select the entries you want to download. Video links download only the current video, even when opened from a playlist.

### Video Quality

Choose your preferred resolution in the extension settings. Enable **Fallback to Best Quality** to use the highest available quality when your preferred resolution is unavailable.

## Useful Links

- [YouTube.js](https://github.com/LuanRT/YouTube.js)
- [How to develop a gopeed extension](https://docs.gopeed.com/dev-extension.html)
