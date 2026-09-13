import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import { readFileSync } from 'node:fs';
const source = readFileSync(new URL('../src/lib/sabr/streams.js', import.meta.url), 'utf8')
  .replace(/^import .*;\n/gm, '')
  .replace(/^export /gm, '');

test('WebView result restores the player before requesting SABR info without local parsing', async () => {
  const nextStage = new Error('getInfo reached');
  const session = { context: {} };
  let restored;
  const scope = {
    MessageError: Error,
    extractVideoId: () => 'Cmtoos9Qwwo',
    createLocalApiInnertube: async (options) => {
      assert.equal(options.withPlayer, false);
      return {
        session,
        getInfo: async (_, options) => {
          assert.equal(options.po_token, 'token');
          assert.equal(session.player.po_token, 'token');
          assert.equal(session.player.data.output, 'extracted');
          throw nextStage;
        },
      };
    },
    createPoTokenExpression: (options) => {
      assert.equal(options.includePlayer, true);
      return 'prepare';
    },
    Player: {
      fromSource: async (id, options) => {
        restored = id;
        return { data: options.data };
      },
    },
  };
  vm.createContext(scope);
  vm.runInContext(source, scope);
  const prepared = await scope.prepareSabrStreams({ input: 'url', withPlayer: false });
  await assert.rejects(
    prepared.prepareSession({ poToken: 'token', player: { id: 'id', timestamp: 123, data: { output: 'extracted' } } }),
    (e) => e === nextStage
  );
  assert.equal(restored, 'id');
  await assert.rejects(prepared.prepareSession({ poToken: 'token', player: { id: 'id' } }), /invalid result/);
});
