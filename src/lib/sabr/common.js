import { Innertube, Platform } from 'youtubei.js';
import bgutilsBundleSource from '../../../node_modules/bgutils-js/bundle/index.cjs?raw';

export const DEFAULT_BROWSER_USER_AGENT =
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36';

const DEFAULT_REQUEST_KEY = 'O43z0dpjhgX20SCx4KAo';

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

export function extractVideoId(value) {
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

export async function createLocalApiInnertube({
  withPlayer = true,
  clientType = 'WEB',
  generateSessionLocally = false,
  fetchFunc = null,
  userAgent = DEFAULT_BROWSER_USER_AGENT,
} = {}) {
  return await Innertube.create({
    timezone: '',
    enable_session_cache: false,
    retrieve_innertube_config: !generateSessionLocally,
    user_agent: userAgent,
    retrieve_player: withPlayer,
    client_type: clientType,
    fetch: fetchFunc ?? ((input, init) => fetch(input, init)),
    generate_session_locally: generateSessionLocally,
  });
}

export function buildPoTokenExpression({
  videoId,
  context,
  bgutilsBundleSource: bundleSource = bgutilsBundleSource,
  requestKey = DEFAULT_REQUEST_KEY,
}) {
  if (!videoId) {
    throw new Error('videoId is required');
  }

  if (!context || typeof context !== 'object') {
    throw new Error('context is required');
  }

  if (typeof bundleSource !== 'string' || bundleSource.length === 0) {
    throw new Error('bgutilsBundleSource is required');
  }

  return `(async () => {
    const bgutilsModule = { exports: {} };
    (() => {
      const module = bgutilsModule;
      const exports = module.exports;
      ${bundleSource}
    })();

    const { BG, buildURL: bgutilsBuildURL, GOOG_API_KEY: bgutilsApiKey } = bgutilsModule.exports;
    const videoId = ${JSON.stringify(videoId)};
    const context = ${JSON.stringify(context)};
    const requestKey = ${JSON.stringify(requestKey)};

    const challengeResponse = await fetch('https://www.youtube.com/youtubei/v1/att/get?prettyPrint=false&alt=json', {
      method: 'POST',
      headers: {
        Accept: '*/*',
        'Content-Type': 'application/json',
        'X-Goog-Visitor-Id': context.client.visitorData,
        'X-Youtube-Client-Version': context.client.clientVersion,
        'X-Youtube-Client-Name': '1'
      },
      body: JSON.stringify({
        engagementType: 'ENGAGEMENT_TYPE_UNBOUND',
        context
      })
    });

    if (!challengeResponse.ok) {
      throw new Error(\`Request to \${challengeResponse.url} failed with status \${challengeResponse.status}\\n\${await challengeResponse.text()}\`);
    }

    const challengeData = await challengeResponse.json();

    if (!challengeData.bgChallenge) {
      throw new Error('Failed to get BotGuard challenge');
    }

    let interpreterUrl = challengeData.bgChallenge.interpreterUrl.privateDoNotAccessOrElseTrustedResourceUrlWrappedValue;

    if (interpreterUrl.startsWith('//')) {
      interpreterUrl = \`https:\${interpreterUrl}\`;
    }

    await new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = interpreterUrl;
      script.async = true;
      script.onload = () => resolve();
      script.onerror = () => reject(new TypeError('Failed to load BotGuard interpreter'));
      (document.head || document.documentElement || document.body).appendChild(script);
    });

    const botGuard = await BG.BotGuardClient.create({
      program: challengeData.bgChallenge.program,
      globalName: challengeData.bgChallenge.globalName,
      globalObj: window
    });

    const webPoSignalOutput = [];
    const botGuardResponse = await botGuard.snapshot({ webPoSignalOutput }, 10000);

    const integrityTokenResponse = await fetch(bgutilsBuildURL('GenerateIT', true), {
      method: 'POST',
      headers: {
        'content-type': 'application/json+protobuf',
        'x-goog-api-key': bgutilsApiKey,
        'x-user-agent': 'grpc-web-javascript/0.1'
      },
      body: JSON.stringify([requestKey, botGuardResponse])
    });

    const integrityTokenJson = await integrityTokenResponse.json();

    if (typeof integrityTokenJson[0] !== 'string') {
      throw new Error('Could not get integrity token');
    }

    const webPoMinter = await BG.WebPoMinter.create({
      integrityToken: integrityTokenJson[0]
    }, webPoSignalOutput);

    return await webPoMinter.mintAsWebsafeString(videoId);
  })()`;
}

export function createPoTokenExpression({ videoId, context } = {}) {
  return buildPoTokenExpression({
    videoId,
    context,
  });
}

export function getFileExtension(mimeType, fallback) {
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

function isVideoFormat(format) {
  return typeof format?.mimeType === 'string' && format.mimeType.includes('video');
}

function getFormatResolutionValue(format) {
  const width = Number(format?.width);
  const height = Number(format?.height);

  if (!Number.isFinite(width) || !Number.isFinite(height) || width <= 0 || height <= 0) {
    return null;
  }

  return width < height ? width : height;
}

function getFormatResolutionLabel(format) {
  const resolutionValue = getFormatResolutionValue(format);

  if (resolutionValue !== null) {
    return `${resolutionValue}p`;
  }

  if (typeof format?.qualityLabel === 'string' && format.qualityLabel.length > 0) {
    return format.qualityLabel;
  }

  return null;
}

function parseQuality(quality) {
  const normalizedQuality =
    typeof quality === 'string' && quality.trim().length > 0 ? quality.trim().toLowerCase() : '1080p';

  if (normalizedQuality === 'highest') {
    return { kind: 'best' };
  }

  if (normalizedQuality === 'best' || normalizedQuality === 'lowest') {
    return { kind: normalizedQuality };
  }

  const match = normalizedQuality.match(/^(\d+)\s*p?$/);

  if (!match) {
    throw new Error(`Unsupported video quality: ${quality}`);
  }

  return {
    kind: 'resolution',
    value: Number(match[1]),
    label: `${Number(match[1])}p`,
  };
}

function getPreferenceScore(format, preferences = {}) {
  let score = 0;
  const mimeType = typeof format?.mimeType === 'string' ? format.mimeType.toLowerCase() : '';

  if (preferences.preferWebM && mimeType.includes('webm')) {
    score += 4;
  }

  if (preferences.preferMP4 && mimeType.includes('mp4')) {
    score += 4;
  }

  if (preferences.preferH264 && (mimeType.includes('avc') || mimeType.includes('h264'))) {
    score += 2;
  }

  return score;
}

function compareByPreferences(a, b, preferences = {}) {
  const scoreDiff = getPreferenceScore(b, preferences) - getPreferenceScore(a, preferences);

  if (scoreDiff !== 0) {
    return scoreDiff;
  }

  const bitrateA = Number(a?.averageBitrate ?? a?.bitrate ?? 0);
  const bitrateB = Number(b?.averageBitrate ?? b?.bitrate ?? 0);

  if (bitrateB !== bitrateA) {
    return bitrateB - bitrateA;
  }

  const contentLengthA = Number(a?.contentLength ?? 0);
  const contentLengthB = Number(b?.contentLength ?? 0);

  if (contentLengthB !== contentLengthA) {
    return contentLengthB - contentLengthA;
  }

  return Number(a?.itag ?? 0) - Number(b?.itag ?? 0);
}

function getAvailableResolutions(formats) {
  const values = new Set();

  for (const format of formats) {
    const label = getFormatResolutionLabel(format);

    if (label) {
      values.add(label);
    }
  }

  return [...values].sort((a, b) => Number.parseInt(b, 10) - Number.parseInt(a, 10));
}

function selectHighestVideoFormat(formats, preferences = {}) {
  return [...formats].sort((a, b) => {
    if (b.resolutionValue !== a.resolutionValue) {
      return b.resolutionValue - a.resolutionValue;
    }

    return compareByPreferences(a.format, b.format, preferences);
  })[0];
}

export function selectVideoFormat(formats, quality = '1080p', preferences = {}, options = {}) {
  if (!Array.isArray(formats) || formats.length === 0) {
    throw new Error('No video formats available');
  }

  const videoFormats = formats.filter((format) => isVideoFormat(format));

  if (videoFormats.length === 0) {
    throw new Error('No video formats available');
  }

  const parsedQuality = parseQuality(quality);
  const resolvedFormats = videoFormats
    .map((format) => ({
      format,
      resolutionValue: getFormatResolutionValue(format),
      resolutionLabel: getFormatResolutionLabel(format),
    }))
    .filter(({ resolutionValue }) => resolutionValue !== null);

  let candidates = resolvedFormats;

  if (parsedQuality.kind === 'resolution') {
    candidates = resolvedFormats.filter(({ resolutionValue }) => resolutionValue === parsedQuality.value);

    if (candidates.length === 0) {
      if (options.fallbackToBest) {
        const selectedFallbackFormat = selectHighestVideoFormat(resolvedFormats, preferences);

        if (selectedFallbackFormat) {
          return selectedFallbackFormat.format;
        }
      }

      const availableResolutions = getAvailableResolutions(resolvedFormats.map(({ format }) => format));
      throw new MessageError(
        `Unable to find a ${parsedQuality.label} video format. Available resolutions: ${
          availableResolutions.length > 0 ? availableResolutions.join(', ') : 'unknown'
        }`
      );
    }

    candidates = [...candidates].sort((a, b) => compareByPreferences(a.format, b.format, preferences));
  } else if (parsedQuality.kind === 'best') {
    candidates = [...resolvedFormats].sort((a, b) => {
      if (b.resolutionValue !== a.resolutionValue) {
        return b.resolutionValue - a.resolutionValue;
      }

      return compareByPreferences(a.format, b.format, preferences);
    });
  } else if (parsedQuality.kind === 'lowest') {
    candidates = [...resolvedFormats].sort((a, b) => {
      if (a.resolutionValue !== b.resolutionValue) {
        return a.resolutionValue - b.resolutionValue;
      }

      return compareByPreferences(a.format, b.format, preferences);
    });
  }

  const selected = candidates.length > 0 ? candidates[0] : undefined;

  if (!selected) {
    if (options.fallbackToBest) {
      const selectedFallbackFormat = selectHighestVideoFormat(resolvedFormats, preferences);

      if (selectedFallbackFormat) {
        return selectedFallbackFormat.format;
      }
    }

    const availableResolutions = getAvailableResolutions(resolvedFormats.map(({ format }) => format));
    throw new MessageError(
      `Unable to select a video format for ${
        parsedQuality.kind === 'resolution' ? parsedQuality.label : quality
      }. Available resolutions: ${availableResolutions.length > 0 ? availableResolutions.join(', ') : 'unknown'}`
    );
  }

  return selected.format;
}
