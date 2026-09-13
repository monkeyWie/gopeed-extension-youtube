import { spawn } from 'child_process';
import { createWriteStream } from 'fs';
import { mkdir, readFile } from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

import { Constants, Innertube, Platform } from 'youtubei.js';
import { SabrStream } from 'googlevideo/sabr-stream';
import { buildSabrFormat } from 'googlevideo/utils';

import { selectVideoFormat } from './lib/sabr/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DEFAULT_BROWSER_USER_AGENT =
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36';
const DEFAULT_REQUEST_KEY = 'O43z0dpjhgX20SCx4KAo';
const DEFAULT_INPUT = 'https://www.youtube.com/watch?v=dQw4w9WgXcQ';
const DEFAULT_OUTPUT_DIR = path.resolve('/tmp', 'gopeed-extension-ytb-test');
const DEFAULT_BROWSER_JS_PATH = path.resolve(__dirname, '..', '..', 'youtubei-minimal', 'browser-js');
const BGUTILS_BUNDLE_PATH = path.resolve(__dirname, '..', '.generated', 'bgutils.js');

Platform.shim.eval = async (data, env) => {
  const properties = [];

  if (env.n) {
    properties.push(`n: exportedVars.nFunction(${JSON.stringify(env.n)})`);
  }

  if (env.sig) {
    properties.push(`sig: exportedVars.sigFunction(${JSON.stringify(env.sig)})`);
  }

  const modifiedOutput = data.output.replace('const window = Object.assign({}, globalThis);', '');
  const code = `const window = globalThis;\n${modifiedOutput}\nreturn {${properties.join(', ')}}`;

  return new Function(code)();
};

function parseArgs(argv) {
  const args = {
    input: DEFAULT_INPUT,
    outputDir: DEFAULT_OUTPUT_DIR,
    quality: '1080p',
    preferWebM: false,
    preferH264: true,
    fallbackToBest: false,
    browserJsPath: DEFAULT_BROWSER_JS_PATH,
  };

  for (let index = 0; index < argv.length; index += 1) {
    const value = argv[index];

    if (!value.startsWith('--')) {
      args.input = value;
      continue;
    }

    if (value === '--output') {
      args.outputDir = path.resolve(argv[index + 1]);
      index += 1;
      continue;
    }

    if (value === '--quality') {
      args.quality = argv[index + 1];
      index += 1;
      continue;
    }

    if (value === '--browser-js') {
      args.browserJsPath = path.resolve(argv[index + 1]);
      index += 1;
      continue;
    }

    if (value === '--prefer-webm') {
      args.preferWebM = true;
      continue;
    }

    if (value === '--no-prefer-h264') {
      args.preferH264 = false;
      continue;
    }

    if (value === '--fallback') {
      args.fallbackToBest = true;
      continue;
    }

    if (value === '--no-fallback') {
      args.fallbackToBest = false;
      continue;
    }

    throw new Error(`Unknown argument: ${value}`);
  }

  return args;
}

function extractVideoId(value) {
  try {
    const url = new URL(value);

    if (url.hostname === 'youtu.be') {
      return url.pathname.slice(1);
    }

    if (url.searchParams.has('v')) {
      return url.searchParams.get('v');
    }
  } catch {
    return value;
  }

  return value;
}

function getFileExtension(mimeType, fallback) {
  if (typeof mimeType !== 'string') {
    return fallback;
  }

  if (mimeType.includes('mp4')) {
    return fallback === 'm4a' ? 'm4a' : 'mp4';
  }

  if (mimeType.includes('webm')) {
    return 'webm';
  }

  return fallback;
}

