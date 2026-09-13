import { Constants, Player, Utils } from 'youtubei.js';
import { SabrStream } from 'googlevideo/sabr-stream';
import { browserFetch, getBrowserUserAgent } from '../browser.js';
import { BoundedSabrStream } from './bounded-stream.js';
import { buildSabrFormat, EnabledTrackTypes } from 'googlevideo/utils';

import { createLocalApiInnertube, createPoTokenExpression, extractVideoId, selectVideoFormat } from './common.js';

function createClientInfo(session) {
  const { clientName, clientVersion, osName, osVersion } = session.context.client;

  return {
    clientName: Constants.CLIENT_NAME_IDS[clientName],
    clientVersion,
    osName,
    osVersion,
  };
}

function assertPreparedSabrSession(prepared, poToken) {
  if (!prepared || typeof prepared !== 'object' || !prepared.__sabrPrepared) {
    throw new MessageError('Invalid prepared SABR session');
  }

  if (typeof poToken !== 'string' || poToken.length === 0) {
    throw new MessageError('poToken is required');
  }
}

async function preparePreparedSabrSessionInternal(prepared, poToken) {
  assertPreparedSabrSession(prepared, poToken);
  prepared.yt.session.player.po_token = poToken;

  const info = await prepared.yt.getInfo(prepared.videoId, { po_token: poToken });

  if (!info.streaming_data?.server_abr_streaming_url || !info.streaming_data?.adaptive_formats?.length) {
    throw new MessageError(
      `No SABR streaming data returned. status=${info.playability_status?.status ?? 'unknown'} reason=${
        info.playability_status?.reason ?? ''
      }`
    );
  }

  const decipheredServerAbrStreamingUrl = await prepared.yt.session.player.decipher(
    info.streaming_data.server_abr_streaming_url
  );
  const adaptiveFormats = info.streaming_data.adaptive_formats.map((format) => buildSabrFormat(format));
  const ustreamerConfig =
    info.player_config?.media_common_config?.media_ustreamer_request_config?.video_playback_ustreamer_config;

  if (!ustreamerConfig) {
    throw new MessageError('Missing video playback ustreamer config');
  }

  const sabrUrl = new URL(decipheredServerAbrStreamingUrl);
  sabrUrl.searchParams.set('alr', 'yes');
  sabrUrl.searchParams.set('cpn', info.cpn);

  const sabrConfig = {
    serverAbrStreamingUrl: sabrUrl.toString(),
    videoPlaybackUstreamerConfig: ustreamerConfig,
    clientInfo: createClientInfo(prepared.yt.session),
    poToken,
    formats: adaptiveFormats,
    fetch: browserFetch(await getBrowserUserAgent()),
  };

  const selectedVideoFormat = selectVideoFormat(
    adaptiveFormats,
    prepared.quality,
    {
      preferWebM: prepared.preferWebM,
      preferMP4: !prepared.preferWebM,
      preferH264: prepared.preferH264,
    },
    {
      fallbackToBest: prepared.fallbackToBest,
    }
  );

  const selector = new SabrStream(sabrConfig);
  const selectedFormats = selector.selectFormats({
    videoFormat: selectedVideoFormat,
    preferMP4: !prepared.preferWebM,
    preferWebM: prepared.preferWebM,
    preferH264: prepared.preferH264,
  });

  const start = async (enabledTrackTypes = EnabledTrackTypes.VIDEO_AND_AUDIO) => {
    const trackUrl = new URL(sabrConfig.serverAbrStreamingUrl);
    trackUrl.searchParams.set('cpn', Utils.generateRandomString(16));
    const sabr = new BoundedSabrStream({ ...sabrConfig, serverAbrStreamingUrl: trackUrl.toString() });
    const streams = await sabr.start({
      videoFormat: selectedFormats.videoFormat,
      audioFormat: selectedFormats.audioFormat,
      preferMP4: !prepared.preferWebM,
      preferWebM: prepared.preferWebM,
      preferH264: prepared.preferH264,
      enabledTrackTypes,
    });

    return {
      ...streams,
      abort: () => sabr.abort(),
    };
  };

  return {
    videoId: prepared.videoId,
    poToken,
    poTokenSource: 'provided',
    info,
    context: prepared.yt.session.context,
    selectedFormats,
    openStreams: async () => {
      const video = await start(EnabledTrackTypes.VIDEO_ONLY);
      try {
        const audio = await start(EnabledTrackTypes.AUDIO_ONLY);
        return {
          videoStream: video.videoStream,
          audioStream: audio.audioStream,
          abort: () => { video.abort(); audio.abort(); },
        };
      } catch (error) {
        video.abort();
        throw error;
      }
    },
    openVideoStream: async () => {
      const streams = await start(EnabledTrackTypes.VIDEO_ONLY);
      return {
        stream: streams.videoStream,
        abort: streams.abort,
      };
    },
    openAudioStream: async () => {
      const streams = await start(EnabledTrackTypes.AUDIO_ONLY);
      return {
        stream: streams.audioStream,
        abort: streams.abort,
      };
    },
  };
}

