import { BotGuardClient } from 'bgutils-js/botguard';
import { WebPoMinter } from 'bgutils-js/webpo';
import { buildURL, getHeaders, parseLooseJSON } from 'bgutils-js/utils';

export async function mint(videoId, requestKey) {
  const pageResponse = await fetch('https://www.youtube.com/');
  if (!pageResponse.ok) throw new Error(`Unable to load YouTube verification page (${pageResponse.status}).`);
  const html = await pageResponse.text();
  const config = html.match(/ytcfg\.set\(({.+?})\);/s)?.[1];
  const attestation = html.match(/window\.ytAtN\(\s*({[\s\S]*?})\s*\)/)?.[1];
  if (!config || !attestation) throw new Error('YouTube verification configuration is unavailable.');
  // BotGuard requires the EVENT_ID associated with this page's challenge.
  window.yt = { ...window.yt, config_: JSON.parse(config) };
  const challenge = parseLooseJSON(attestation).R?.bgChallenge;
  if (!challenge) throw new Error('YouTube verification challenge is unavailable.');
  const interpreterURL = new URL(
    challenge.interpreterUrl.privateDoNotAccessOrElseTrustedResourceUrlWrappedValue,
    location.href
  );
  await new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = interpreterURL.href;
    script.onload = resolve;
    script.onerror = () => reject(new Error('Unable to load the YouTube verification interpreter.'));
    document.head.appendChild(script);
  });
  const client = await BotGuardClient.create({
    program: challenge.program,
    globalName: challenge.globalName,
    globalObject: window,
  });
  try {
    const webPoSignalOutput = [];
    const response = await client.snapshot({ webPoSignalOutput }, 10000);
    const result = await fetch(buildURL('GenerateIT', true), {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify([requestKey, response]),
    });
    if (!result.ok) throw new Error(`YouTube integrity verification failed (${result.status}).`);
    const [integrityToken, estimatedTtlSecs, mintRefreshThreshold, websafeFallbackToken] = await result.json();
    if (!integrityToken) throw new Error('YouTube did not return an integrity token.');
    const minter = await WebPoMinter.create(
      { integrityToken, estimatedTtlSecs, mintRefreshThreshold, websafeFallbackToken },
      webPoSignalOutput
    );
    return await minter.mintAsWebsafeString(videoId);
  } finally {
    await client.shutdown().catch(() => {});
  }
}
