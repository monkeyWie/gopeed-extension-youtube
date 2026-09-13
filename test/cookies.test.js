import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import { readFileSync } from 'node:fs';

class MessageError extends Error {}
const source = readFileSync(new URL('../src/lib/cookies.js', import.meta.url), 'utf8').replace(/^export /gm, '');
function setup(cookie) {
  const scope = { gopeed: { settings: { cookie } }, MessageError };
  vm.createContext(scope);
  vm.runInContext(source, scope);
  return scope;
}

test('cookies preserve equals signs and replace previous YouTube cookies', async () => {
  const scope = setup(' SAPISID=example==; __Secure-3PSID=other ');
  const operations = [];
  await scope.syncWebViewCookies({
    getCookies: async () => [{ name: 'old', domain: '.youtube.com', path: '/' }],
    deleteCookie: async (cookie) => operations.push(`delete:${cookie.name}`),
    setCookie: async (cookie) => operations.push(`set:${cookie.name}=${cookie.value}`),
  });
  assert.deepEqual(operations, ['delete:old', 'set:SAPISID=example==', 'set:__Secure-3PSID=other']);
});

test('clearing the setting removes old WebView authentication', async () => {
  const scope = setup('');
  let removed = false;
  await scope.syncWebViewCookies({
    getCookies: async () => [{ name: 'SAPISID' }],
    deleteCookie: async () => {
      removed = true;
    },
    setCookie: async () => assert.fail(),
  });
  assert.equal(removed, true);
});

test('invalid Cookie reports a MessageError before changing WebView cookies', async () => {
  await assert.rejects(setup('not-a-cookie').syncWebViewCookies({}), MessageError);
});

test('all Innertube clients receive the configured Cookie', async () => {
  const scope = setup('SAPISID=example');
  scope.Platform = { shim: {} };
  scope.Innertube = { create: async (options) => options };
  scope.fetch = () => {};
  scope.getBrowserUserAgent = async () => "native-UA";
  scope.browserFetch = (_ua, transport) => transport;
  const common = readFileSync(new URL('../src/lib/sabr/common.js', import.meta.url), 'utf8')
    .replace(/^import .*;\n/gm, '')
    .replace(/^export /gm, '');
  vm.runInContext(common, scope);
  const options = await scope.createLocalApiInnertube({ withPlayer: false });
  assert.equal(options.cookie, 'SAPISID=example');
  assert.equal(options.user_agent, 'native-UA');
  scope.gopeed.settings.cookie = '';
  assert.equal((await scope.createLocalApiInnertube()).cookie, undefined);
});
