import { getCookieHeader } from '../cookies.js';
import { Innertube, Platform } from 'youtubei.js';
import bgutilsBundleSource from '../../../.generated/bgutils.js?raw';

export const DEFAULT_BROWSER_USER_AGENT =
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36';

const DEFAULT_REQUEST_KEY = 'O43z0dpjhgX20SCx4KAo';

Platform.shim.eval = async (data) => {
  // YouTube.js 18 appends its decipher invocation and return statement to output.
  const output = data.output.replace('const window = Object.assign({}, globalThis);', '');
  return new Function(`const window = globalThis;\n${output}`)();
};

export function extractVideoId(value) {
  let id = value;
  try {
    const url = new URL(value);
    const host = url.hostname.toLowerCase();
    if (host === 'youtu.be') id = url.pathname.split('/')[1];
    else if (host === 'youtube.com' || host.endsWith('.youtube.com')) {
      id =
        url.searchParams.get('v') || (/^\/(shorts|embed|live)\//.test(url.pathname) ? url.pathname.split('/')[2] : '');
    } else id = '';
  } catch (_) {
    /* A bare video ID is also accepted. */
  }
  if (!/^[A-Za-z0-9_-]{11}$/.test(id || ''))
    throw new MessageError('Please enter a valid YouTube video URL or video ID.');
  return id;
}

export async function createLocalApiInnertube({
  withPlayer = true,
  clientType = 'WEB',
  generateSessionLocally = false,
  fetchFunc = null,
  userAgent = DEFAULT_BROWSER_USER_AGENT,
} = {}) {
  return await Innertube.create({
    cookie: getCookieHeader() || undefined,
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
    throw new MessageError('videoId is required');
  }

  if (!context || typeof context !== 'object') {
    throw new MessageError('context is required');
  }

  if (typeof bundleSource !== 'string' || bundleSource.length === 0) {
    throw new MessageError('bgutilsBundleSource is required');
  }

  return `(async () => {
${bundleSource}
return await GopeedBgutils.mint(${JSON.stringify(videoId)}, ${JSON.stringify(requestKey)});
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
    throw new MessageError(`Unsupported video quality: ${quality}`);
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
    throw new MessageError('No video formats available');
  }

  const videoFormats = formats.filter((format) => isVideoFormat(format));

  if (videoFormats.length === 0) {
    throw new MessageError('No video formats available');
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
