import test from 'node:test';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { sha1Hash } from '../src/lib/sha1.js';

function referenceSha1(input) {
  return createHash('sha1').update(input, 'utf8').digest('hex');
}

test('sha1Hash matches node crypto on known vectors', async () => {
  const vectors = [
    '',
    'abc',
    'The quick brown fox jumps over the lazy dog',
    '0123456789012345678901234567890123456789012345678901234567890123',
    '01234567890123456789012345678901234567890123456789012345678901234',
    'a'.repeat(63),
    'a'.repeat(64),
    'a'.repeat(65),
    'a'.repeat(128),
    '中文输入和 emoji 😀 都要按 UTF-8 编码',
  ];
  for (const input of vectors) {
    assert.equal(await sha1Hash(input), referenceSha1(input), `vector: ${input.slice(0, 40)}`);
  }
});

test('sha1Hash matches node crypto on a large multi-block input', async () => {
  let input = '';
  for (let i = 0; i < 4096; i++) {
    input += String.fromCharCode(33 + (i % 90));
  }
  assert.equal(await sha1Hash(input), referenceSha1(input));
});
