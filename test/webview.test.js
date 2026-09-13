import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import { readFileSync } from 'node:fs';

const source = readFileSync(new URL('../src/lib/sabr/webview.js', import.meta.url), 'utf8')
  .replace(/^import .*;\n/gm, '')
  .replace(/^export /gm, '');

test('verification uses the page challenge and EVENT_ID and shuts down the VM', async () => {
  let shutdown = false;
  const window = {};
  const challenge = {
    R: {
      bgChallenge: {
        program: 'program',
        globalName: 'BG',
        interpreterUrl: { privateDoNotAccessOrElseTrustedResourceUrlWrappedValue: '//www.youtube.com/interpreter.js' },
      },
    },
  };
  const html = `ytcfg.set({"EVENT_ID":"page-event"}); window.ytAtN(${JSON.stringify(challenge)})`;
  const requests = [];
  const scope = {
    URL,
    window,
    location: { href: 'https://www.youtube.com/robots.txt' },
    document: { createElement: () => ({}), head: { appendChild: (script) => script.onload() } },
    parseLooseJSON: JSON.parse,
    buildURL: () => 'https://example.com/integrity',
    getHeaders: () => ({}),
    fetch: async (url, options) => {
      requests.push(url);
      return url === 'https://www.youtube.com/'
        ? { ok: true, text: async () => html }
        : { ok: true, json: async () => ['integrity', 100, 50, 'fallback'] };
    },
    BotGuardClient: {
      create: async (options) => {
        assert.equal(window.yt.config_.EVENT_ID, 'page-event');
        assert.equal(options.program, 'program');
        assert.equal(options.globalObject, window);
        return {
          snapshot: async () => 'snapshot',
          shutdown: async () => {
            shutdown = true;
          },
        };
      },
    },
    WebPoMinter: {
      create: async (data) => {
        assert.equal(data.integrityToken, 'integrity');
        return { mintAsWebsafeString: async (id) => `token:${id}` };
      },
    },
  };
  vm.createContext(scope);
  vm.runInContext(source, scope);
  assert.equal(await scope.mint('video-id', 'key'), 'token:video-id');
  assert.equal(shutdown, true);
  assert.deepEqual(requests, ['https://www.youtube.com/', 'https://example.com/integrity']);
});
