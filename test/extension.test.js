import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';

const source = readFileSync(new URL('../src/index.js', import.meta.url), 'utf8').replace(/^import .*;\n/gm, '');
class MessageError extends Error {}
function setup({ available = true, missingFFmpeg = false, prepareError, playlist, streamError, metadataError } = {}) {
  const events = {},
    openers = new Map(),
    revoked = [],
    calls = { sessions: 0, opens: 0, aborts: 0 };
  const track = () =>
    new ReadableStream({
      start(c) {
        c.enqueue(new Uint8Array([1, 2]));
        c.close();
      },
    });
  const gopeed = {
    info: { identity: 'monkeyWie@youtube' },
    settings: {},
    events: Object.fromEntries(
      ['onResolve', 'onStart', 'onError'].map((name) => [
        name,
        (fn) => {
          events[name] = fn;
        },
      ])
    ),
    runtime: {
      webview: {
        isAvailable: () => available,
        open: async () => ({ goto: async () => {}, execute: async () => 'token', close: async () => {} }),
      },
      blob: {
        createObjectURL: async (open, options) => {
          const url = `blob:${openers.size}`;
          openers.set(url, { open, options });
          return url;
        },
        revokeObjectURL: async (url) => revoked.push(url),
      },
      ffmpeg: missingFFmpeg
        ? {}
        : {
            merge: ({ video, audio }) => {
              calls.inputs = [video, audio];
              return streamError
                ? new ReadableStream({
                    start(c) {
                      c.error(streamError);
                    },
                  })
                : track();
            },
          },
    },
  };
  vm.runInNewContext(source, {
    gopeed,
    syncWebViewCookies: async () => {},
    extractPlaylistId: () => (playlist ? 'PLtest' : null),
    resolvePlaylist: async () => playlist,
    resolveVideo: async () => {
      if (metadataError) throw metadataError;
      return { title: 'Video: title' };
    },
    MessageError,
    ReadableStream,
    prepareSabrStreams: async () => {
      if (prepareError) throw prepareError;
      calls.sessions++;
      return {
        poTokenExpression: '',
        prepareSession: async () => ({
          info: { basic_info: { title: 'Video: title' } },
          openStreams: async () => {
            calls.opens++;
            return {
              videoStream: track(),
              audioStream: track(),
              abort: () => {
                calls.aborts++;
              },
            };
          },
        }),
      };
    },
  });
  return { events, openers, calls, revoked };
}
const resolve = async (env) => {
  const ctx = { req: { url: 'https://youtu.be/dQw4w9WgXcQ' } };
  await env.events.onResolve(ctx);
  return ctx.res;
};

const makeTask = (req) => ({
  meta: { req },
  setUrl: async (url) => {
    req.url = url;
  },
});
const start = async (env, res) => {
  await env.events.onStart({ task: makeTask(res.files[0].req) });
};

test('one unnamed MP4 resource consumes one combined SABR session and releases it', async () => {
  const env = setup(),
    res = await resolve(env);
  assert.equal(res.name, undefined);
  assert.equal(res.files.length, 1);
  assert.equal(res.files[0].name, 'Video_ title.mp4');
  assert.equal(env.calls.sessions, 0);
  assert.equal(env.openers.size, 0);
  await start(env, res);
  assert.equal(env.calls.sessions, 1);
  assert.equal(env.calls.opens, 0);
  const blob = env.openers.get(res.files[0].req.url);
  assert.equal(blob.options.range, false);
  assert.equal(blob.options.size, undefined);
  const output = await blob.open();
  const reader = output.getReader();
  assert.equal((await reader.read()).value.length, 2);
  assert.equal((await reader.read()).done, true);
  assert.equal(env.calls.opens, 1);
  assert.equal(env.calls.aborts, 1);
  await (await blob.open()).cancel();
  assert.equal(env.calls.sessions, 2);
  assert.equal(env.calls.aborts, 2);
});

test('resume replaces the expired Blob URL', async () => {
  const env = setup(),
    res = await resolve(env),
    req = res.files[0].req;
  req.putLabel = async (key, value) => {
    req.labels[key] = value;
  };
  const task = {
    meta: { req },
    setUrl: async (url) => {
      req.url = url;
    },
  };
  await env.events.onStart({ task });
  assert.equal(req.url, 'blob:0');
  await env.events.onStart({ task });
  assert.equal(req.url, 'blob:1');
  assert.deepEqual(env.revoked, ['blob:0']);
});

test('runtime and preparation errors are visible MessageErrors', async () => {
  for (const options of [
    { available: false },
    { missingFFmpeg: true },
    { metadataError: new Error('upstream failed') },
  ]) {
    await assert.rejects(resolve(setup(options)), MessageError);
  }
});

test('automatic recovery replaces the source once and does not loop on persistent failures', async () => {
  const env = setup(),
    res = await resolve(env),
    req = res.files[0].req;
  req.putLabel = async (key, value) => {
    req.labels[key] = value;
  };
  let continued = 0;
  const task = {
    meta: { req },
    setUrl: async (url) => {
      req.url = url;
    },
    continue: async () => {
      continued++;
      await env.events.onStart({ task });
    },
  };
  await env.events.onStart({ task });
  await env.events.onError({ task });
  await env.events.onError({ task });
  assert.equal(continued, 1);
  assert.equal(req.url, 'blob:1');
  assert.deepEqual(env.revoked, ['blob:0']);
});

