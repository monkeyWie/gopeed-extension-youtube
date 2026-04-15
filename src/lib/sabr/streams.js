import { Constants } from 'youtubei.js';
import { SabrStream } from 'googlevideo/sabr-stream';
import { buildSabrFormat } from 'googlevideo/utils';

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

async function openPreparedSabrStreamsInternal(prepared, poToken) {
  if (!prepared || typeof prepared !== 'object' || !prepared.__sabrPrepared) {
    throw new Error('Invalid prepared SABR session');
  }

  if (typeof poToken !== 'string' || poToken.length === 0) {
    throw new Error('poToken is required');
  }

  prepared.yt.session.player.po_token = poToken;

  const info = await prepared.yt.getInfo(prepared.videoId, { po_token: poToken });

  if (!info.streaming_data?.server_abr_streaming_url || !info.streaming_data?.adaptive_formats?.length) {
    throw new Error(
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
    throw new Error('Missing video playback ustreamer config');
  }

  const sabrUrl = new URL(decipheredServerAbrStreamingUrl);
  sabrUrl.searchParams.set('alr', 'yes');
  sabrUrl.searchParams.set('cpn', info.cpn);

  const sabr = new SabrStream({
    serverAbrStreamingUrl: sabrUrl.toString(),
    videoPlaybackUstreamerConfig: ustreamerConfig,
    clientInfo: createClientInfo(prepared.yt.session),
    poToken,
    formats: adaptiveFormats,
  });

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

  const { videoStream, audioStream, selectedFormats } = await sabr.start({
    videoFormat: selectedVideoFormat,
    preferMP4: !prepared.preferWebM,
    preferWebM: prepared.preferWebM,
    preferH264: prepared.preferH264,
  });

  return {
    videoId: prepared.videoId,
    poToken,
    poTokenSource: 'provided',
    info,
    context: prepared.yt.session.context,
    selectedFormats,
    videoStream,
    audioStream,
    abort: () => sabr.abort(),
  };
}

export async function prepareSabrStreams({
  input,
  quality = '1080p',
  preferWebM = false,
  preferH264 = true,
  fallbackToBest = false,
} = {}) {
  if (!input) {
    throw new Error('Missing YouTube URL or videoId');
  }

  const videoId = extractVideoId(input);
  const yt = await createLocalApiInnertube();
  const context = yt.session.context;
  const poTokenExpression = createPoTokenExpression({ videoId, context });

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
  };

  return prepared;
}

export async function openPreparedSabrStreams(prepared, poToken) {
  return await openPreparedSabrStreamsInternal(prepared, poToken);
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
    throw new Error(
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
