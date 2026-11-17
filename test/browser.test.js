import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import { readFileSync } from 'node:fs';

const source = readFileSync(new URL('../src/lib/browser.js', import.meta.url), 'utf8')
  .replace(/^export /gm, '');

test('browser profile caches the native UA and shares its desktop conversion', async () => {
  for (const ua of [
    'Mozilla/5.0 (Linux; Android 16; device; wv) AppleWebKit/537.36 Version/4.0 Chrome/151.0.7922.200 Mobile Safari/537.36',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15',
    'Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 Mobile/15E148',
  ]) {
    let opens = 0, closes = 0;
    const scope = {
      MessageError: Error,
      gopeed: { runtime: { webview: {
        isAvailable: () => true,
        open: async options => {
          opens++;
          assert.equal(options.userAgent, undefined);
          let loaded = false;
          return {
            goto: async url => { assert.equal(url, 'about:blank'); loaded = true; },
            execute: async () => { assert.equal(loaded, true); return ua; },
            close: async () => { closes++; },
          };
        },
      } } },
    };
    vm.createContext(scope);
    vm.runInContext(source, scope);
    const values = await Promise.all([scope.getBrowserUserAgent(), scope.getBrowserUserAgent()]);
    const profile = await scope.getBrowserProfile();
    assert.deepEqual(values, [profile.userAgent, profile.userAgent]);
    if (/Android|iPhone/.test(ua)) {
      assert.doesNotMatch(profile.userAgent, /Android|iPhone|Mobile|\bwv\b/);
      assert.equal(profile.overrideUserAgent, profile.userAgent);
    } else {
      assert.equal(profile.userAgent, ua);
      assert.equal(profile.overrideUserAgent, undefined);
    }
    assert.equal(opens, 1);
    assert.equal(closes, 1);
  }
});

test('a failed browser probe closes the page and can be retried', async () => {
  let attempts = 0, closes = 0;
  const scope = {
    MessageError: Error,
    gopeed: { runtime: { webview: {
      isAvailable: () => true,
      open: async () => ({
        goto: async () => { if (++attempts === 1) throw new Error('navigation failed'); },
        execute: async () => 'native-UA',
        close: async () => { closes++; },
      }),
    } } },
  };
  vm.createContext(scope);
  vm.runInContext(source, scope);
  await assert.rejects(scope.getBrowserUserAgent(), /navigation failed/);
  assert.equal(await scope.getBrowserUserAgent(), 'native-UA');
  assert.equal(closes, 2);
});

test('API and media fetch keep request options while replacing library UA with native UA', async () => {
  const scope = { Headers };
  vm.createContext(scope);
  vm.runInContext(source, scope);
  const request = new Request('https://www.youtube.com/api', {
    method: 'POST', body: 'payload',
    headers: { 'user-agent': 'library-UA', cookie: 'session=example', authorization: 'example' },
  });
  const controller = new AbortController();
  const send = scope.browserFetch('native-UA', async (input, init) => ({ input, init }));
  const { input, init } = await send(request, { signal: controller.signal });
  assert.equal(input, request);
  assert.equal(init.signal, controller.signal);
  assert.equal(init.headers.get('user-agent'), 'native-UA');
  assert.equal(init.headers.get('cookie'), 'session=example');
  assert.equal(init.headers.get('authorization'), 'example');
  const media = await send('https://media.googlevideo.com/videoplayback', {
    method: 'POST', body: new Uint8Array([1, 2]), headers: { Range: 'bytes=0-99' },
  });
  assert.equal(media.init.headers.get('user-agent'), 'native-UA');
  assert.equal(media.init.headers.get('range'), 'bytes=0-99');
  assert.equal(media.init.method, 'POST');
  assert.deepEqual(media.init.body, new Uint8Array([1, 2]));
});

test('desktop conversion preserves Android Chrome and WebKit versions across upgrades', () => {
  const scope = {};
  vm.createContext(scope);
  vm.runInContext(source, scope);
  for (const version of ['151.0.7922.200', '152.1.1234.56']) {
    const native = 'Mozilla/5.0 (Linux; Android 16; 24069RA21C Build/BP2A.250605.031.A3; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/' + version + ' Mobile Safari/537.36';
    assert.equal(scope.desktopUserAgent(native),
      'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/' + version + ' Safari/537.36');
  }
  const desktop = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko)';
  assert.equal(scope.desktopUserAgent(desktop), desktop);
});

test('iOS conversion keeps WebKit/Safari instead of introducing Chrome', () => {
  const scope = {};
  vm.createContext(scope);
  vm.runInContext(source, scope);
  const ua = scope.desktopUserAgent('Mozilla/5.0 (iPad; CPU OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Mobile/15E148 Safari/604.1');
  assert.equal(ua, 'Mozilla/5.0 (Macintosh; Intel Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Safari/604.1');
  assert.doesNotMatch(ua, /Chrome/);
});

test('browserFetch adds Origin only for authenticated youtube.com requests', async () => {
  const source = readFileSync(new URL('../src/lib/browser.js', import.meta.url), 'utf8')
    .replace(/^export /gm, '');
  const scope = { Headers, MessageError: Error, gopeed: { runtime: { webview: { isAvailable: () => true } } } };
  vm.createContext(scope);
  vm.runInContext(source, scope);

  const cases = [
    {
      name: 'authenticated player request gets Origin',
      input: 'https://www.youtube.com/youtubei/v1/player?key=AIzaSy',
      headers: { Authorization: 'SAPISIDHASH 1700000000_a1b2c3' },
      wantOrigin: true,
    },
    {
      name: 'authenticated request to another domain gets no Origin',
      input: 'https://example.com/api/data',
      headers: { Authorization: 'SAPISIDHASH 1700000000_a1b2c3' },
      wantOrigin: false,
    },
    {
      name: 'unauthenticated youtube request gets no Origin',
      input: 'https://www.youtube.com/watch?v=abc',
      headers: {},
      wantOrigin: false,
    },
    {
      name: 'request object with url also gets Origin',
      input: { url: 'https://www.youtube.com/youtubei/v1/att/get', headers: { Authorization: 'SAPISIDHASH 1_x' } },
      headers: undefined,
      wantOrigin: true,
    },
  ];

  for (const tc of cases) {
    let captured;
    const transport = (input, init) => {
      captured = new Headers(init.headers ?? input?.headers);
      return Promise.resolve({ ok: true });
    };
    await scope.browserFetch('Mozilla/5.0 test', transport)(tc.input, { headers: tc.headers });
    assert.ok(captured, tc.name);
    assert.equal(captured.get('User-Agent'), 'Mozilla/5.0 test', tc.name);
    assert.equal(
      captured.has('Origin'),
      tc.wantOrigin,
      `${tc.name}: Origin ${tc.wantOrigin ? 'missing' : 'unexpectedly set'}`,
    );
    if (tc.wantOrigin) {
      assert.equal(captured.get('Origin'), 'https://www.youtube.com', tc.name);
    }
  }
});