async function openPreparedSabrStreamsInternal(prepared, poToken) {
  const session = await preparePreparedSabrSessionInternal(prepared, poToken);
  const { videoStream, audioStream, abort } = await session.openStreams();

  return {
    videoId: prepared.videoId,
    poToken,
    poTokenSource: 'provided',
    info: session.info,
    context: session.context,
    selectedFormats: session.selectedFormats,
    videoStream,
    audioStream,
    abort,
  };
}

export async function prepareSabrStreams({
  input,
  quality = '1080p',
  preferWebM = false,
  preferH264 = true,
  fallbackToBest = false,
  withPlayer = true,
} = {}) {
  if (!input) {
    throw new MessageError('Missing YouTube URL or videoId');
  }

  const videoId = extractVideoId(input);
  const yt = await createLocalApiInnertube({ withPlayer });
  const context = yt.session.context;
  const poTokenExpression = createPoTokenExpression({ videoId, context, includePlayer: !withPlayer });

  const prepared = {
    __sabrPrepared: true,
    input,
    videoId,
    context,
    quality,
    preferWebM,
    preferH264,
    fallbackToBest,
    poTokenExpression,
    yt,
    open: async (poToken) => await openPreparedSabrStreamsInternal(prepared, poToken),
    prepareSession: async (verification) => {
      if (typeof verification === 'string' && yt.session.player) {
        return await preparePreparedSabrSessionInternal(prepared, verification);
      }
      const { player, poToken } = verification || {};
      if (!player?.id || !Number.isFinite(player.timestamp) || typeof player.data?.output !== 'string' || !poToken) {
        throw new MessageError('YouTube player preparation returned an invalid result.');
      }
      yt.session.player = await Player.fromSource(player.id, {
        signature_timestamp: player.timestamp,
        data: player.data,
      });
      return await preparePreparedSabrSessionInternal(prepared, poToken);
    },
  };

  return prepared;
}

export async function openPreparedSabrStreams(prepared, poToken) {
  return await openPreparedSabrStreamsInternal(prepared, poToken);
}

export async function preparePreparedSabrSession(prepared, poToken) {
  return await preparePreparedSabrSessionInternal(prepared, poToken);
}

export async function openSabrStreams({
  input,
  poToken,
  quality = '1080p',
  preferWebM = false,
  preferH264 = true,
  fallbackToBest = false,
} = {}) {
  if (typeof poToken !== 'string' || poToken.length === 0) {
    throw new MessageError(
      'openSabrStreams requires a poToken. Use prepareSabrStreams() first if you need a poTokenExpression.'
    );
  }

  const prepared = await prepareSabrStreams({
    input,
    quality,
    preferWebM,
    preferH264,
    fallbackToBest,
  });

  return await openPreparedSabrStreamsInternal(prepared, poToken);
}
