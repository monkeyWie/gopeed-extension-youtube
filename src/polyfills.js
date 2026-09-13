import structuredClone from '@ungap/structured-clone';

// Meriyah (used by YouTube.js 18) clones AST nodes while parsing the player.
if (typeof globalThis.structuredClone !== 'function') {
  globalThis.structuredClone = structuredClone;
}