test('YouTube.js 18 evaluator returns the result appended by the library', async () => {
  const common = readFileSync(new URL('../src/lib/sabr/common.js', import.meta.url), 'utf8')
    .replace(/^import .*;\n/gm, '')
    .replace(/^export /gm, '');
  const Platform = { shim: {} };
  vm.runInNewContext(common, { Platform, MessageError, URL });
  const result = await Platform.shim.eval({
    output: 'const window = Object.assign({}, globalThis);\nreturn { n: "decoded", sig: "signature" };',
  });
  assert.equal(result.n, 'decoded');
  assert.equal(result.sig, 'signature');
});

test('playlist has a folder and numbered files, and prepares SABR only on start', async () => {
  const env = setup({
    playlist: {
      title: 'My: playlist',
      videos: [
        { id: 'dQw4w9WgXcQ', title: 'Same', index: 1 },
        { id: 'dQw4w9WgXcQ', title: 'Same', index: 3 },
      ],
    },
  });
  const res = await resolve(env);
  assert.equal(res.name, 'My_ playlist');
  assert.equal(res.files.length, 2);
  assert.equal(res.files[0].name, '1. Same.mp4');
  assert.equal(res.files[1].name, '3. Same.mp4');
  assert.equal(env.calls.sessions, 0);
  assert.equal(env.openers.size, 0);
  await start(env, res);
  await (await env.openers.get(res.files[0].req.url).open()).cancel();
  assert.equal(env.calls.sessions, 1);
});

test('onStart preparation failure leaves a Blob that fails with MessageError', async () => {
  const env = setup({
    playlist: { title: 'Playlist', videos: [{ id: 'dQw4w9WgXcQ', title: 'Video', index: 1 }] },
    prepareError: new Error('unavailable'),
  });
  const res = await resolve(env);
  await assert.rejects(start(env, res), MessageError);
  assert.equal(env.openers.size, 1);
  await assert.rejects(env.openers.get(res.files[0].req.url).open(), MessageError);
});

test('playlist reads continuations, skips unavailable entries and keeps original positions', async () => {
  const source = readFileSync(new URL('../src/lib/playlist.js', import.meta.url), 'utf8')
    .replace(/^import .*;\n/gm, '')
    .replace(/^export /gm, '');
  const scope = {
    URL,
    MessageError,
    createLocalApiInnertube: async (options) => {
      assert.equal(options.withPlayer, false);
      return {
        getPlaylist: async () => ({
          info: { title: 'List' },
          items: [
            { id: 'dQw4w9WgXcQ', title: 'One' },
            { id: 'aaaaaaaaaaa', is_playable: false },
          ],
          has_continuation: true,
          getContinuation: async () => ({ items: [{ id: 'bbbbbbbbbbb', title: 'Three' }], has_continuation: false }),
        }),
      };
    },
  };
  vm.createContext(scope);
  vm.runInContext(source, scope);
  assert.equal(scope.extractPlaylistId('https://www.youtube.com/watch?v=dQw4w9WgXcQ'), null);
  assert.equal(scope.extractPlaylistId('https://www.youtube.com/watch?v=dQw4w9WgXcQ&list=PLtest'), null);
  assert.equal(scope.extractPlaylistId('https://www.youtube.com/playlist?list=PLtest'), 'PLtest');
  assert.equal(scope.extractPlaylistId('https://www.youtube.com/playlist/?list=PLtest'), 'PLtest');
  assert.equal(scope.extractPlaylistId('https://youtu.be/dQw4w9WgXcQ?list=PLtest'), null);
  assert.throws(() => scope.extractPlaylistId('https://www.youtube.com/playlist'), MessageError);
  const result = await scope.resolvePlaylist('PLtest');
  assert.equal(result.title, 'List');
  assert.deepEqual(
    Array.from(result.videos, (v) => v.index),
    [1, 3]
  );
});

test('asynchronous merge failures are MessageErrors and abort the SABR producer', async () => {
  const env = setup({ streamError: new Error('mux failed') });
  const res = await resolve(env);
  await start(env, res);
  const output = await env.openers.get(res.files[0].req.url).open();
  await assert.rejects(output.getReader().read(), MessageError);
  assert.equal(env.calls.aborts, 1);
});

test('metadata resolution disables player parsing and uses only basic info', async () => {
  const source = readFileSync(new URL('../src/lib/video.js', import.meta.url), 'utf8')
    .replace(/^import .*;\n/gm, '')
    .replace(/^export /gm, '');
  const scope = {
    MessageError,
    extractVideoId: () => 'dQw4w9WgXcQ',
    createLocalApiInnertube: async (options) => {
      assert.equal(options.withPlayer, false);
      return {
        getBasicInfo: async (id) => {
          assert.equal(id, 'dQw4w9WgXcQ');
          return { basic_info: { title: 'Title' } };
        },
      };
    },
  };
  vm.createContext(scope);
  vm.runInContext(source, scope);
  assert.equal((await scope.resolveVideo('https://youtu.be/dQw4w9WgXcQ')).title, 'Title');
});
