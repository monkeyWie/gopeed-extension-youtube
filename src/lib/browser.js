// Cache within this extension engine only: do not reuse a UA from another device.
let userAgentPromise;

function getNativeBrowserUserAgent() {
  if (!userAgentPromise) {
    userAgentPromise = (async () => {
      if (!gopeed.runtime?.webview?.isAvailable?.()) {
        throw new MessageError('YouTube downloads require an available Gopeed WebView runtime.');
      }
      const page = await gopeed.runtime.webview.open({ headless: true, title: 'gopeed-youtube-browser' });
      try {
        await page.goto('about:blank', { timeoutMs: 10000 });
        const userAgent = await page.execute('() => navigator.userAgent');
        if (typeof userAgent !== 'string' || !userAgent.trim()) {
          throw new MessageError('Unable to read the WebView user agent.');
        }
        return userAgent;
      } finally {
        await page.close();
      }
    })().catch((error) => {
      userAgentPromise = undefined;
      throw error;
    });
  }
  return userAgentPromise;
}

// Keep the installed browser's engine/version tokens instead of pinning a
// complete UA. Only the mobile platform, Mobile and WebView markers change.
export function desktopUserAgent(nativeUserAgent) {
  const android = /\bAndroid\b/i.test(nativeUserAgent);
  const ios = /\b(iPhone|iPad|iPod)\b/i.test(nativeUserAgent);
  if (!android && !ios) return nativeUserAgent;
  let userAgent = nativeUserAgent.replace(
    /\([^)]*\b(?:Android|iPhone|iPad|iPod)\b[^)]*\)/i,
    android ? '(X11; Linux x86_64)' : '(Macintosh; Intel Mac OS X)'
  );
  userAgent = userAgent.replace(/\bMobile(?:\/[^\s)]+)?\s*/gi, '');
  if (android && /\bwv\b/i.test(nativeUserAgent)) {
    userAgent = userAgent.replace(/;?\s*\bwv\b/gi, '').replace(/\bVersion\/4\.0(?:\s|$)/g, '');
  }
  return userAgent.replace(/\s{2,}/g, ' ').trim();
}

export async function getBrowserProfile() {
  const nativeUserAgent = await getNativeBrowserUserAgent();
  const userAgent = desktopUserAgent(nativeUserAgent);
  return { userAgent, overrideUserAgent: userAgent === nativeUserAgent ? undefined : userAgent };
}

export async function getBrowserUserAgent() {
  return (await getBrowserProfile()).userAgent;
}

// YouTube.js supplies its own headers in some requests. Use the selected UA
// consistently while retaining cookies, authorization and request options.
export function browserFetch(userAgent, transport = fetch) {
  return (input, init = {}) => {
    const headers = new Headers(init.headers ?? input?.headers);
    headers.set('User-Agent', userAgent);
    return transport(input, { ...init, headers });
  };
}