function sanitizeFileName(value) {
  return (value || 'youtube').replace(/[<>:"/\\|?*\u0000-\u001f]/g, '_').trim();
}

async function createLocalApiInnertube() {
  return await Innertube.create({
    enable_session_cache: false,
    retrieve_innertube_config: true,
    user_agent: DEFAULT_BROWSER_USER_AGENT,
    retrieve_player: true,
    client_type: 'WEB',
    fetch: (input, init) => fetch(input, init),
    generate_session_locally: false,
  });
}

async function loadBgutilsBundleSource() {
  return await readFile(BGUTILS_BUNDLE_PATH, 'utf8');
}

function buildPoTokenExpression({ videoId, bgutilsBundleSource }) {
  return `(async () => {
${bgutilsBundleSource}
return await GopeedBgutils.mint(${JSON.stringify(videoId)}, ${JSON.stringify(DEFAULT_REQUEST_KEY)});
})()`;
}

async function executeBrowserJs(browserJsPath, expression) {
  return await new Promise((resolve, reject) => {
    const child = spawn(browserJsPath, ['eval', '--url', 'https://www.youtube.com/robots.txt', '--expr', expression], {
      cwd: path.resolve(__dirname, '..', '..'),
      stdio: ['ignore', 'pipe', 'pipe'],
    });

    let stdout = '';
    let stderr = '';

    child.stdout.on('data', (chunk) => {
      stdout += chunk.toString();
    });

    child.stderr.on('data', (chunk) => {
      stderr += chunk.toString();
    });

    child.on('error', reject);

    child.on('close', (code) => {
      if (code === 0) {
        resolve(stdout.trim());
      } else {
        reject(new Error(stderr.trim() || `browser-js exited with code ${code}`));
      }
    });
  });
}

function createClientInfo(session) {
  const { clientName, clientVersion, osName, osVersion } = session.context.client;

  return {
    clientName: Constants.CLIENT_NAME_IDS[clientName],
    clientVersion,
    osName,
    osVersion,
  };
}

async function writeStreamToFile(stream, filePath) {
  const reader = stream.getReader();
  const writer = createWriteStream(filePath);
  let totalBytes = 0;

  try {
    while (true) {
      const { value, done } = await reader.read();

      if (done) {
        break;
      }

      totalBytes += value.length;

      await new Promise((resolve, reject) => {
        writer.write(value, (error) => {
          if (error) {
            reject(error);
          } else {
            resolve();
          }
        });
      });
    }

    await new Promise((resolve, reject) => {
      writer.end((error) => {
        if (error) {
          reject(error);
        } else {
          resolve();
        }
      });
    });

    return totalBytes;
  } catch (error) {
    writer.destroy(error);
    throw error;
  } finally {
    reader.releaseLock();
  }
}

async function main() {
  const options = parseArgs(process.argv.slice(2));
  const videoId = extractVideoId(options.input);
  const yt = await createLocalApiInnertube();
  const bgutilsSource = await loadBgutilsBundleSource();
  const poTokenExpression = buildPoTokenExpression({
    videoId,
    context: yt.session.context,
    bgutilsBundleSource: bgutilsSource,
  });
  const poToken = await executeBrowserJs(options.browserJsPath, poTokenExpression);

  yt.session.player.po_token = poToken;

  const info = await yt.getInfo(videoId, { po_token: poToken });

  if (!info.streaming_data?.server_abr_streaming_url || !info.streaming_data?.adaptive_formats?.length) {
    throw new Error(
      `No SABR streaming data returned. status=${info.playability_status?.status ?? 'unknown'} reason=${
        info.playability_status?.reason ?? ''
      }`
    );
  }

  const decipheredServerAbrStreamingUrl = await yt.session.player.decipher(
    info.streaming_data.server_abr_streaming_url
  );
  const adaptiveFormats = info.streaming_data.adaptive_formats.map((format) => buildSabrFormat(format));
  const ustreamerConfig =
    info.player_config?.media_common_config?.media_ustreamer_request_config?.video_playback_ustreamer_config;

  if (!ustreamerConfig) {
    throw new Error('Missing video playback ustreamer config');
  }

  const sabrUrl = new URL(decipheredServerAbrStreamingUrl);
  sabrUrl.searchParams.set('alr', 'yes');
  sabrUrl.searchParams.set('cpn', info.cpn);

  const sabr = new SabrStream({
    serverAbrStreamingUrl: sabrUrl.toString(),
    videoPlaybackUstreamerConfig: ustreamerConfig,
    clientInfo: createClientInfo(yt.session),
    poToken,
    formats: adaptiveFormats,
  });

  const selectedVideoFormat = selectVideoFormat(
    adaptiveFormats,
    options.quality,
    {
      preferWebM: options.preferWebM,
      preferMP4: !options.preferWebM,
      preferH264: options.preferH264,
    },
    {
      fallbackToBest: options.fallbackToBest,
    }
  );

  const { videoStream, audioStream, selectedFormats } = await sabr.start({
    videoFormat: selectedVideoFormat,
    preferMP4: !options.preferWebM,
    preferWebM: options.preferWebM,
    preferH264: options.preferH264,
  });

  const title =
    info?.basic_info?.title || info?.video_details?.title || selectedFormats.videoFormat.qualityLabel || videoId;
  const baseName = sanitizeFileName(title);
  const outputDir = path.join(options.outputDir, videoId);
  const videoPath = path.join(
    outputDir,
    `${baseName}.video.${getFileExtension(selectedFormats.videoFormat.mimeType, 'mp4')}`
  );
  const audioPath = path.join(
    outputDir,
    `${baseName}.audio.${getFileExtension(selectedFormats.audioFormat.mimeType, 'm4a')}`
  );

  await mkdir(outputDir, { recursive: true });

  try {
    const [videoBytes, audioBytes] = await Promise.all([
      writeStreamToFile(videoStream, videoPath),
      writeStreamToFile(audioStream, audioPath),
    ]);

    console.log(
      JSON.stringify(
        {
          videoId,
          title,
          poTokenLength: poToken.length,
          outputDir,
          selectedFormats: {
            video: {
              itag: selectedFormats.videoFormat.itag,
              mimeType: selectedFormats.videoFormat.mimeType,
              qualityLabel: selectedFormats.videoFormat.qualityLabel,
              file: videoPath,
              bytes: videoBytes,
            },
            audio: {
              itag: selectedFormats.audioFormat.itag,
              mimeType: selectedFormats.audioFormat.mimeType,
              audioQuality: selectedFormats.audioFormat.audioQuality,
              file: audioPath,
              bytes: audioBytes,
            },
          },
        },
        null,
        2
      )
    );
  } finally {
    sabr.abort();
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
