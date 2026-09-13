export function getCookieHeader() {
  const value = gopeed.settings?.cookie;
  return typeof value === 'string' ? value.trim() : '';
}

export async function syncWebViewCookies(page) {
  const header = getCookieHeader();
  const cookies = header
    ? header.split(';').map((part) => {
        const separator = part.indexOf('=');
        const name = part.slice(0, separator).trim();
        if (separator <= 0 || !/^[!#$%&'*+.^_`|~0-9A-Za-z-]+$/.test(name)) {
          throw new MessageError('Invalid Cookie. Paste the Cookie request header from YouTube.');
        }
        return { name, value: part.slice(separator + 1).trim(), domain: '.youtube.com', path: '/', secure: true };
      })
    : [];
  // Replace only cookies visible to YouTube, including when the setting is cleared.
  for (const cookie of await page.getCookies()) {
    await page.deleteCookie({ name: cookie.name, domain: cookie.domain, path: cookie.path, secure: cookie.secure });
  }
  for (const cookie of cookies) await page.setCookie(cookie);
}
