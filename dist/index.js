/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ 6717:
/***/ ((__unused_webpack_module, exports) => {

"use strict";


exports.byteLength = byteLength;
exports.toByteArray = toByteArray;
exports.fromByteArray = fromByteArray;
var lookup = [];
var revLookup = [];
var Arr = typeof Uint8Array !== 'undefined' ? Uint8Array : Array;
var code = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
for (var i = 0, len = code.length; i < len; ++i) {
  lookup[i] = code[i];
  revLookup[code.charCodeAt(i)] = i;
}

// Support decoding URL-safe base64 strings, as Node.js does.
// See: https://en.wikipedia.org/wiki/Base64#URL_applications
revLookup['-'.charCodeAt(0)] = 62;
revLookup['_'.charCodeAt(0)] = 63;
function getLens(b64) {
  var len = b64.length;
  if (len % 4 > 0) {
    throw new Error('Invalid string. Length must be a multiple of 4');
  }

  // Trim off extra bytes after placeholder bytes are found
  // See: https://github.com/beatgammit/base64-js/issues/42
  var validLen = b64.indexOf('=');
  if (validLen === -1) validLen = len;
  var placeHoldersLen = validLen === len ? 0 : 4 - validLen % 4;
  return [validLen, placeHoldersLen];
}

// base64 is 4/3 + up to two characters of the original data
function byteLength(b64) {
  var lens = getLens(b64);
  var validLen = lens[0];
  var placeHoldersLen = lens[1];
  return (validLen + placeHoldersLen) * 3 / 4 - placeHoldersLen;
}
function _byteLength(b64, validLen, placeHoldersLen) {
  return (validLen + placeHoldersLen) * 3 / 4 - placeHoldersLen;
}
function toByteArray(b64) {
  var tmp;
  var lens = getLens(b64);
  var validLen = lens[0];
  var placeHoldersLen = lens[1];
  var arr = new Arr(_byteLength(b64, validLen, placeHoldersLen));
  var curByte = 0;

  // if there are placeholders, only get up to the last complete 4 chars
  var len = placeHoldersLen > 0 ? validLen - 4 : validLen;
  var i;
  for (i = 0; i < len; i += 4) {
    tmp = revLookup[b64.charCodeAt(i)] << 18 | revLookup[b64.charCodeAt(i + 1)] << 12 | revLookup[b64.charCodeAt(i + 2)] << 6 | revLookup[b64.charCodeAt(i + 3)];
    arr[curByte++] = tmp >> 16 & 0xFF;
    arr[curByte++] = tmp >> 8 & 0xFF;
    arr[curByte++] = tmp & 0xFF;
  }
  if (placeHoldersLen === 2) {
    tmp = revLookup[b64.charCodeAt(i)] << 2 | revLookup[b64.charCodeAt(i + 1)] >> 4;
    arr[curByte++] = tmp & 0xFF;
  }
  if (placeHoldersLen === 1) {
    tmp = revLookup[b64.charCodeAt(i)] << 10 | revLookup[b64.charCodeAt(i + 1)] << 4 | revLookup[b64.charCodeAt(i + 2)] >> 2;
    arr[curByte++] = tmp >> 8 & 0xFF;
    arr[curByte++] = tmp & 0xFF;
  }
  return arr;
}
function tripletToBase64(num) {
  return lookup[num >> 18 & 0x3F] + lookup[num >> 12 & 0x3F] + lookup[num >> 6 & 0x3F] + lookup[num & 0x3F];
}
function encodeChunk(uint8, start, end) {
  var tmp;
  var output = [];
  for (var i = start; i < end; i += 3) {
    tmp = (uint8[i] << 16 & 0xFF0000) + (uint8[i + 1] << 8 & 0xFF00) + (uint8[i + 2] & 0xFF);
    output.push(tripletToBase64(tmp));
  }
  return output.join('');
}
function fromByteArray(uint8) {
  var tmp;
  var len = uint8.length;
  var extraBytes = len % 3; // if we have 1 byte left, pad 2 bytes
  var parts = [];
  var maxChunkLength = 16383; // must be multiple of 3

  // go through the array every three bytes, we'll deal with trailing stuff later
  for (var i = 0, len2 = len - extraBytes; i < len2; i += maxChunkLength) {
    parts.push(encodeChunk(uint8, i, i + maxChunkLength > len2 ? len2 : i + maxChunkLength));
  }

  // pad the end with zeros, but make sure to not forget the extra bytes
  if (extraBytes === 1) {
    tmp = uint8[len - 1];
    parts.push(lookup[tmp >> 2] + lookup[tmp << 4 & 0x3F] + '==');
  } else if (extraBytes === 2) {
    tmp = (uint8[len - 2] << 8) + uint8[len - 1];
    parts.push(lookup[tmp >> 10] + lookup[tmp >> 4 & 0x3F] + lookup[tmp << 2 & 0x3F] + '=');
  }
  return parts.join('');
}

/***/ }),

/***/ 5851:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";
/*!
 * The buffer module from node.js, for the browser.
 *
 * @author   Feross Aboukhadijeh <https://feross.org>
 * @license  MIT
 */
/* eslint-disable no-proto */



function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return _typeof(key) === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (_typeof(input) !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (_typeof(res) !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); Object.defineProperty(subClass, "prototype", { writable: false }); if (superClass) _setPrototypeOf(subClass, superClass); }
function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }
function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }
function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } else if (call !== void 0) { throw new TypeError("Derived constructors may only return object or undefined"); } return _assertThisInitialized(self); }
function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }
function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }
function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
var base64 = __webpack_require__(6717);
var ieee754 = __webpack_require__(9350);
var customInspectSymbol = typeof Symbol === 'function' && typeof Symbol['for'] === 'function' // eslint-disable-line dot-notation
? Symbol['for']('nodejs.util.inspect.custom') // eslint-disable-line dot-notation
: null;
exports.Buffer = Buffer;
exports.SlowBuffer = SlowBuffer;
exports.INSPECT_MAX_BYTES = 50;
var K_MAX_LENGTH = 0x7fffffff;
exports.kMaxLength = K_MAX_LENGTH;

/**
 * If `Buffer.TYPED_ARRAY_SUPPORT`:
 *   === true    Use Uint8Array implementation (fastest)
 *   === false   Print warning and recommend using `buffer` v4.x which has an Object
 *               implementation (most compatible, even IE6)
 *
 * Browsers that support typed arrays are IE 10+, Firefox 4+, Chrome 7+, Safari 5.1+,
 * Opera 11.6+, iOS 4.2+.
 *
 * We report that the browser does not support typed arrays if the are not subclassable
 * using __proto__. Firefox 4-29 lacks support for adding new properties to `Uint8Array`
 * (See: https://bugzilla.mozilla.org/show_bug.cgi?id=695438). IE 10 lacks support
 * for __proto__ and has a buggy typed array implementation.
 */
Buffer.TYPED_ARRAY_SUPPORT = typedArraySupport();
if (!Buffer.TYPED_ARRAY_SUPPORT && typeof console !== 'undefined' && typeof console.error === 'function') {
  console.error('This browser lacks typed array (Uint8Array) support which is required by ' + '`buffer` v5.x. Use `buffer` v4.x if you require old browser support.');
}
function typedArraySupport() {
  // Can typed array instances can be augmented?
  try {
    var arr = new Uint8Array(1);
    var proto = {
      foo: function foo() {
        return 42;
      }
    };
    Object.setPrototypeOf(proto, Uint8Array.prototype);
    Object.setPrototypeOf(arr, proto);
    return arr.foo() === 42;
  } catch (e) {
    return false;
  }
}
Object.defineProperty(Buffer.prototype, 'parent', {
  enumerable: true,
  get: function get() {
    if (!Buffer.isBuffer(this)) return undefined;
    return this.buffer;
  }
});
Object.defineProperty(Buffer.prototype, 'offset', {
  enumerable: true,
  get: function get() {
    if (!Buffer.isBuffer(this)) return undefined;
    return this.byteOffset;
  }
});
function createBuffer(length) {
  if (length > K_MAX_LENGTH) {
    throw new RangeError('The value "' + length + '" is invalid for option "size"');
  }
  // Return an augmented `Uint8Array` instance
  var buf = new Uint8Array(length);
  Object.setPrototypeOf(buf, Buffer.prototype);
  return buf;
}

/**
 * The Buffer constructor returns instances of `Uint8Array` that have their
 * prototype changed to `Buffer.prototype`. Furthermore, `Buffer` is a subclass of
 * `Uint8Array`, so the returned instances will have all the node `Buffer` methods
 * and the `Uint8Array` methods. Square bracket notation works as expected -- it
 * returns a single octet.
 *
 * The `Uint8Array` prototype remains unmodified.
 */

function Buffer(arg, encodingOrOffset, length) {
  // Common case.
  if (typeof arg === 'number') {
    if (typeof encodingOrOffset === 'string') {
      throw new TypeError('The "string" argument must be of type string. Received type number');
    }
    return allocUnsafe(arg);
  }
  return from(arg, encodingOrOffset, length);
}
Buffer.poolSize = 8192; // not used by this implementation

function from(value, encodingOrOffset, length) {
  if (typeof value === 'string') {
    return fromString(value, encodingOrOffset);
  }
  if (ArrayBuffer.isView(value)) {
    return fromArrayView(value);
  }
  if (value == null) {
    throw new TypeError('The first argument must be one of type string, Buffer, ArrayBuffer, Array, ' + 'or Array-like Object. Received type ' + _typeof(value));
  }
  if (isInstance(value, ArrayBuffer) || value && isInstance(value.buffer, ArrayBuffer)) {
    return fromArrayBuffer(value, encodingOrOffset, length);
  }
  if (typeof SharedArrayBuffer !== 'undefined' && (isInstance(value, SharedArrayBuffer) || value && isInstance(value.buffer, SharedArrayBuffer))) {
    return fromArrayBuffer(value, encodingOrOffset, length);
  }
  if (typeof value === 'number') {
    throw new TypeError('The "value" argument must not be of type number. Received type number');
  }
  var valueOf = value.valueOf && value.valueOf();
  if (valueOf != null && valueOf !== value) {
    return Buffer.from(valueOf, encodingOrOffset, length);
  }
  var b = fromObject(value);
  if (b) return b;
  if (typeof Symbol !== 'undefined' && Symbol.toPrimitive != null && typeof value[Symbol.toPrimitive] === 'function') {
    return Buffer.from(value[Symbol.toPrimitive]('string'), encodingOrOffset, length);
  }
  throw new TypeError('The first argument must be one of type string, Buffer, ArrayBuffer, Array, ' + 'or Array-like Object. Received type ' + _typeof(value));
}

/**
 * Functionally equivalent to Buffer(arg, encoding) but throws a TypeError
 * if value is a number.
 * Buffer.from(str[, encoding])
 * Buffer.from(array)
 * Buffer.from(buffer)
 * Buffer.from(arrayBuffer[, byteOffset[, length]])
 **/
Buffer.from = function (value, encodingOrOffset, length) {
  return from(value, encodingOrOffset, length);
};

// Note: Change prototype *after* Buffer.from is defined to workaround Chrome bug:
// https://github.com/feross/buffer/pull/148
Object.setPrototypeOf(Buffer.prototype, Uint8Array.prototype);
Object.setPrototypeOf(Buffer, Uint8Array);
function assertSize(size) {
  if (typeof size !== 'number') {
    throw new TypeError('"size" argument must be of type number');
  } else if (size < 0) {
    throw new RangeError('The value "' + size + '" is invalid for option "size"');
  }
}
function alloc(size, fill, encoding) {
  assertSize(size);
  if (size <= 0) {
    return createBuffer(size);
  }
  if (fill !== undefined) {
    // Only pay attention to encoding if it's a string. This
    // prevents accidentally sending in a number that would
    // be interpreted as a start offset.
    return typeof encoding === 'string' ? createBuffer(size).fill(fill, encoding) : createBuffer(size).fill(fill);
  }
  return createBuffer(size);
}

/**
 * Creates a new filled Buffer instance.
 * alloc(size[, fill[, encoding]])
 **/
Buffer.alloc = function (size, fill, encoding) {
  return alloc(size, fill, encoding);
};
function allocUnsafe(size) {
  assertSize(size);
  return createBuffer(size < 0 ? 0 : checked(size) | 0);
}

/**
 * Equivalent to Buffer(num), by default creates a non-zero-filled Buffer instance.
 * */
Buffer.allocUnsafe = function (size) {
  return allocUnsafe(size);
};
/**
 * Equivalent to SlowBuffer(num), by default creates a non-zero-filled Buffer instance.
 */
Buffer.allocUnsafeSlow = function (size) {
  return allocUnsafe(size);
};
function fromString(string, encoding) {
  if (typeof encoding !== 'string' || encoding === '') {
    encoding = 'utf8';
  }
  if (!Buffer.isEncoding(encoding)) {
    throw new TypeError('Unknown encoding: ' + encoding);
  }
  var length = byteLength(string, encoding) | 0;
  var buf = createBuffer(length);
  var actual = buf.write(string, encoding);
  if (actual !== length) {
    // Writing a hex string, for example, that contains invalid characters will
    // cause everything after the first invalid character to be ignored. (e.g.
    // 'abxxcd' will be treated as 'ab')
    buf = buf.slice(0, actual);
  }
  return buf;
}
function fromArrayLike(array) {
  var length = array.length < 0 ? 0 : checked(array.length) | 0;
  var buf = createBuffer(length);
  for (var i = 0; i < length; i += 1) {
    buf[i] = array[i] & 255;
  }
  return buf;
}
function fromArrayView(arrayView) {
  if (isInstance(arrayView, Uint8Array)) {
    var copy = new Uint8Array(arrayView);
    return fromArrayBuffer(copy.buffer, copy.byteOffset, copy.byteLength);
  }
  return fromArrayLike(arrayView);
}
function fromArrayBuffer(array, byteOffset, length) {
  if (byteOffset < 0 || array.byteLength < byteOffset) {
    throw new RangeError('"offset" is outside of buffer bounds');
  }
  if (array.byteLength < byteOffset + (length || 0)) {
    throw new RangeError('"length" is outside of buffer bounds');
  }
  var buf;
  if (byteOffset === undefined && length === undefined) {
    buf = new Uint8Array(array);
  } else if (length === undefined) {
    buf = new Uint8Array(array, byteOffset);
  } else {
    buf = new Uint8Array(array, byteOffset, length);
  }

  // Return an augmented `Uint8Array` instance
  Object.setPrototypeOf(buf, Buffer.prototype);
  return buf;
}
function fromObject(obj) {
  if (Buffer.isBuffer(obj)) {
    var len = checked(obj.length) | 0;
    var buf = createBuffer(len);
    if (buf.length === 0) {
      return buf;
    }
    obj.copy(buf, 0, 0, len);
    return buf;
  }
  if (obj.length !== undefined) {
    if (typeof obj.length !== 'number' || numberIsNaN(obj.length)) {
      return createBuffer(0);
    }
    return fromArrayLike(obj);
  }
  if (obj.type === 'Buffer' && Array.isArray(obj.data)) {
    return fromArrayLike(obj.data);
  }
}
function checked(length) {
  // Note: cannot use `length < K_MAX_LENGTH` here because that fails when
  // length is NaN (which is otherwise coerced to zero.)
  if (length >= K_MAX_LENGTH) {
    throw new RangeError('Attempt to allocate Buffer larger than maximum ' + 'size: 0x' + K_MAX_LENGTH.toString(16) + ' bytes');
  }
  return length | 0;
}
function SlowBuffer(length) {
  if (+length != length) {
    // eslint-disable-line eqeqeq
    length = 0;
  }
  return Buffer.alloc(+length);
}
Buffer.isBuffer = function isBuffer(b) {
  return b != null && b._isBuffer === true && b !== Buffer.prototype; // so Buffer.isBuffer(Buffer.prototype) will be false
};

Buffer.compare = function compare(a, b) {
  if (isInstance(a, Uint8Array)) a = Buffer.from(a, a.offset, a.byteLength);
  if (isInstance(b, Uint8Array)) b = Buffer.from(b, b.offset, b.byteLength);
  if (!Buffer.isBuffer(a) || !Buffer.isBuffer(b)) {
    throw new TypeError('The "buf1", "buf2" arguments must be one of type Buffer or Uint8Array');
  }
  if (a === b) return 0;
  var x = a.length;
  var y = b.length;
  for (var i = 0, len = Math.min(x, y); i < len; ++i) {
    if (a[i] !== b[i]) {
      x = a[i];
      y = b[i];
      break;
    }
  }
  if (x < y) return -1;
  if (y < x) return 1;
  return 0;
};
Buffer.isEncoding = function isEncoding(encoding) {
  switch (String(encoding).toLowerCase()) {
    case 'hex':
    case 'utf8':
    case 'utf-8':
    case 'ascii':
    case 'latin1':
    case 'binary':
    case 'base64':
    case 'ucs2':
    case 'ucs-2':
    case 'utf16le':
    case 'utf-16le':
      return true;
    default:
      return false;
  }
};
Buffer.concat = function concat(list, length) {
  if (!Array.isArray(list)) {
    throw new TypeError('"list" argument must be an Array of Buffers');
  }
  if (list.length === 0) {
    return Buffer.alloc(0);
  }
  var i;
  if (length === undefined) {
    length = 0;
    for (i = 0; i < list.length; ++i) {
      length += list[i].length;
    }
  }
  var buffer = Buffer.allocUnsafe(length);
  var pos = 0;
  for (i = 0; i < list.length; ++i) {
    var buf = list[i];
    if (isInstance(buf, Uint8Array)) {
      if (pos + buf.length > buffer.length) {
        if (!Buffer.isBuffer(buf)) buf = Buffer.from(buf);
        buf.copy(buffer, pos);
      } else {
        Uint8Array.prototype.set.call(buffer, buf, pos);
      }
    } else if (!Buffer.isBuffer(buf)) {
      throw new TypeError('"list" argument must be an Array of Buffers');
    } else {
      buf.copy(buffer, pos);
    }
    pos += buf.length;
  }
  return buffer;
};
function byteLength(string, encoding) {
  if (Buffer.isBuffer(string)) {
    return string.length;
  }
  if (ArrayBuffer.isView(string) || isInstance(string, ArrayBuffer)) {
    return string.byteLength;
  }
  if (typeof string !== 'string') {
    throw new TypeError('The "string" argument must be one of type string, Buffer, or ArrayBuffer. ' + 'Received type ' + _typeof(string));
  }
  var len = string.length;
  var mustMatch = arguments.length > 2 && arguments[2] === true;
  if (!mustMatch && len === 0) return 0;

  // Use a for loop to avoid recursion
  var loweredCase = false;
  for (;;) {
    switch (encoding) {
      case 'ascii':
      case 'latin1':
      case 'binary':
        return len;
      case 'utf8':
      case 'utf-8':
        return utf8ToBytes(string).length;
      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return len * 2;
      case 'hex':
        return len >>> 1;
      case 'base64':
        return base64ToBytes(string).length;
      default:
        if (loweredCase) {
          return mustMatch ? -1 : utf8ToBytes(string).length; // assume utf8
        }

        encoding = ('' + encoding).toLowerCase();
        loweredCase = true;
    }
  }
}
Buffer.byteLength = byteLength;
function slowToString(encoding, start, end) {
  var loweredCase = false;

  // No need to verify that "this.length <= MAX_UINT32" since it's a read-only
  // property of a typed array.

  // This behaves neither like String nor Uint8Array in that we set start/end
  // to their upper/lower bounds if the value passed is out of range.
  // undefined is handled specially as per ECMA-262 6th Edition,
  // Section 13.3.3.7 Runtime Semantics: KeyedBindingInitialization.
  if (start === undefined || start < 0) {
    start = 0;
  }
  // Return early if start > this.length. Done here to prevent potential uint32
  // coercion fail below.
  if (start > this.length) {
    return '';
  }
  if (end === undefined || end > this.length) {
    end = this.length;
  }
  if (end <= 0) {
    return '';
  }

  // Force coercion to uint32. This will also coerce falsey/NaN values to 0.
  end >>>= 0;
  start >>>= 0;
  if (end <= start) {
    return '';
  }
  if (!encoding) encoding = 'utf8';
  while (true) {
    switch (encoding) {
      case 'hex':
        return hexSlice(this, start, end);
      case 'utf8':
      case 'utf-8':
        return utf8Slice(this, start, end);
      case 'ascii':
        return asciiSlice(this, start, end);
      case 'latin1':
      case 'binary':
        return latin1Slice(this, start, end);
      case 'base64':
        return base64Slice(this, start, end);
      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return utf16leSlice(this, start, end);
      default:
        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding);
        encoding = (encoding + '').toLowerCase();
        loweredCase = true;
    }
  }
}

// This property is used by `Buffer.isBuffer` (and the `is-buffer` npm package)
// to detect a Buffer instance. It's not possible to use `instanceof Buffer`
// reliably in a browserify context because there could be multiple different
// copies of the 'buffer' package in use. This method works even for Buffer
// instances that were created from another copy of the `buffer` package.
// See: https://github.com/feross/buffer/issues/154
Buffer.prototype._isBuffer = true;
function swap(b, n, m) {
  var i = b[n];
  b[n] = b[m];
  b[m] = i;
}
Buffer.prototype.swap16 = function swap16() {
  var len = this.length;
  if (len % 2 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 16-bits');
  }
  for (var i = 0; i < len; i += 2) {
    swap(this, i, i + 1);
  }
  return this;
};
Buffer.prototype.swap32 = function swap32() {
  var len = this.length;
  if (len % 4 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 32-bits');
  }
  for (var i = 0; i < len; i += 4) {
    swap(this, i, i + 3);
    swap(this, i + 1, i + 2);
  }
  return this;
};
Buffer.prototype.swap64 = function swap64() {
  var len = this.length;
  if (len % 8 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 64-bits');
  }
  for (var i = 0; i < len; i += 8) {
    swap(this, i, i + 7);
    swap(this, i + 1, i + 6);
    swap(this, i + 2, i + 5);
    swap(this, i + 3, i + 4);
  }
  return this;
};
Buffer.prototype.toString = function toString() {
  var length = this.length;
  if (length === 0) return '';
  if (arguments.length === 0) return utf8Slice(this, 0, length);
  return slowToString.apply(this, arguments);
};
Buffer.prototype.toLocaleString = Buffer.prototype.toString;
Buffer.prototype.equals = function equals(b) {
  if (!Buffer.isBuffer(b)) throw new TypeError('Argument must be a Buffer');
  if (this === b) return true;
  return Buffer.compare(this, b) === 0;
};
Buffer.prototype.inspect = function inspect() {
  var str = '';
  var max = exports.INSPECT_MAX_BYTES;
  str = this.toString('hex', 0, max).replace(/(.{2})/g, '$1 ').trim();
  if (this.length > max) str += ' ... ';
  return '<Buffer ' + str + '>';
};
if (customInspectSymbol) {
  Buffer.prototype[customInspectSymbol] = Buffer.prototype.inspect;
}
Buffer.prototype.compare = function compare(target, start, end, thisStart, thisEnd) {
  if (isInstance(target, Uint8Array)) {
    target = Buffer.from(target, target.offset, target.byteLength);
  }
  if (!Buffer.isBuffer(target)) {
    throw new TypeError('The "target" argument must be one of type Buffer or Uint8Array. ' + 'Received type ' + _typeof(target));
  }
  if (start === undefined) {
    start = 0;
  }
  if (end === undefined) {
    end = target ? target.length : 0;
  }
  if (thisStart === undefined) {
    thisStart = 0;
  }
  if (thisEnd === undefined) {
    thisEnd = this.length;
  }
  if (start < 0 || end > target.length || thisStart < 0 || thisEnd > this.length) {
    throw new RangeError('out of range index');
  }
  if (thisStart >= thisEnd && start >= end) {
    return 0;
  }
  if (thisStart >= thisEnd) {
    return -1;
  }
  if (start >= end) {
    return 1;
  }
  start >>>= 0;
  end >>>= 0;
  thisStart >>>= 0;
  thisEnd >>>= 0;
  if (this === target) return 0;
  var x = thisEnd - thisStart;
  var y = end - start;
  var len = Math.min(x, y);
  var thisCopy = this.slice(thisStart, thisEnd);
  var targetCopy = target.slice(start, end);
  for (var i = 0; i < len; ++i) {
    if (thisCopy[i] !== targetCopy[i]) {
      x = thisCopy[i];
      y = targetCopy[i];
      break;
    }
  }
  if (x < y) return -1;
  if (y < x) return 1;
  return 0;
};

// Finds either the first index of `val` in `buffer` at offset >= `byteOffset`,
// OR the last index of `val` in `buffer` at offset <= `byteOffset`.
//
// Arguments:
// - buffer - a Buffer to search
// - val - a string, Buffer, or number
// - byteOffset - an index into `buffer`; will be clamped to an int32
// - encoding - an optional encoding, relevant is val is a string
// - dir - true for indexOf, false for lastIndexOf
function bidirectionalIndexOf(buffer, val, byteOffset, encoding, dir) {
  // Empty buffer means no match
  if (buffer.length === 0) return -1;

  // Normalize byteOffset
  if (typeof byteOffset === 'string') {
    encoding = byteOffset;
    byteOffset = 0;
  } else if (byteOffset > 0x7fffffff) {
    byteOffset = 0x7fffffff;
  } else if (byteOffset < -0x80000000) {
    byteOffset = -0x80000000;
  }
  byteOffset = +byteOffset; // Coerce to Number.
  if (numberIsNaN(byteOffset)) {
    // byteOffset: it it's undefined, null, NaN, "foo", etc, search whole buffer
    byteOffset = dir ? 0 : buffer.length - 1;
  }

  // Normalize byteOffset: negative offsets start from the end of the buffer
  if (byteOffset < 0) byteOffset = buffer.length + byteOffset;
  if (byteOffset >= buffer.length) {
    if (dir) return -1;else byteOffset = buffer.length - 1;
  } else if (byteOffset < 0) {
    if (dir) byteOffset = 0;else return -1;
  }

  // Normalize val
  if (typeof val === 'string') {
    val = Buffer.from(val, encoding);
  }

  // Finally, search either indexOf (if dir is true) or lastIndexOf
  if (Buffer.isBuffer(val)) {
    // Special case: looking for empty string/buffer always fails
    if (val.length === 0) {
      return -1;
    }
    return arrayIndexOf(buffer, val, byteOffset, encoding, dir);
  } else if (typeof val === 'number') {
    val = val & 0xFF; // Search for a byte value [0-255]
    if (typeof Uint8Array.prototype.indexOf === 'function') {
      if (dir) {
        return Uint8Array.prototype.indexOf.call(buffer, val, byteOffset);
      } else {
        return Uint8Array.prototype.lastIndexOf.call(buffer, val, byteOffset);
      }
    }
    return arrayIndexOf(buffer, [val], byteOffset, encoding, dir);
  }
  throw new TypeError('val must be string, number or Buffer');
}
function arrayIndexOf(arr, val, byteOffset, encoding, dir) {
  var indexSize = 1;
  var arrLength = arr.length;
  var valLength = val.length;
  if (encoding !== undefined) {
    encoding = String(encoding).toLowerCase();
    if (encoding === 'ucs2' || encoding === 'ucs-2' || encoding === 'utf16le' || encoding === 'utf-16le') {
      if (arr.length < 2 || val.length < 2) {
        return -1;
      }
      indexSize = 2;
      arrLength /= 2;
      valLength /= 2;
      byteOffset /= 2;
    }
  }
  function read(buf, i) {
    if (indexSize === 1) {
      return buf[i];
    } else {
      return buf.readUInt16BE(i * indexSize);
    }
  }
  var i;
  if (dir) {
    var foundIndex = -1;
    for (i = byteOffset; i < arrLength; i++) {
      if (read(arr, i) === read(val, foundIndex === -1 ? 0 : i - foundIndex)) {
        if (foundIndex === -1) foundIndex = i;
        if (i - foundIndex + 1 === valLength) return foundIndex * indexSize;
      } else {
        if (foundIndex !== -1) i -= i - foundIndex;
        foundIndex = -1;
      }
    }
  } else {
    if (byteOffset + valLength > arrLength) byteOffset = arrLength - valLength;
    for (i = byteOffset; i >= 0; i--) {
      var found = true;
      for (var j = 0; j < valLength; j++) {
        if (read(arr, i + j) !== read(val, j)) {
          found = false;
          break;
        }
      }
      if (found) return i;
    }
  }
  return -1;
}
Buffer.prototype.includes = function includes(val, byteOffset, encoding) {
  return this.indexOf(val, byteOffset, encoding) !== -1;
};
Buffer.prototype.indexOf = function indexOf(val, byteOffset, encoding) {
  return bidirectionalIndexOf(this, val, byteOffset, encoding, true);
};
Buffer.prototype.lastIndexOf = function lastIndexOf(val, byteOffset, encoding) {
  return bidirectionalIndexOf(this, val, byteOffset, encoding, false);
};
function hexWrite(buf, string, offset, length) {
  offset = Number(offset) || 0;
  var remaining = buf.length - offset;
  if (!length) {
    length = remaining;
  } else {
    length = Number(length);
    if (length > remaining) {
      length = remaining;
    }
  }
  var strLen = string.length;
  if (length > strLen / 2) {
    length = strLen / 2;
  }
  var i;
  for (i = 0; i < length; ++i) {
    var parsed = parseInt(string.substr(i * 2, 2), 16);
    if (numberIsNaN(parsed)) return i;
    buf[offset + i] = parsed;
  }
  return i;
}
function utf8Write(buf, string, offset, length) {
  return blitBuffer(utf8ToBytes(string, buf.length - offset), buf, offset, length);
}
function asciiWrite(buf, string, offset, length) {
  return blitBuffer(asciiToBytes(string), buf, offset, length);
}
function base64Write(buf, string, offset, length) {
  return blitBuffer(base64ToBytes(string), buf, offset, length);
}
function ucs2Write(buf, string, offset, length) {
  return blitBuffer(utf16leToBytes(string, buf.length - offset), buf, offset, length);
}
Buffer.prototype.write = function write(string, offset, length, encoding) {
  // Buffer#write(string)
  if (offset === undefined) {
    encoding = 'utf8';
    length = this.length;
    offset = 0;
    // Buffer#write(string, encoding)
  } else if (length === undefined && typeof offset === 'string') {
    encoding = offset;
    length = this.length;
    offset = 0;
    // Buffer#write(string, offset[, length][, encoding])
  } else if (isFinite(offset)) {
    offset = offset >>> 0;
    if (isFinite(length)) {
      length = length >>> 0;
      if (encoding === undefined) encoding = 'utf8';
    } else {
      encoding = length;
      length = undefined;
    }
  } else {
    throw new Error('Buffer.write(string, encoding, offset[, length]) is no longer supported');
  }
  var remaining = this.length - offset;
  if (length === undefined || length > remaining) length = remaining;
  if (string.length > 0 && (length < 0 || offset < 0) || offset > this.length) {
    throw new RangeError('Attempt to write outside buffer bounds');
  }
  if (!encoding) encoding = 'utf8';
  var loweredCase = false;
  for (;;) {
    switch (encoding) {
      case 'hex':
        return hexWrite(this, string, offset, length);
      case 'utf8':
      case 'utf-8':
        return utf8Write(this, string, offset, length);
      case 'ascii':
      case 'latin1':
      case 'binary':
        return asciiWrite(this, string, offset, length);
      case 'base64':
        // Warning: maxLength not taken into account in base64Write
        return base64Write(this, string, offset, length);
      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return ucs2Write(this, string, offset, length);
      default:
        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding);
        encoding = ('' + encoding).toLowerCase();
        loweredCase = true;
    }
  }
};
Buffer.prototype.toJSON = function toJSON() {
  return {
    type: 'Buffer',
    data: Array.prototype.slice.call(this._arr || this, 0)
  };
};
function base64Slice(buf, start, end) {
  if (start === 0 && end === buf.length) {
    return base64.fromByteArray(buf);
  } else {
    return base64.fromByteArray(buf.slice(start, end));
  }
}
function utf8Slice(buf, start, end) {
  end = Math.min(buf.length, end);
  var res = [];
  var i = start;
  while (i < end) {
    var firstByte = buf[i];
    var codePoint = null;
    var bytesPerSequence = firstByte > 0xEF ? 4 : firstByte > 0xDF ? 3 : firstByte > 0xBF ? 2 : 1;
    if (i + bytesPerSequence <= end) {
      var secondByte = void 0,
        thirdByte = void 0,
        fourthByte = void 0,
        tempCodePoint = void 0;
      switch (bytesPerSequence) {
        case 1:
          if (firstByte < 0x80) {
            codePoint = firstByte;
          }
          break;
        case 2:
          secondByte = buf[i + 1];
          if ((secondByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0x1F) << 0x6 | secondByte & 0x3F;
            if (tempCodePoint > 0x7F) {
              codePoint = tempCodePoint;
            }
          }
          break;
        case 3:
          secondByte = buf[i + 1];
          thirdByte = buf[i + 2];
          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0xF) << 0xC | (secondByte & 0x3F) << 0x6 | thirdByte & 0x3F;
            if (tempCodePoint > 0x7FF && (tempCodePoint < 0xD800 || tempCodePoint > 0xDFFF)) {
              codePoint = tempCodePoint;
            }
          }
          break;
        case 4:
          secondByte = buf[i + 1];
          thirdByte = buf[i + 2];
          fourthByte = buf[i + 3];
          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80 && (fourthByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0xF) << 0x12 | (secondByte & 0x3F) << 0xC | (thirdByte & 0x3F) << 0x6 | fourthByte & 0x3F;
            if (tempCodePoint > 0xFFFF && tempCodePoint < 0x110000) {
              codePoint = tempCodePoint;
            }
          }
      }
    }
    if (codePoint === null) {
      // we did not generate a valid codePoint so insert a
      // replacement char (U+FFFD) and advance only 1 byte
      codePoint = 0xFFFD;
      bytesPerSequence = 1;
    } else if (codePoint > 0xFFFF) {
      // encode to utf16 (surrogate pair dance)
      codePoint -= 0x10000;
      res.push(codePoint >>> 10 & 0x3FF | 0xD800);
      codePoint = 0xDC00 | codePoint & 0x3FF;
    }
    res.push(codePoint);
    i += bytesPerSequence;
  }
  return decodeCodePointsArray(res);
}

// Based on http://stackoverflow.com/a/22747272/680742, the browser with
// the lowest limit is Chrome, with 0x10000 args.
// We go 1 magnitude less, for safety
var MAX_ARGUMENTS_LENGTH = 0x1000;
function decodeCodePointsArray(codePoints) {
  var len = codePoints.length;
  if (len <= MAX_ARGUMENTS_LENGTH) {
    return String.fromCharCode.apply(String, codePoints); // avoid extra slice()
  }

  // Decode in chunks to avoid "call stack size exceeded".
  var res = '';
  var i = 0;
  while (i < len) {
    res += String.fromCharCode.apply(String, codePoints.slice(i, i += MAX_ARGUMENTS_LENGTH));
  }
  return res;
}
function asciiSlice(buf, start, end) {
  var ret = '';
  end = Math.min(buf.length, end);
  for (var i = start; i < end; ++i) {
    ret += String.fromCharCode(buf[i] & 0x7F);
  }
  return ret;
}
function latin1Slice(buf, start, end) {
  var ret = '';
  end = Math.min(buf.length, end);
  for (var i = start; i < end; ++i) {
    ret += String.fromCharCode(buf[i]);
  }
  return ret;
}
function hexSlice(buf, start, end) {
  var len = buf.length;
  if (!start || start < 0) start = 0;
  if (!end || end < 0 || end > len) end = len;
  var out = '';
  for (var i = start; i < end; ++i) {
    out += hexSliceLookupTable[buf[i]];
  }
  return out;
}
function utf16leSlice(buf, start, end) {
  var bytes = buf.slice(start, end);
  var res = '';
  // If bytes.length is odd, the last 8 bits must be ignored (same as node.js)
  for (var i = 0; i < bytes.length - 1; i += 2) {
    res += String.fromCharCode(bytes[i] + bytes[i + 1] * 256);
  }
  return res;
}
Buffer.prototype.slice = function slice(start, end) {
  var len = this.length;
  start = ~~start;
  end = end === undefined ? len : ~~end;
  if (start < 0) {
    start += len;
    if (start < 0) start = 0;
  } else if (start > len) {
    start = len;
  }
  if (end < 0) {
    end += len;
    if (end < 0) end = 0;
  } else if (end > len) {
    end = len;
  }
  if (end < start) end = start;
  var newBuf = this.subarray(start, end);
  // Return an augmented `Uint8Array` instance
  Object.setPrototypeOf(newBuf, Buffer.prototype);
  return newBuf;
};

/*
 * Need to make sure that buffer isn't trying to write out of bounds.
 */
function checkOffset(offset, ext, length) {
  if (offset % 1 !== 0 || offset < 0) throw new RangeError('offset is not uint');
  if (offset + ext > length) throw new RangeError('Trying to access beyond buffer length');
}
Buffer.prototype.readUintLE = Buffer.prototype.readUIntLE = function readUIntLE(offset, byteLength, noAssert) {
  offset = offset >>> 0;
  byteLength = byteLength >>> 0;
  if (!noAssert) checkOffset(offset, byteLength, this.length);
  var val = this[offset];
  var mul = 1;
  var i = 0;
  while (++i < byteLength && (mul *= 0x100)) {
    val += this[offset + i] * mul;
  }
  return val;
};
Buffer.prototype.readUintBE = Buffer.prototype.readUIntBE = function readUIntBE(offset, byteLength, noAssert) {
  offset = offset >>> 0;
  byteLength = byteLength >>> 0;
  if (!noAssert) {
    checkOffset(offset, byteLength, this.length);
  }
  var val = this[offset + --byteLength];
  var mul = 1;
  while (byteLength > 0 && (mul *= 0x100)) {
    val += this[offset + --byteLength] * mul;
  }
  return val;
};
Buffer.prototype.readUint8 = Buffer.prototype.readUInt8 = function readUInt8(offset, noAssert) {
  offset = offset >>> 0;
  if (!noAssert) checkOffset(offset, 1, this.length);
  return this[offset];
};
Buffer.prototype.readUint16LE = Buffer.prototype.readUInt16LE = function readUInt16LE(offset, noAssert) {
  offset = offset >>> 0;
  if (!noAssert) checkOffset(offset, 2, this.length);
  return this[offset] | this[offset + 1] << 8;
};
Buffer.prototype.readUint16BE = Buffer.prototype.readUInt16BE = function readUInt16BE(offset, noAssert) {
  offset = offset >>> 0;
  if (!noAssert) checkOffset(offset, 2, this.length);
  return this[offset] << 8 | this[offset + 1];
};
Buffer.prototype.readUint32LE = Buffer.prototype.readUInt32LE = function readUInt32LE(offset, noAssert) {
  offset = offset >>> 0;
  if (!noAssert) checkOffset(offset, 4, this.length);
  return (this[offset] | this[offset + 1] << 8 | this[offset + 2] << 16) + this[offset + 3] * 0x1000000;
};
Buffer.prototype.readUint32BE = Buffer.prototype.readUInt32BE = function readUInt32BE(offset, noAssert) {
  offset = offset >>> 0;
  if (!noAssert) checkOffset(offset, 4, this.length);
  return this[offset] * 0x1000000 + (this[offset + 1] << 16 | this[offset + 2] << 8 | this[offset + 3]);
};
Buffer.prototype.readBigUInt64LE = defineBigIntMethod(function readBigUInt64LE(offset) {
  offset = offset >>> 0;
  validateNumber(offset, 'offset');
  var first = this[offset];
  var last = this[offset + 7];
  if (first === undefined || last === undefined) {
    boundsError(offset, this.length - 8);
  }
  var lo = first + this[++offset] * Math.pow(2, 8) + this[++offset] * Math.pow(2, 16) + this[++offset] * Math.pow(2, 24);
  var hi = this[++offset] + this[++offset] * Math.pow(2, 8) + this[++offset] * Math.pow(2, 16) + last * Math.pow(2, 24);
  return BigInt(lo) + (BigInt(hi) << BigInt(32));
});
Buffer.prototype.readBigUInt64BE = defineBigIntMethod(function readBigUInt64BE(offset) {
  offset = offset >>> 0;
  validateNumber(offset, 'offset');
  var first = this[offset];
  var last = this[offset + 7];
  if (first === undefined || last === undefined) {
    boundsError(offset, this.length - 8);
  }
  var hi = first * Math.pow(2, 24) + this[++offset] * Math.pow(2, 16) + this[++offset] * Math.pow(2, 8) + this[++offset];
  var lo = this[++offset] * Math.pow(2, 24) + this[++offset] * Math.pow(2, 16) + this[++offset] * Math.pow(2, 8) + last;
  return (BigInt(hi) << BigInt(32)) + BigInt(lo);
});
Buffer.prototype.readIntLE = function readIntLE(offset, byteLength, noAssert) {
  offset = offset >>> 0;
  byteLength = byteLength >>> 0;
  if (!noAssert) checkOffset(offset, byteLength, this.length);
  var val = this[offset];
  var mul = 1;
  var i = 0;
  while (++i < byteLength && (mul *= 0x100)) {
    val += this[offset + i] * mul;
  }
  mul *= 0x80;
  if (val >= mul) val -= Math.pow(2, 8 * byteLength);
  return val;
};
Buffer.prototype.readIntBE = function readIntBE(offset, byteLength, noAssert) {
  offset = offset >>> 0;
  byteLength = byteLength >>> 0;
  if (!noAssert) checkOffset(offset, byteLength, this.length);
  var i = byteLength;
  var mul = 1;
  var val = this[offset + --i];
  while (i > 0 && (mul *= 0x100)) {
    val += this[offset + --i] * mul;
  }
  mul *= 0x80;
  if (val >= mul) val -= Math.pow(2, 8 * byteLength);
  return val;
};
Buffer.prototype.readInt8 = function readInt8(offset, noAssert) {
  offset = offset >>> 0;
  if (!noAssert) checkOffset(offset, 1, this.length);
  if (!(this[offset] & 0x80)) return this[offset];
  return (0xff - this[offset] + 1) * -1;
};
Buffer.prototype.readInt16LE = function readInt16LE(offset, noAssert) {
  offset = offset >>> 0;
  if (!noAssert) checkOffset(offset, 2, this.length);
  var val = this[offset] | this[offset + 1] << 8;
  return val & 0x8000 ? val | 0xFFFF0000 : val;
};
Buffer.prototype.readInt16BE = function readInt16BE(offset, noAssert) {
  offset = offset >>> 0;
  if (!noAssert) checkOffset(offset, 2, this.length);
  var val = this[offset + 1] | this[offset] << 8;
  return val & 0x8000 ? val | 0xFFFF0000 : val;
};
Buffer.prototype.readInt32LE = function readInt32LE(offset, noAssert) {
  offset = offset >>> 0;
  if (!noAssert) checkOffset(offset, 4, this.length);
  return this[offset] | this[offset + 1] << 8 | this[offset + 2] << 16 | this[offset + 3] << 24;
};
Buffer.prototype.readInt32BE = function readInt32BE(offset, noAssert) {
  offset = offset >>> 0;
  if (!noAssert) checkOffset(offset, 4, this.length);
  return this[offset] << 24 | this[offset + 1] << 16 | this[offset + 2] << 8 | this[offset + 3];
};
Buffer.prototype.readBigInt64LE = defineBigIntMethod(function readBigInt64LE(offset) {
  offset = offset >>> 0;
  validateNumber(offset, 'offset');
  var first = this[offset];
  var last = this[offset + 7];
  if (first === undefined || last === undefined) {
    boundsError(offset, this.length - 8);
  }
  var val = this[offset + 4] + this[offset + 5] * Math.pow(2, 8) + this[offset + 6] * Math.pow(2, 16) + (last << 24); // Overflow

  return (BigInt(val) << BigInt(32)) + BigInt(first + this[++offset] * Math.pow(2, 8) + this[++offset] * Math.pow(2, 16) + this[++offset] * Math.pow(2, 24));
});
Buffer.prototype.readBigInt64BE = defineBigIntMethod(function readBigInt64BE(offset) {
  offset = offset >>> 0;
  validateNumber(offset, 'offset');
  var first = this[offset];
  var last = this[offset + 7];
  if (first === undefined || last === undefined) {
    boundsError(offset, this.length - 8);
  }
  var val = (first << 24) +
  // Overflow
  this[++offset] * Math.pow(2, 16) + this[++offset] * Math.pow(2, 8) + this[++offset];
  return (BigInt(val) << BigInt(32)) + BigInt(this[++offset] * Math.pow(2, 24) + this[++offset] * Math.pow(2, 16) + this[++offset] * Math.pow(2, 8) + last);
});
Buffer.prototype.readFloatLE = function readFloatLE(offset, noAssert) {
  offset = offset >>> 0;
  if (!noAssert) checkOffset(offset, 4, this.length);
  return ieee754.read(this, offset, true, 23, 4);
};
Buffer.prototype.readFloatBE = function readFloatBE(offset, noAssert) {
  offset = offset >>> 0;
  if (!noAssert) checkOffset(offset, 4, this.length);
  return ieee754.read(this, offset, false, 23, 4);
};
Buffer.prototype.readDoubleLE = function readDoubleLE(offset, noAssert) {
  offset = offset >>> 0;
  if (!noAssert) checkOffset(offset, 8, this.length);
  return ieee754.read(this, offset, true, 52, 8);
};
Buffer.prototype.readDoubleBE = function readDoubleBE(offset, noAssert) {
  offset = offset >>> 0;
  if (!noAssert) checkOffset(offset, 8, this.length);
  return ieee754.read(this, offset, false, 52, 8);
};
function checkInt(buf, value, offset, ext, max, min) {
  if (!Buffer.isBuffer(buf)) throw new TypeError('"buffer" argument must be a Buffer instance');
  if (value > max || value < min) throw new RangeError('"value" argument is out of bounds');
  if (offset + ext > buf.length) throw new RangeError('Index out of range');
}
Buffer.prototype.writeUintLE = Buffer.prototype.writeUIntLE = function writeUIntLE(value, offset, byteLength, noAssert) {
  value = +value;
  offset = offset >>> 0;
  byteLength = byteLength >>> 0;
  if (!noAssert) {
    var maxBytes = Math.pow(2, 8 * byteLength) - 1;
    checkInt(this, value, offset, byteLength, maxBytes, 0);
  }
  var mul = 1;
  var i = 0;
  this[offset] = value & 0xFF;
  while (++i < byteLength && (mul *= 0x100)) {
    this[offset + i] = value / mul & 0xFF;
  }
  return offset + byteLength;
};
Buffer.prototype.writeUintBE = Buffer.prototype.writeUIntBE = function writeUIntBE(value, offset, byteLength, noAssert) {
  value = +value;
  offset = offset >>> 0;
  byteLength = byteLength >>> 0;
  if (!noAssert) {
    var maxBytes = Math.pow(2, 8 * byteLength) - 1;
    checkInt(this, value, offset, byteLength, maxBytes, 0);
  }
  var i = byteLength - 1;
  var mul = 1;
  this[offset + i] = value & 0xFF;
  while (--i >= 0 && (mul *= 0x100)) {
    this[offset + i] = value / mul & 0xFF;
  }
  return offset + byteLength;
};
Buffer.prototype.writeUint8 = Buffer.prototype.writeUInt8 = function writeUInt8(value, offset, noAssert) {
  value = +value;
  offset = offset >>> 0;
  if (!noAssert) checkInt(this, value, offset, 1, 0xff, 0);
  this[offset] = value & 0xff;
  return offset + 1;
};
Buffer.prototype.writeUint16LE = Buffer.prototype.writeUInt16LE = function writeUInt16LE(value, offset, noAssert) {
  value = +value;
  offset = offset >>> 0;
  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0);
  this[offset] = value & 0xff;
  this[offset + 1] = value >>> 8;
  return offset + 2;
};
Buffer.prototype.writeUint16BE = Buffer.prototype.writeUInt16BE = function writeUInt16BE(value, offset, noAssert) {
  value = +value;
  offset = offset >>> 0;
  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0);
  this[offset] = value >>> 8;
  this[offset + 1] = value & 0xff;
  return offset + 2;
};
Buffer.prototype.writeUint32LE = Buffer.prototype.writeUInt32LE = function writeUInt32LE(value, offset, noAssert) {
  value = +value;
  offset = offset >>> 0;
  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0);
  this[offset + 3] = value >>> 24;
  this[offset + 2] = value >>> 16;
  this[offset + 1] = value >>> 8;
  this[offset] = value & 0xff;
  return offset + 4;
};
Buffer.prototype.writeUint32BE = Buffer.prototype.writeUInt32BE = function writeUInt32BE(value, offset, noAssert) {
  value = +value;
  offset = offset >>> 0;
  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0);
  this[offset] = value >>> 24;
  this[offset + 1] = value >>> 16;
  this[offset + 2] = value >>> 8;
  this[offset + 3] = value & 0xff;
  return offset + 4;
};
function wrtBigUInt64LE(buf, value, offset, min, max) {
  checkIntBI(value, min, max, buf, offset, 7);
  var lo = Number(value & BigInt(0xffffffff));
  buf[offset++] = lo;
  lo = lo >> 8;
  buf[offset++] = lo;
  lo = lo >> 8;
  buf[offset++] = lo;
  lo = lo >> 8;
  buf[offset++] = lo;
  var hi = Number(value >> BigInt(32) & BigInt(0xffffffff));
  buf[offset++] = hi;
  hi = hi >> 8;
  buf[offset++] = hi;
  hi = hi >> 8;
  buf[offset++] = hi;
  hi = hi >> 8;
  buf[offset++] = hi;
  return offset;
}
function wrtBigUInt64BE(buf, value, offset, min, max) {
  checkIntBI(value, min, max, buf, offset, 7);
  var lo = Number(value & BigInt(0xffffffff));
  buf[offset + 7] = lo;
  lo = lo >> 8;
  buf[offset + 6] = lo;
  lo = lo >> 8;
  buf[offset + 5] = lo;
  lo = lo >> 8;
  buf[offset + 4] = lo;
  var hi = Number(value >> BigInt(32) & BigInt(0xffffffff));
  buf[offset + 3] = hi;
  hi = hi >> 8;
  buf[offset + 2] = hi;
  hi = hi >> 8;
  buf[offset + 1] = hi;
  hi = hi >> 8;
  buf[offset] = hi;
  return offset + 8;
}
Buffer.prototype.writeBigUInt64LE = defineBigIntMethod(function writeBigUInt64LE(value) {
  var offset = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
  return wrtBigUInt64LE(this, value, offset, BigInt(0), BigInt('0xffffffffffffffff'));
});
Buffer.prototype.writeBigUInt64BE = defineBigIntMethod(function writeBigUInt64BE(value) {
  var offset = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
  return wrtBigUInt64BE(this, value, offset, BigInt(0), BigInt('0xffffffffffffffff'));
});
Buffer.prototype.writeIntLE = function writeIntLE(value, offset, byteLength, noAssert) {
  value = +value;
  offset = offset >>> 0;
  if (!noAssert) {
    var limit = Math.pow(2, 8 * byteLength - 1);
    checkInt(this, value, offset, byteLength, limit - 1, -limit);
  }
  var i = 0;
  var mul = 1;
  var sub = 0;
  this[offset] = value & 0xFF;
  while (++i < byteLength && (mul *= 0x100)) {
    if (value < 0 && sub === 0 && this[offset + i - 1] !== 0) {
      sub = 1;
    }
    this[offset + i] = (value / mul >> 0) - sub & 0xFF;
  }
  return offset + byteLength;
};
Buffer.prototype.writeIntBE = function writeIntBE(value, offset, byteLength, noAssert) {
  value = +value;
  offset = offset >>> 0;
  if (!noAssert) {
    var limit = Math.pow(2, 8 * byteLength - 1);
    checkInt(this, value, offset, byteLength, limit - 1, -limit);
  }
  var i = byteLength - 1;
  var mul = 1;
  var sub = 0;
  this[offset + i] = value & 0xFF;
  while (--i >= 0 && (mul *= 0x100)) {
    if (value < 0 && sub === 0 && this[offset + i + 1] !== 0) {
      sub = 1;
    }
    this[offset + i] = (value / mul >> 0) - sub & 0xFF;
  }
  return offset + byteLength;
};
Buffer.prototype.writeInt8 = function writeInt8(value, offset, noAssert) {
  value = +value;
  offset = offset >>> 0;
  if (!noAssert) checkInt(this, value, offset, 1, 0x7f, -0x80);
  if (value < 0) value = 0xff + value + 1;
  this[offset] = value & 0xff;
  return offset + 1;
};
Buffer.prototype.writeInt16LE = function writeInt16LE(value, offset, noAssert) {
  value = +value;
  offset = offset >>> 0;
  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000);
  this[offset] = value & 0xff;
  this[offset + 1] = value >>> 8;
  return offset + 2;
};
Buffer.prototype.writeInt16BE = function writeInt16BE(value, offset, noAssert) {
  value = +value;
  offset = offset >>> 0;
  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000);
  this[offset] = value >>> 8;
  this[offset + 1] = value & 0xff;
  return offset + 2;
};
Buffer.prototype.writeInt32LE = function writeInt32LE(value, offset, noAssert) {
  value = +value;
  offset = offset >>> 0;
  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000);
  this[offset] = value & 0xff;
  this[offset + 1] = value >>> 8;
  this[offset + 2] = value >>> 16;
  this[offset + 3] = value >>> 24;
  return offset + 4;
};
Buffer.prototype.writeInt32BE = function writeInt32BE(value, offset, noAssert) {
  value = +value;
  offset = offset >>> 0;
  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000);
  if (value < 0) value = 0xffffffff + value + 1;
  this[offset] = value >>> 24;
  this[offset + 1] = value >>> 16;
  this[offset + 2] = value >>> 8;
  this[offset + 3] = value & 0xff;
  return offset + 4;
};
Buffer.prototype.writeBigInt64LE = defineBigIntMethod(function writeBigInt64LE(value) {
  var offset = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
  return wrtBigUInt64LE(this, value, offset, -BigInt('0x8000000000000000'), BigInt('0x7fffffffffffffff'));
});
Buffer.prototype.writeBigInt64BE = defineBigIntMethod(function writeBigInt64BE(value) {
  var offset = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
  return wrtBigUInt64BE(this, value, offset, -BigInt('0x8000000000000000'), BigInt('0x7fffffffffffffff'));
});
function checkIEEE754(buf, value, offset, ext, max, min) {
  if (offset + ext > buf.length) throw new RangeError('Index out of range');
  if (offset < 0) throw new RangeError('Index out of range');
}
function writeFloat(buf, value, offset, littleEndian, noAssert) {
  value = +value;
  offset = offset >>> 0;
  if (!noAssert) {
    checkIEEE754(buf, value, offset, 4, 3.4028234663852886e+38, -3.4028234663852886e+38);
  }
  ieee754.write(buf, value, offset, littleEndian, 23, 4);
  return offset + 4;
}
Buffer.prototype.writeFloatLE = function writeFloatLE(value, offset, noAssert) {
  return writeFloat(this, value, offset, true, noAssert);
};
Buffer.prototype.writeFloatBE = function writeFloatBE(value, offset, noAssert) {
  return writeFloat(this, value, offset, false, noAssert);
};
function writeDouble(buf, value, offset, littleEndian, noAssert) {
  value = +value;
  offset = offset >>> 0;
  if (!noAssert) {
    checkIEEE754(buf, value, offset, 8, 1.7976931348623157E+308, -1.7976931348623157E+308);
  }
  ieee754.write(buf, value, offset, littleEndian, 52, 8);
  return offset + 8;
}
Buffer.prototype.writeDoubleLE = function writeDoubleLE(value, offset, noAssert) {
  return writeDouble(this, value, offset, true, noAssert);
};
Buffer.prototype.writeDoubleBE = function writeDoubleBE(value, offset, noAssert) {
  return writeDouble(this, value, offset, false, noAssert);
};

// copy(targetBuffer, targetStart=0, sourceStart=0, sourceEnd=buffer.length)
Buffer.prototype.copy = function copy(target, targetStart, start, end) {
  if (!Buffer.isBuffer(target)) throw new TypeError('argument should be a Buffer');
  if (!start) start = 0;
  if (!end && end !== 0) end = this.length;
  if (targetStart >= target.length) targetStart = target.length;
  if (!targetStart) targetStart = 0;
  if (end > 0 && end < start) end = start;

  // Copy 0 bytes; we're done
  if (end === start) return 0;
  if (target.length === 0 || this.length === 0) return 0;

  // Fatal error conditions
  if (targetStart < 0) {
    throw new RangeError('targetStart out of bounds');
  }
  if (start < 0 || start >= this.length) throw new RangeError('Index out of range');
  if (end < 0) throw new RangeError('sourceEnd out of bounds');

  // Are we oob?
  if (end > this.length) end = this.length;
  if (target.length - targetStart < end - start) {
    end = target.length - targetStart + start;
  }
  var len = end - start;
  if (this === target && typeof Uint8Array.prototype.copyWithin === 'function') {
    // Use built-in when available, missing from IE11
    this.copyWithin(targetStart, start, end);
  } else {
    Uint8Array.prototype.set.call(target, this.subarray(start, end), targetStart);
  }
  return len;
};

// Usage:
//    buffer.fill(number[, offset[, end]])
//    buffer.fill(buffer[, offset[, end]])
//    buffer.fill(string[, offset[, end]][, encoding])
Buffer.prototype.fill = function fill(val, start, end, encoding) {
  // Handle string cases:
  if (typeof val === 'string') {
    if (typeof start === 'string') {
      encoding = start;
      start = 0;
      end = this.length;
    } else if (typeof end === 'string') {
      encoding = end;
      end = this.length;
    }
    if (encoding !== undefined && typeof encoding !== 'string') {
      throw new TypeError('encoding must be a string');
    }
    if (typeof encoding === 'string' && !Buffer.isEncoding(encoding)) {
      throw new TypeError('Unknown encoding: ' + encoding);
    }
    if (val.length === 1) {
      var code = val.charCodeAt(0);
      if (encoding === 'utf8' && code < 128 || encoding === 'latin1') {
        // Fast path: If `val` fits into a single byte, use that numeric value.
        val = code;
      }
    }
  } else if (typeof val === 'number') {
    val = val & 255;
  } else if (typeof val === 'boolean') {
    val = Number(val);
  }

  // Invalid ranges are not set to a default, so can range check early.
  if (start < 0 || this.length < start || this.length < end) {
    throw new RangeError('Out of range index');
  }
  if (end <= start) {
    return this;
  }
  start = start >>> 0;
  end = end === undefined ? this.length : end >>> 0;
  if (!val) val = 0;
  var i;
  if (typeof val === 'number') {
    for (i = start; i < end; ++i) {
      this[i] = val;
    }
  } else {
    var bytes = Buffer.isBuffer(val) ? val : Buffer.from(val, encoding);
    var len = bytes.length;
    if (len === 0) {
      throw new TypeError('The value "' + val + '" is invalid for argument "value"');
    }
    for (i = 0; i < end - start; ++i) {
      this[i + start] = bytes[i % len];
    }
  }
  return this;
};

// CUSTOM ERRORS
// =============

// Simplified versions from Node, changed for Buffer-only usage
var errors = {};
function E(sym, getMessage, Base) {
  errors[sym] = /*#__PURE__*/function (_Base) {
    _inherits(NodeError, _Base);
    var _super = _createSuper(NodeError);
    function NodeError() {
      var _this;
      _classCallCheck(this, NodeError);
      _this = _super.call(this);
      Object.defineProperty(_assertThisInitialized(_this), 'message', {
        value: getMessage.apply(_assertThisInitialized(_this), arguments),
        writable: true,
        configurable: true
      });

      // Add the error code to the name to include it in the stack trace.
      _this.name = "".concat(_this.name, " [").concat(sym, "]");
      // Access the stack to generate the error message including the error code
      // from the name.
      _this.stack; // eslint-disable-line no-unused-expressions
      // Reset the name to the actual name.
      delete _this.name;
      return _this;
    }
    _createClass(NodeError, [{
      key: "code",
      get: function get() {
        return sym;
      },
      set: function set(value) {
        Object.defineProperty(this, 'code', {
          configurable: true,
          enumerable: true,
          value: value,
          writable: true
        });
      }
    }, {
      key: "toString",
      value: function toString() {
        return "".concat(this.name, " [").concat(sym, "]: ").concat(this.message);
      }
    }]);
    return NodeError;
  }(Base);
}
E('ERR_BUFFER_OUT_OF_BOUNDS', function (name) {
  if (name) {
    return "".concat(name, " is outside of buffer bounds");
  }
  return 'Attempt to access memory outside buffer bounds';
}, RangeError);
E('ERR_INVALID_ARG_TYPE', function (name, actual) {
  return "The \"".concat(name, "\" argument must be of type number. Received type ").concat(_typeof(actual));
}, TypeError);
E('ERR_OUT_OF_RANGE', function (str, range, input) {
  var msg = "The value of \"".concat(str, "\" is out of range.");
  var received = input;
  if (Number.isInteger(input) && Math.abs(input) > Math.pow(2, 32)) {
    received = addNumericalSeparator(String(input));
  } else if (typeof input === 'bigint') {
    received = String(input);
    if (input > Math.pow(BigInt(2), BigInt(32)) || input < -Math.pow(BigInt(2), BigInt(32))) {
      received = addNumericalSeparator(received);
    }
    received += 'n';
  }
  msg += " It must be ".concat(range, ". Received ").concat(received);
  return msg;
}, RangeError);
function addNumericalSeparator(val) {
  var res = '';
  var i = val.length;
  var start = val[0] === '-' ? 1 : 0;
  for (; i >= start + 4; i -= 3) {
    res = "_".concat(val.slice(i - 3, i)).concat(res);
  }
  return "".concat(val.slice(0, i)).concat(res);
}

// CHECK FUNCTIONS
// ===============

function checkBounds(buf, offset, byteLength) {
  validateNumber(offset, 'offset');
  if (buf[offset] === undefined || buf[offset + byteLength] === undefined) {
    boundsError(offset, buf.length - (byteLength + 1));
  }
}
function checkIntBI(value, min, max, buf, offset, byteLength) {
  if (value > max || value < min) {
    var n = typeof min === 'bigint' ? 'n' : '';
    var range;
    if (byteLength > 3) {
      if (min === 0 || min === BigInt(0)) {
        range = ">= 0".concat(n, " and < 2").concat(n, " ** ").concat((byteLength + 1) * 8).concat(n);
      } else {
        range = ">= -(2".concat(n, " ** ").concat((byteLength + 1) * 8 - 1).concat(n, ") and < 2 ** ") + "".concat((byteLength + 1) * 8 - 1).concat(n);
      }
    } else {
      range = ">= ".concat(min).concat(n, " and <= ").concat(max).concat(n);
    }
    throw new errors.ERR_OUT_OF_RANGE('value', range, value);
  }
  checkBounds(buf, offset, byteLength);
}
function validateNumber(value, name) {
  if (typeof value !== 'number') {
    throw new errors.ERR_INVALID_ARG_TYPE(name, 'number', value);
  }
}
function boundsError(value, length, type) {
  if (Math.floor(value) !== value) {
    validateNumber(value, type);
    throw new errors.ERR_OUT_OF_RANGE(type || 'offset', 'an integer', value);
  }
  if (length < 0) {
    throw new errors.ERR_BUFFER_OUT_OF_BOUNDS();
  }
  throw new errors.ERR_OUT_OF_RANGE(type || 'offset', ">= ".concat(type ? 1 : 0, " and <= ").concat(length), value);
}

// HELPER FUNCTIONS
// ================

var INVALID_BASE64_RE = /[^+/0-9A-Za-z-_]/g;
function base64clean(str) {
  // Node takes equal signs as end of the Base64 encoding
  str = str.split('=')[0];
  // Node strips out invalid characters like \n and \t from the string, base64-js does not
  str = str.trim().replace(INVALID_BASE64_RE, '');
  // Node converts strings with length < 2 to ''
  if (str.length < 2) return '';
  // Node allows for non-padded base64 strings (missing trailing ===), base64-js does not
  while (str.length % 4 !== 0) {
    str = str + '=';
  }
  return str;
}
function utf8ToBytes(string, units) {
  units = units || Infinity;
  var codePoint;
  var length = string.length;
  var leadSurrogate = null;
  var bytes = [];
  for (var i = 0; i < length; ++i) {
    codePoint = string.charCodeAt(i);

    // is surrogate component
    if (codePoint > 0xD7FF && codePoint < 0xE000) {
      // last char was a lead
      if (!leadSurrogate) {
        // no lead yet
        if (codePoint > 0xDBFF) {
          // unexpected trail
          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD);
          continue;
        } else if (i + 1 === length) {
          // unpaired lead
          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD);
          continue;
        }

        // valid lead
        leadSurrogate = codePoint;
        continue;
      }

      // 2 leads in a row
      if (codePoint < 0xDC00) {
        if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD);
        leadSurrogate = codePoint;
        continue;
      }

      // valid surrogate pair
      codePoint = (leadSurrogate - 0xD800 << 10 | codePoint - 0xDC00) + 0x10000;
    } else if (leadSurrogate) {
      // valid bmp char, but last char was a lead
      if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD);
    }
    leadSurrogate = null;

    // encode utf8
    if (codePoint < 0x80) {
      if ((units -= 1) < 0) break;
      bytes.push(codePoint);
    } else if (codePoint < 0x800) {
      if ((units -= 2) < 0) break;
      bytes.push(codePoint >> 0x6 | 0xC0, codePoint & 0x3F | 0x80);
    } else if (codePoint < 0x10000) {
      if ((units -= 3) < 0) break;
      bytes.push(codePoint >> 0xC | 0xE0, codePoint >> 0x6 & 0x3F | 0x80, codePoint & 0x3F | 0x80);
    } else if (codePoint < 0x110000) {
      if ((units -= 4) < 0) break;
      bytes.push(codePoint >> 0x12 | 0xF0, codePoint >> 0xC & 0x3F | 0x80, codePoint >> 0x6 & 0x3F | 0x80, codePoint & 0x3F | 0x80);
    } else {
      throw new Error('Invalid code point');
    }
  }
  return bytes;
}
function asciiToBytes(str) {
  var byteArray = [];
  for (var i = 0; i < str.length; ++i) {
    // Node's code seems to be doing this and not & 0x7F..
    byteArray.push(str.charCodeAt(i) & 0xFF);
  }
  return byteArray;
}
function utf16leToBytes(str, units) {
  var c, hi, lo;
  var byteArray = [];
  for (var i = 0; i < str.length; ++i) {
    if ((units -= 2) < 0) break;
    c = str.charCodeAt(i);
    hi = c >> 8;
    lo = c % 256;
    byteArray.push(lo);
    byteArray.push(hi);
  }
  return byteArray;
}
function base64ToBytes(str) {
  return base64.toByteArray(base64clean(str));
}
function blitBuffer(src, dst, offset, length) {
  var i;
  for (i = 0; i < length; ++i) {
    if (i + offset >= dst.length || i >= src.length) break;
    dst[i + offset] = src[i];
  }
  return i;
}

// ArrayBuffer or Uint8Array objects from other contexts (i.e. iframes) do not pass
// the `instanceof` check but they should be treated as of that type.
// See: https://github.com/feross/buffer/issues/166
function isInstance(obj, type) {
  return obj instanceof type || obj != null && obj.constructor != null && obj.constructor.name != null && obj.constructor.name === type.name;
}
function numberIsNaN(obj) {
  // For IE11 support
  return obj !== obj; // eslint-disable-line no-self-compare
}

// Create lookup table for `toString('hex')`
// See: https://github.com/feross/buffer/issues/219
var hexSliceLookupTable = function () {
  var alphabet = '0123456789abcdef';
  var table = new Array(256);
  for (var i = 0; i < 16; ++i) {
    var i16 = i * 16;
    for (var j = 0; j < 16; ++j) {
      table[i16 + j] = alphabet[i] + alphabet[j];
    }
  }
  return table;
}();

// Return not function with Error if BigInt not supported
function defineBigIntMethod(fn) {
  return typeof BigInt === 'undefined' ? BufferBigIntNotDefined : fn;
}
function BufferBigIntNotDefined() {
  throw new Error('BigInt not supported');
}

/***/ }),

/***/ 1403:
/***/ ((module) => {

module.exports = {
  "100": "Continue",
  "101": "Switching Protocols",
  "102": "Processing",
  "200": "OK",
  "201": "Created",
  "202": "Accepted",
  "203": "Non-Authoritative Information",
  "204": "No Content",
  "205": "Reset Content",
  "206": "Partial Content",
  "207": "Multi-Status",
  "208": "Already Reported",
  "226": "IM Used",
  "300": "Multiple Choices",
  "301": "Moved Permanently",
  "302": "Found",
  "303": "See Other",
  "304": "Not Modified",
  "305": "Use Proxy",
  "307": "Temporary Redirect",
  "308": "Permanent Redirect",
  "400": "Bad Request",
  "401": "Unauthorized",
  "402": "Payment Required",
  "403": "Forbidden",
  "404": "Not Found",
  "405": "Method Not Allowed",
  "406": "Not Acceptable",
  "407": "Proxy Authentication Required",
  "408": "Request Timeout",
  "409": "Conflict",
  "410": "Gone",
  "411": "Length Required",
  "412": "Precondition Failed",
  "413": "Payload Too Large",
  "414": "URI Too Long",
  "415": "Unsupported Media Type",
  "416": "Range Not Satisfiable",
  "417": "Expectation Failed",
  "418": "I'm a teapot",
  "421": "Misdirected Request",
  "422": "Unprocessable Entity",
  "423": "Locked",
  "424": "Failed Dependency",
  "425": "Unordered Collection",
  "426": "Upgrade Required",
  "428": "Precondition Required",
  "429": "Too Many Requests",
  "431": "Request Header Fields Too Large",
  "451": "Unavailable For Legal Reasons",
  "500": "Internal Server Error",
  "501": "Not Implemented",
  "502": "Bad Gateway",
  "503": "Service Unavailable",
  "504": "Gateway Timeout",
  "505": "HTTP Version Not Supported",
  "506": "Variant Also Negotiates",
  "507": "Insufficient Storage",
  "508": "Loop Detected",
  "509": "Bandwidth Limit Exceeded",
  "510": "Not Extended",
  "511": "Network Authentication Required"
};

/***/ }),

/***/ 2648:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var GetIntrinsic = __webpack_require__(3584);
var callBind = __webpack_require__(7257);
var $indexOf = callBind(GetIntrinsic('String.prototype.indexOf'));
module.exports = function callBoundIntrinsic(name, allowMissing) {
  var intrinsic = GetIntrinsic(name, !!allowMissing);
  if (typeof intrinsic === 'function' && $indexOf(name, '.prototype.') > -1) {
    return callBind(intrinsic);
  }
  return intrinsic;
};

/***/ }),

/***/ 7257:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var bind = __webpack_require__(4597);
var GetIntrinsic = __webpack_require__(3584);
var setFunctionLength = __webpack_require__(7012);
var $TypeError = GetIntrinsic('%TypeError%');
var $apply = GetIntrinsic('%Function.prototype.apply%');
var $call = GetIntrinsic('%Function.prototype.call%');
var $reflectApply = GetIntrinsic('%Reflect.apply%', true) || bind.call($call, $apply);
var $defineProperty = GetIntrinsic('%Object.defineProperty%', true);
var $max = GetIntrinsic('%Math.max%');
if ($defineProperty) {
  try {
    $defineProperty({}, 'a', {
      value: 1
    });
  } catch (e) {
    // IE 8 has a broken defineProperty
    $defineProperty = null;
  }
}
module.exports = function callBind(originalFunction) {
  if (typeof originalFunction !== 'function') {
    throw new $TypeError('a function is required');
  }
  var func = $reflectApply(bind, $call, arguments);
  return setFunctionLength(func, 1 + $max(0, originalFunction.length - (arguments.length - 1)), true);
};
var applyBind = function applyBind() {
  return $reflectApply(bind, $apply, arguments);
};
if ($defineProperty) {
  $defineProperty(module.exports, 'apply', {
    value: applyBind
  });
} else {
  module.exports.apply = applyBind;
}

/***/ }),

/***/ 1314:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
var hasPropertyDescriptors = __webpack_require__(4607)();
var GetIntrinsic = __webpack_require__(3584);
var $defineProperty = hasPropertyDescriptors && GetIntrinsic('%Object.defineProperty%', true);
if ($defineProperty) {
  try {
    $defineProperty({}, 'a', {
      value: 1
    });
  } catch (e) {
    // IE 8 has a broken defineProperty
    $defineProperty = false;
  }
}
var $SyntaxError = GetIntrinsic('%SyntaxError%');
var $TypeError = GetIntrinsic('%TypeError%');
var gopd = __webpack_require__(1700);

/** @type {(obj: Record<PropertyKey, unknown>, property: PropertyKey, value: unknown, nonEnumerable?: boolean | null, nonWritable?: boolean | null, nonConfigurable?: boolean | null, loose?: boolean) => void} */
module.exports = function defineDataProperty(obj, property, value) {
  if (!obj || _typeof(obj) !== 'object' && typeof obj !== 'function') {
    throw new $TypeError('`obj` must be an object or a function`');
  }
  if (typeof property !== 'string' && _typeof(property) !== 'symbol') {
    throw new $TypeError('`property` must be a string or a symbol`');
  }
  if (arguments.length > 3 && typeof arguments[3] !== 'boolean' && arguments[3] !== null) {
    throw new $TypeError('`nonEnumerable`, if provided, must be a boolean or null');
  }
  if (arguments.length > 4 && typeof arguments[4] !== 'boolean' && arguments[4] !== null) {
    throw new $TypeError('`nonWritable`, if provided, must be a boolean or null');
  }
  if (arguments.length > 5 && typeof arguments[5] !== 'boolean' && arguments[5] !== null) {
    throw new $TypeError('`nonConfigurable`, if provided, must be a boolean or null');
  }
  if (arguments.length > 6 && typeof arguments[6] !== 'boolean') {
    throw new $TypeError('`loose`, if provided, must be a boolean');
  }
  var nonEnumerable = arguments.length > 3 ? arguments[3] : null;
  var nonWritable = arguments.length > 4 ? arguments[4] : null;
  var nonConfigurable = arguments.length > 5 ? arguments[5] : null;
  var loose = arguments.length > 6 ? arguments[6] : false;

  /* @type {false | TypedPropertyDescriptor<unknown>} */
  var desc = !!gopd && gopd(obj, property);
  if ($defineProperty) {
    $defineProperty(obj, property, {
      configurable: nonConfigurable === null && desc ? desc.configurable : !nonConfigurable,
      enumerable: nonEnumerable === null && desc ? desc.enumerable : !nonEnumerable,
      value: value,
      writable: nonWritable === null && desc ? desc.writable : !nonWritable
    });
  } else if (loose || !nonEnumerable && !nonWritable && !nonConfigurable) {
    // must fall back to [[Set]], and was not explicitly asked to make non-enumerable, non-writable, or non-configurable
    obj[property] = value; // eslint-disable-line no-param-reassign
  } else {
    throw new $SyntaxError('This environment does not support defining a property as non-configurable, non-writable, or non-enumerable.');
  }
};

/***/ }),

/***/ 1590:
/***/ ((module) => {

"use strict";
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.



function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
var R = (typeof Reflect === "undefined" ? "undefined" : _typeof(Reflect)) === 'object' ? Reflect : null;
var ReflectApply = R && typeof R.apply === 'function' ? R.apply : function ReflectApply(target, receiver, args) {
  return Function.prototype.apply.call(target, receiver, args);
};
var ReflectOwnKeys;
if (R && typeof R.ownKeys === 'function') {
  ReflectOwnKeys = R.ownKeys;
} else if (Object.getOwnPropertySymbols) {
  ReflectOwnKeys = function ReflectOwnKeys(target) {
    return Object.getOwnPropertyNames(target).concat(Object.getOwnPropertySymbols(target));
  };
} else {
  ReflectOwnKeys = function ReflectOwnKeys(target) {
    return Object.getOwnPropertyNames(target);
  };
}
function ProcessEmitWarning(warning) {
  if (console && console.warn) console.warn(warning);
}
var NumberIsNaN = Number.isNaN || function NumberIsNaN(value) {
  return value !== value;
};
function EventEmitter() {
  EventEmitter.init.call(this);
}
module.exports = EventEmitter;
module.exports.once = once;

// Backwards-compat with node 0.10.x
EventEmitter.EventEmitter = EventEmitter;
EventEmitter.prototype._events = undefined;
EventEmitter.prototype._eventsCount = 0;
EventEmitter.prototype._maxListeners = undefined;

// By default EventEmitters will print a warning if more than 10 listeners are
// added to it. This is a useful default which helps finding memory leaks.
var defaultMaxListeners = 10;
function checkListener(listener) {
  if (typeof listener !== 'function') {
    throw new TypeError('The "listener" argument must be of type Function. Received type ' + _typeof(listener));
  }
}
Object.defineProperty(EventEmitter, 'defaultMaxListeners', {
  enumerable: true,
  get: function get() {
    return defaultMaxListeners;
  },
  set: function set(arg) {
    if (typeof arg !== 'number' || arg < 0 || NumberIsNaN(arg)) {
      throw new RangeError('The value of "defaultMaxListeners" is out of range. It must be a non-negative number. Received ' + arg + '.');
    }
    defaultMaxListeners = arg;
  }
});
EventEmitter.init = function () {
  if (this._events === undefined || this._events === Object.getPrototypeOf(this)._events) {
    this._events = Object.create(null);
    this._eventsCount = 0;
  }
  this._maxListeners = this._maxListeners || undefined;
};

// Obviously not all Emitters should be limited to 10. This function allows
// that to be increased. Set to zero for unlimited.
EventEmitter.prototype.setMaxListeners = function setMaxListeners(n) {
  if (typeof n !== 'number' || n < 0 || NumberIsNaN(n)) {
    throw new RangeError('The value of "n" is out of range. It must be a non-negative number. Received ' + n + '.');
  }
  this._maxListeners = n;
  return this;
};
function _getMaxListeners(that) {
  if (that._maxListeners === undefined) return EventEmitter.defaultMaxListeners;
  return that._maxListeners;
}
EventEmitter.prototype.getMaxListeners = function getMaxListeners() {
  return _getMaxListeners(this);
};
EventEmitter.prototype.emit = function emit(type) {
  var args = [];
  for (var i = 1; i < arguments.length; i++) args.push(arguments[i]);
  var doError = type === 'error';
  var events = this._events;
  if (events !== undefined) doError = doError && events.error === undefined;else if (!doError) return false;

  // If there is no 'error' event listener then throw.
  if (doError) {
    var er;
    if (args.length > 0) er = args[0];
    if (er instanceof Error) {
      // Note: The comments on the `throw` lines are intentional, they show
      // up in Node's output if this results in an unhandled exception.
      throw er; // Unhandled 'error' event
    }
    // At least give some kind of context to the user
    var err = new Error('Unhandled error.' + (er ? ' (' + er.message + ')' : ''));
    err.context = er;
    throw err; // Unhandled 'error' event
  }

  var handler = events[type];
  if (handler === undefined) return false;
  if (typeof handler === 'function') {
    ReflectApply(handler, this, args);
  } else {
    var len = handler.length;
    var listeners = arrayClone(handler, len);
    for (var i = 0; i < len; ++i) ReflectApply(listeners[i], this, args);
  }
  return true;
};
function _addListener(target, type, listener, prepend) {
  var m;
  var events;
  var existing;
  checkListener(listener);
  events = target._events;
  if (events === undefined) {
    events = target._events = Object.create(null);
    target._eventsCount = 0;
  } else {
    // To avoid recursion in the case that type === "newListener"! Before
    // adding it to the listeners, first emit "newListener".
    if (events.newListener !== undefined) {
      target.emit('newListener', type, listener.listener ? listener.listener : listener);

      // Re-assign `events` because a newListener handler could have caused the
      // this._events to be assigned to a new object
      events = target._events;
    }
    existing = events[type];
  }
  if (existing === undefined) {
    // Optimize the case of one listener. Don't need the extra array object.
    existing = events[type] = listener;
    ++target._eventsCount;
  } else {
    if (typeof existing === 'function') {
      // Adding the second element, need to change to array.
      existing = events[type] = prepend ? [listener, existing] : [existing, listener];
      // If we've already got an array, just append.
    } else if (prepend) {
      existing.unshift(listener);
    } else {
      existing.push(listener);
    }

    // Check for listener leak
    m = _getMaxListeners(target);
    if (m > 0 && existing.length > m && !existing.warned) {
      existing.warned = true;
      // No error code for this since it is a Warning
      // eslint-disable-next-line no-restricted-syntax
      var w = new Error('Possible EventEmitter memory leak detected. ' + existing.length + ' ' + String(type) + ' listeners ' + 'added. Use emitter.setMaxListeners() to ' + 'increase limit');
      w.name = 'MaxListenersExceededWarning';
      w.emitter = target;
      w.type = type;
      w.count = existing.length;
      ProcessEmitWarning(w);
    }
  }
  return target;
}
EventEmitter.prototype.addListener = function addListener(type, listener) {
  return _addListener(this, type, listener, false);
};
EventEmitter.prototype.on = EventEmitter.prototype.addListener;
EventEmitter.prototype.prependListener = function prependListener(type, listener) {
  return _addListener(this, type, listener, true);
};
function onceWrapper() {
  if (!this.fired) {
    this.target.removeListener(this.type, this.wrapFn);
    this.fired = true;
    if (arguments.length === 0) return this.listener.call(this.target);
    return this.listener.apply(this.target, arguments);
  }
}
function _onceWrap(target, type, listener) {
  var state = {
    fired: false,
    wrapFn: undefined,
    target: target,
    type: type,
    listener: listener
  };
  var wrapped = onceWrapper.bind(state);
  wrapped.listener = listener;
  state.wrapFn = wrapped;
  return wrapped;
}
EventEmitter.prototype.once = function once(type, listener) {
  checkListener(listener);
  this.on(type, _onceWrap(this, type, listener));
  return this;
};
EventEmitter.prototype.prependOnceListener = function prependOnceListener(type, listener) {
  checkListener(listener);
  this.prependListener(type, _onceWrap(this, type, listener));
  return this;
};

// Emits a 'removeListener' event if and only if the listener was removed.
EventEmitter.prototype.removeListener = function removeListener(type, listener) {
  var list, events, position, i, originalListener;
  checkListener(listener);
  events = this._events;
  if (events === undefined) return this;
  list = events[type];
  if (list === undefined) return this;
  if (list === listener || list.listener === listener) {
    if (--this._eventsCount === 0) this._events = Object.create(null);else {
      delete events[type];
      if (events.removeListener) this.emit('removeListener', type, list.listener || listener);
    }
  } else if (typeof list !== 'function') {
    position = -1;
    for (i = list.length - 1; i >= 0; i--) {
      if (list[i] === listener || list[i].listener === listener) {
        originalListener = list[i].listener;
        position = i;
        break;
      }
    }
    if (position < 0) return this;
    if (position === 0) list.shift();else {
      spliceOne(list, position);
    }
    if (list.length === 1) events[type] = list[0];
    if (events.removeListener !== undefined) this.emit('removeListener', type, originalListener || listener);
  }
  return this;
};
EventEmitter.prototype.off = EventEmitter.prototype.removeListener;
EventEmitter.prototype.removeAllListeners = function removeAllListeners(type) {
  var listeners, events, i;
  events = this._events;
  if (events === undefined) return this;

  // not listening for removeListener, no need to emit
  if (events.removeListener === undefined) {
    if (arguments.length === 0) {
      this._events = Object.create(null);
      this._eventsCount = 0;
    } else if (events[type] !== undefined) {
      if (--this._eventsCount === 0) this._events = Object.create(null);else delete events[type];
    }
    return this;
  }

  // emit removeListener for all listeners on all events
  if (arguments.length === 0) {
    var keys = Object.keys(events);
    var key;
    for (i = 0; i < keys.length; ++i) {
      key = keys[i];
      if (key === 'removeListener') continue;
      this.removeAllListeners(key);
    }
    this.removeAllListeners('removeListener');
    this._events = Object.create(null);
    this._eventsCount = 0;
    return this;
  }
  listeners = events[type];
  if (typeof listeners === 'function') {
    this.removeListener(type, listeners);
  } else if (listeners !== undefined) {
    // LIFO order
    for (i = listeners.length - 1; i >= 0; i--) {
      this.removeListener(type, listeners[i]);
    }
  }
  return this;
};
function _listeners(target, type, unwrap) {
  var events = target._events;
  if (events === undefined) return [];
  var evlistener = events[type];
  if (evlistener === undefined) return [];
  if (typeof evlistener === 'function') return unwrap ? [evlistener.listener || evlistener] : [evlistener];
  return unwrap ? unwrapListeners(evlistener) : arrayClone(evlistener, evlistener.length);
}
EventEmitter.prototype.listeners = function listeners(type) {
  return _listeners(this, type, true);
};
EventEmitter.prototype.rawListeners = function rawListeners(type) {
  return _listeners(this, type, false);
};
EventEmitter.listenerCount = function (emitter, type) {
  if (typeof emitter.listenerCount === 'function') {
    return emitter.listenerCount(type);
  } else {
    return listenerCount.call(emitter, type);
  }
};
EventEmitter.prototype.listenerCount = listenerCount;
function listenerCount(type) {
  var events = this._events;
  if (events !== undefined) {
    var evlistener = events[type];
    if (typeof evlistener === 'function') {
      return 1;
    } else if (evlistener !== undefined) {
      return evlistener.length;
    }
  }
  return 0;
}
EventEmitter.prototype.eventNames = function eventNames() {
  return this._eventsCount > 0 ? ReflectOwnKeys(this._events) : [];
};
function arrayClone(arr, n) {
  var copy = new Array(n);
  for (var i = 0; i < n; ++i) copy[i] = arr[i];
  return copy;
}
function spliceOne(list, index) {
  for (; index + 1 < list.length; index++) list[index] = list[index + 1];
  list.pop();
}
function unwrapListeners(arr) {
  var ret = new Array(arr.length);
  for (var i = 0; i < ret.length; ++i) {
    ret[i] = arr[i].listener || arr[i];
  }
  return ret;
}
function once(emitter, name) {
  return new Promise(function (resolve, reject) {
    function errorListener(err) {
      emitter.removeListener(name, resolver);
      reject(err);
    }
    function resolver() {
      if (typeof emitter.removeListener === 'function') {
        emitter.removeListener('error', errorListener);
      }
      resolve([].slice.call(arguments));
    }
    ;
    eventTargetAgnosticAddListener(emitter, name, resolver, {
      once: true
    });
    if (name !== 'error') {
      addErrorHandlerIfEventEmitter(emitter, errorListener, {
        once: true
      });
    }
  });
}
function addErrorHandlerIfEventEmitter(emitter, handler, flags) {
  if (typeof emitter.on === 'function') {
    eventTargetAgnosticAddListener(emitter, 'error', handler, flags);
  }
}
function eventTargetAgnosticAddListener(emitter, name, listener, flags) {
  if (typeof emitter.on === 'function') {
    if (flags.once) {
      emitter.once(name, listener);
    } else {
      emitter.on(name, listener);
    }
  } else if (typeof emitter.addEventListener === 'function') {
    // EventTarget does not have `error` event semantics like Node
    // EventEmitters, we do not listen for `error` events here.
    emitter.addEventListener(name, function wrapListener(arg) {
      // IE does not have builtin `{ once: true }` support so we
      // have to do it manually.
      if (flags.once) {
        emitter.removeEventListener(name, wrapListener);
      }
      listener(arg);
    });
  } else {
    throw new TypeError('The "emitter" argument must be of type EventEmitter. Received type ' + _typeof(emitter));
  }
}

/***/ }),

/***/ 7193:
/***/ ((module) => {

"use strict";


/* eslint no-invalid-this: 1 */
var ERROR_MESSAGE = 'Function.prototype.bind called on incompatible ';
var toStr = Object.prototype.toString;
var max = Math.max;
var funcType = '[object Function]';
var concatty = function concatty(a, b) {
  var arr = [];
  for (var i = 0; i < a.length; i += 1) {
    arr[i] = a[i];
  }
  for (var j = 0; j < b.length; j += 1) {
    arr[j + a.length] = b[j];
  }
  return arr;
};
var slicy = function slicy(arrLike, offset) {
  var arr = [];
  for (var i = offset || 0, j = 0; i < arrLike.length; i += 1, j += 1) {
    arr[j] = arrLike[i];
  }
  return arr;
};
var joiny = function joiny(arr, joiner) {
  var str = '';
  for (var i = 0; i < arr.length; i += 1) {
    str += arr[i];
    if (i + 1 < arr.length) {
      str += joiner;
    }
  }
  return str;
};
module.exports = function bind(that) {
  var target = this;
  if (typeof target !== 'function' || toStr.apply(target) !== funcType) {
    throw new TypeError(ERROR_MESSAGE + target);
  }
  var args = slicy(arguments, 1);
  var bound;
  var binder = function binder() {
    if (this instanceof bound) {
      var result = target.apply(this, concatty(args, arguments));
      if (Object(result) === result) {
        return result;
      }
      return this;
    }
    return target.apply(that, concatty(args, arguments));
  };
  var boundLength = max(0, target.length - args.length);
  var boundArgs = [];
  for (var i = 0; i < boundLength; i++) {
    boundArgs[i] = '$' + i;
  }
  bound = Function('binder', 'return function (' + joiny(boundArgs, ',') + '){ return binder.apply(this,arguments); }')(binder);
  if (target.prototype) {
    var Empty = function Empty() {};
    Empty.prototype = target.prototype;
    bound.prototype = new Empty();
    Empty.prototype = null;
  }
  return bound;
};

/***/ }),

/***/ 4597:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var implementation = __webpack_require__(7193);
module.exports = Function.prototype.bind || implementation;

/***/ }),

/***/ 3584:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
var undefined;
var $SyntaxError = SyntaxError;
var $Function = Function;
var $TypeError = TypeError;

// eslint-disable-next-line consistent-return
var getEvalledConstructor = function getEvalledConstructor(expressionSyntax) {
  try {
    return $Function('"use strict"; return (' + expressionSyntax + ').constructor;')();
  } catch (e) {}
};
var $gOPD = Object.getOwnPropertyDescriptor;
if ($gOPD) {
  try {
    $gOPD({}, '');
  } catch (e) {
    $gOPD = null; // this is IE 8, which has a broken gOPD
  }
}

var throwTypeError = function throwTypeError() {
  throw new $TypeError();
};
var ThrowTypeError = $gOPD ? function () {
  try {
    // eslint-disable-next-line no-unused-expressions, no-caller, no-restricted-properties
    arguments.callee; // IE 8 does not throw here
    return throwTypeError;
  } catch (calleeThrows) {
    try {
      // IE 8 throws on Object.getOwnPropertyDescriptor(arguments, '')
      return $gOPD(arguments, 'callee').get;
    } catch (gOPDthrows) {
      return throwTypeError;
    }
  }
}() : throwTypeError;
var hasSymbols = __webpack_require__(563)();
var hasProto = __webpack_require__(7365)();
var getProto = Object.getPrototypeOf || (hasProto ? function (x) {
  return x.__proto__;
} // eslint-disable-line no-proto
: null);
var needsEval = {};
var TypedArray = typeof Uint8Array === 'undefined' || !getProto ? undefined : getProto(Uint8Array);
var INTRINSICS = {
  '%AggregateError%': typeof AggregateError === 'undefined' ? undefined : AggregateError,
  '%Array%': Array,
  '%ArrayBuffer%': typeof ArrayBuffer === 'undefined' ? undefined : ArrayBuffer,
  '%ArrayIteratorPrototype%': hasSymbols && getProto ? getProto([][Symbol.iterator]()) : undefined,
  '%AsyncFromSyncIteratorPrototype%': undefined,
  '%AsyncFunction%': needsEval,
  '%AsyncGenerator%': needsEval,
  '%AsyncGeneratorFunction%': needsEval,
  '%AsyncIteratorPrototype%': needsEval,
  '%Atomics%': typeof Atomics === 'undefined' ? undefined : Atomics,
  '%BigInt%': typeof BigInt === 'undefined' ? undefined : BigInt,
  '%BigInt64Array%': typeof BigInt64Array === 'undefined' ? undefined : BigInt64Array,
  '%BigUint64Array%': typeof BigUint64Array === 'undefined' ? undefined : BigUint64Array,
  '%Boolean%': Boolean,
  '%DataView%': typeof DataView === 'undefined' ? undefined : DataView,
  '%Date%': Date,
  '%decodeURI%': decodeURI,
  '%decodeURIComponent%': decodeURIComponent,
  '%encodeURI%': encodeURI,
  '%encodeURIComponent%': encodeURIComponent,
  '%Error%': Error,
  '%eval%': eval,
  // eslint-disable-line no-eval
  '%EvalError%': EvalError,
  '%Float32Array%': typeof Float32Array === 'undefined' ? undefined : Float32Array,
  '%Float64Array%': typeof Float64Array === 'undefined' ? undefined : Float64Array,
  '%FinalizationRegistry%': typeof FinalizationRegistry === 'undefined' ? undefined : FinalizationRegistry,
  '%Function%': $Function,
  '%GeneratorFunction%': needsEval,
  '%Int8Array%': typeof Int8Array === 'undefined' ? undefined : Int8Array,
  '%Int16Array%': typeof Int16Array === 'undefined' ? undefined : Int16Array,
  '%Int32Array%': typeof Int32Array === 'undefined' ? undefined : Int32Array,
  '%isFinite%': isFinite,
  '%isNaN%': isNaN,
  '%IteratorPrototype%': hasSymbols && getProto ? getProto(getProto([][Symbol.iterator]())) : undefined,
  '%JSON%': (typeof JSON === "undefined" ? "undefined" : _typeof(JSON)) === 'object' ? JSON : undefined,
  '%Map%': typeof Map === 'undefined' ? undefined : Map,
  '%MapIteratorPrototype%': typeof Map === 'undefined' || !hasSymbols || !getProto ? undefined : getProto(new Map()[Symbol.iterator]()),
  '%Math%': Math,
  '%Number%': Number,
  '%Object%': Object,
  '%parseFloat%': parseFloat,
  '%parseInt%': parseInt,
  '%Promise%': typeof Promise === 'undefined' ? undefined : Promise,
  '%Proxy%': typeof Proxy === 'undefined' ? undefined : Proxy,
  '%RangeError%': RangeError,
  '%ReferenceError%': ReferenceError,
  '%Reflect%': typeof Reflect === 'undefined' ? undefined : Reflect,
  '%RegExp%': RegExp,
  '%Set%': typeof Set === 'undefined' ? undefined : Set,
  '%SetIteratorPrototype%': typeof Set === 'undefined' || !hasSymbols || !getProto ? undefined : getProto(new Set()[Symbol.iterator]()),
  '%SharedArrayBuffer%': typeof SharedArrayBuffer === 'undefined' ? undefined : SharedArrayBuffer,
  '%String%': String,
  '%StringIteratorPrototype%': hasSymbols && getProto ? getProto(''[Symbol.iterator]()) : undefined,
  '%Symbol%': hasSymbols ? Symbol : undefined,
  '%SyntaxError%': $SyntaxError,
  '%ThrowTypeError%': ThrowTypeError,
  '%TypedArray%': TypedArray,
  '%TypeError%': $TypeError,
  '%Uint8Array%': typeof Uint8Array === 'undefined' ? undefined : Uint8Array,
  '%Uint8ClampedArray%': typeof Uint8ClampedArray === 'undefined' ? undefined : Uint8ClampedArray,
  '%Uint16Array%': typeof Uint16Array === 'undefined' ? undefined : Uint16Array,
  '%Uint32Array%': typeof Uint32Array === 'undefined' ? undefined : Uint32Array,
  '%URIError%': URIError,
  '%WeakMap%': typeof WeakMap === 'undefined' ? undefined : WeakMap,
  '%WeakRef%': typeof WeakRef === 'undefined' ? undefined : WeakRef,
  '%WeakSet%': typeof WeakSet === 'undefined' ? undefined : WeakSet
};
if (getProto) {
  try {
    null.error; // eslint-disable-line no-unused-expressions
  } catch (e) {
    // https://github.com/tc39/proposal-shadowrealm/pull/384#issuecomment-1364264229
    var errorProto = getProto(getProto(e));
    INTRINSICS['%Error.prototype%'] = errorProto;
  }
}
var doEval = function doEval(name) {
  var value;
  if (name === '%AsyncFunction%') {
    value = getEvalledConstructor('async function () {}');
  } else if (name === '%GeneratorFunction%') {
    value = getEvalledConstructor('function* () {}');
  } else if (name === '%AsyncGeneratorFunction%') {
    value = getEvalledConstructor('async function* () {}');
  } else if (name === '%AsyncGenerator%') {
    var fn = doEval('%AsyncGeneratorFunction%');
    if (fn) {
      value = fn.prototype;
    }
  } else if (name === '%AsyncIteratorPrototype%') {
    var gen = doEval('%AsyncGenerator%');
    if (gen && getProto) {
      value = getProto(gen.prototype);
    }
  }
  INTRINSICS[name] = value;
  return value;
};
var LEGACY_ALIASES = {
  '%ArrayBufferPrototype%': ['ArrayBuffer', 'prototype'],
  '%ArrayPrototype%': ['Array', 'prototype'],
  '%ArrayProto_entries%': ['Array', 'prototype', 'entries'],
  '%ArrayProto_forEach%': ['Array', 'prototype', 'forEach'],
  '%ArrayProto_keys%': ['Array', 'prototype', 'keys'],
  '%ArrayProto_values%': ['Array', 'prototype', 'values'],
  '%AsyncFunctionPrototype%': ['AsyncFunction', 'prototype'],
  '%AsyncGenerator%': ['AsyncGeneratorFunction', 'prototype'],
  '%AsyncGeneratorPrototype%': ['AsyncGeneratorFunction', 'prototype', 'prototype'],
  '%BooleanPrototype%': ['Boolean', 'prototype'],
  '%DataViewPrototype%': ['DataView', 'prototype'],
  '%DatePrototype%': ['Date', 'prototype'],
  '%ErrorPrototype%': ['Error', 'prototype'],
  '%EvalErrorPrototype%': ['EvalError', 'prototype'],
  '%Float32ArrayPrototype%': ['Float32Array', 'prototype'],
  '%Float64ArrayPrototype%': ['Float64Array', 'prototype'],
  '%FunctionPrototype%': ['Function', 'prototype'],
  '%Generator%': ['GeneratorFunction', 'prototype'],
  '%GeneratorPrototype%': ['GeneratorFunction', 'prototype', 'prototype'],
  '%Int8ArrayPrototype%': ['Int8Array', 'prototype'],
  '%Int16ArrayPrototype%': ['Int16Array', 'prototype'],
  '%Int32ArrayPrototype%': ['Int32Array', 'prototype'],
  '%JSONParse%': ['JSON', 'parse'],
  '%JSONStringify%': ['JSON', 'stringify'],
  '%MapPrototype%': ['Map', 'prototype'],
  '%NumberPrototype%': ['Number', 'prototype'],
  '%ObjectPrototype%': ['Object', 'prototype'],
  '%ObjProto_toString%': ['Object', 'prototype', 'toString'],
  '%ObjProto_valueOf%': ['Object', 'prototype', 'valueOf'],
  '%PromisePrototype%': ['Promise', 'prototype'],
  '%PromiseProto_then%': ['Promise', 'prototype', 'then'],
  '%Promise_all%': ['Promise', 'all'],
  '%Promise_reject%': ['Promise', 'reject'],
  '%Promise_resolve%': ['Promise', 'resolve'],
  '%RangeErrorPrototype%': ['RangeError', 'prototype'],
  '%ReferenceErrorPrototype%': ['ReferenceError', 'prototype'],
  '%RegExpPrototype%': ['RegExp', 'prototype'],
  '%SetPrototype%': ['Set', 'prototype'],
  '%SharedArrayBufferPrototype%': ['SharedArrayBuffer', 'prototype'],
  '%StringPrototype%': ['String', 'prototype'],
  '%SymbolPrototype%': ['Symbol', 'prototype'],
  '%SyntaxErrorPrototype%': ['SyntaxError', 'prototype'],
  '%TypedArrayPrototype%': ['TypedArray', 'prototype'],
  '%TypeErrorPrototype%': ['TypeError', 'prototype'],
  '%Uint8ArrayPrototype%': ['Uint8Array', 'prototype'],
  '%Uint8ClampedArrayPrototype%': ['Uint8ClampedArray', 'prototype'],
  '%Uint16ArrayPrototype%': ['Uint16Array', 'prototype'],
  '%Uint32ArrayPrototype%': ['Uint32Array', 'prototype'],
  '%URIErrorPrototype%': ['URIError', 'prototype'],
  '%WeakMapPrototype%': ['WeakMap', 'prototype'],
  '%WeakSetPrototype%': ['WeakSet', 'prototype']
};
var bind = __webpack_require__(4597);
var hasOwn = __webpack_require__(4057);
var $concat = bind.call(Function.call, Array.prototype.concat);
var $spliceApply = bind.call(Function.apply, Array.prototype.splice);
var $replace = bind.call(Function.call, String.prototype.replace);
var $strSlice = bind.call(Function.call, String.prototype.slice);
var $exec = bind.call(Function.call, RegExp.prototype.exec);

/* adapted from https://github.com/lodash/lodash/blob/4.17.15/dist/lodash.js#L6735-L6744 */
var rePropName = /[^%.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|%$))/g;
var reEscapeChar = /\\(\\)?/g; /** Used to match backslashes in property paths. */
var stringToPath = function stringToPath(string) {
  var first = $strSlice(string, 0, 1);
  var last = $strSlice(string, -1);
  if (first === '%' && last !== '%') {
    throw new $SyntaxError('invalid intrinsic syntax, expected closing `%`');
  } else if (last === '%' && first !== '%') {
    throw new $SyntaxError('invalid intrinsic syntax, expected opening `%`');
  }
  var result = [];
  $replace(string, rePropName, function (match, number, quote, subString) {
    result[result.length] = quote ? $replace(subString, reEscapeChar, '$1') : number || match;
  });
  return result;
};
/* end adaptation */

var getBaseIntrinsic = function getBaseIntrinsic(name, allowMissing) {
  var intrinsicName = name;
  var alias;
  if (hasOwn(LEGACY_ALIASES, intrinsicName)) {
    alias = LEGACY_ALIASES[intrinsicName];
    intrinsicName = '%' + alias[0] + '%';
  }
  if (hasOwn(INTRINSICS, intrinsicName)) {
    var value = INTRINSICS[intrinsicName];
    if (value === needsEval) {
      value = doEval(intrinsicName);
    }
    if (typeof value === 'undefined' && !allowMissing) {
      throw new $TypeError('intrinsic ' + name + ' exists, but is not available. Please file an issue!');
    }
    return {
      alias: alias,
      name: intrinsicName,
      value: value
    };
  }
  throw new $SyntaxError('intrinsic ' + name + ' does not exist!');
};
module.exports = function GetIntrinsic(name, allowMissing) {
  if (typeof name !== 'string' || name.length === 0) {
    throw new $TypeError('intrinsic name must be a non-empty string');
  }
  if (arguments.length > 1 && typeof allowMissing !== 'boolean') {
    throw new $TypeError('"allowMissing" argument must be a boolean');
  }
  if ($exec(/^%?[^%]*%?$/, name) === null) {
    throw new $SyntaxError('`%` may not be present anywhere but at the beginning and end of the intrinsic name');
  }
  var parts = stringToPath(name);
  var intrinsicBaseName = parts.length > 0 ? parts[0] : '';
  var intrinsic = getBaseIntrinsic('%' + intrinsicBaseName + '%', allowMissing);
  var intrinsicRealName = intrinsic.name;
  var value = intrinsic.value;
  var skipFurtherCaching = false;
  var alias = intrinsic.alias;
  if (alias) {
    intrinsicBaseName = alias[0];
    $spliceApply(parts, $concat([0, 1], alias));
  }
  for (var i = 1, isOwn = true; i < parts.length; i += 1) {
    var part = parts[i];
    var first = $strSlice(part, 0, 1);
    var last = $strSlice(part, -1);
    if ((first === '"' || first === "'" || first === '`' || last === '"' || last === "'" || last === '`') && first !== last) {
      throw new $SyntaxError('property names with quotes must have matching quotes');
    }
    if (part === 'constructor' || !isOwn) {
      skipFurtherCaching = true;
    }
    intrinsicBaseName += '.' + part;
    intrinsicRealName = '%' + intrinsicBaseName + '%';
    if (hasOwn(INTRINSICS, intrinsicRealName)) {
      value = INTRINSICS[intrinsicRealName];
    } else if (value != null) {
      if (!(part in value)) {
        if (!allowMissing) {
          throw new $TypeError('base intrinsic for ' + name + ' exists, but the property is not available.');
        }
        return void undefined;
      }
      if ($gOPD && i + 1 >= parts.length) {
        var desc = $gOPD(value, part);
        isOwn = !!desc;

        // By convention, when a data property is converted to an accessor
        // property to emulate a data property that does not suffer from
        // the override mistake, that accessor's getter is marked with
        // an `originalValue` property. Here, when we detect this, we
        // uphold the illusion by pretending to see that original data
        // property, i.e., returning the value rather than the getter
        // itself.
        if (isOwn && 'get' in desc && !('originalValue' in desc.get)) {
          value = desc.get;
        } else {
          value = value[part];
        }
      } else {
        isOwn = hasOwn(value, part);
        value = value[part];
      }
      if (isOwn && !skipFurtherCaching) {
        INTRINSICS[intrinsicRealName] = value;
      }
    }
  }
  return value;
};

/***/ }),

/***/ 1700:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var GetIntrinsic = __webpack_require__(3584);
var $gOPD = GetIntrinsic('%Object.getOwnPropertyDescriptor%', true);
if ($gOPD) {
  try {
    $gOPD([], 'length');
  } catch (e) {
    // IE 8 has a broken gOPD
    $gOPD = null;
  }
}
module.exports = $gOPD;

/***/ }),

/***/ 1780:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

var ClientRequest = __webpack_require__(5114);
var response = __webpack_require__(5228);
var extend = __webpack_require__(2786);
var statusCodes = __webpack_require__(1403);
var url = __webpack_require__(3149);
var http = exports;
http.request = function (opts, cb) {
  if (typeof opts === "string") opts = url.parse(opts);else opts = extend(opts);

  // Normally, the page is loaded from http or https, so not specifying a protocol
  // will result in a (valid) protocol-relative url. However, this won't work if
  // the protocol is something else, like 'file:'
  var defaultProtocol = __webpack_require__.g.location.protocol.search(/^https?:$/) === -1 ? "http:" : "";
  var protocol = opts.protocol || defaultProtocol;
  var host = opts.hostname || opts.host;
  var port = opts.port;
  var path = opts.path || "/";

  // Necessary for IPv6 addresses
  if (host && host.indexOf(":") !== -1) host = "[" + host + "]";

  // This may be a relative url. The browser should always be able to interpret it correctly.
  opts.url = (host ? protocol + "//" + host : "") + (port ? ":" + port : "") + path;
  opts.method = (opts.method || "GET").toUpperCase();
  opts.headers = opts.headers || {};

  // Also valid opts.auth, opts.mode

  var req = new ClientRequest(opts);
  if (cb) req.on("response", cb);
  return req;
};
http.get = function get(opts, cb) {
  var req = http.request(opts, cb);
  req.end();
  return req;
};
http.ClientRequest = ClientRequest;
http.IncomingMessage = response.IncomingMessage;
http.Agent = function () {};
http.Agent.defaultMaxSockets = 4;
http.globalAgent = new http.Agent();
http.STATUS_CODES = statusCodes;
http.METHODS = ["CHECKOUT", "CONNECT", "COPY", "DELETE", "GET", "HEAD", "LOCK", "M-SEARCH", "MERGE", "MKACTIVITY", "MKCOL", "MOVE", "NOTIFY", "OPTIONS", "PATCH", "POST", "PROPFIND", "PROPPATCH", "PURGE", "PUT", "REPORT", "SEARCH", "SUBSCRIBE", "TRACE", "UNLOCK", "UNSUBSCRIBE"];

/***/ }),

/***/ 7494:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

exports.fetch = isFunction(__webpack_require__.g.fetch) && isFunction(__webpack_require__.g.ReadableStream);
exports.writableStream = isFunction(__webpack_require__.g.WritableStream);
exports.abortController = isFunction(__webpack_require__.g.AbortController);

// The xhr request to example.com may violate some restrictive CSP configurations,
// so if we're running in a browser that supports `fetch`, avoid calling getXHR()
// and assume support for certain features below.
var xhr;
function getXHR() {
  // Cache the xhr value
  if (xhr !== undefined) return xhr;
  if (__webpack_require__.g.XMLHttpRequest) {
    xhr = new __webpack_require__.g.XMLHttpRequest();
    // If XDomainRequest is available (ie only, where xhr might not work
    // cross domain), use the page location. Otherwise use example.com
    // Note: this doesn't actually make an http request.
    try {
      xhr.open("GET", __webpack_require__.g.XDomainRequest ? "/" : "https://example.com");
    } catch (e) {
      xhr = null;
    }
  } else {
    // Service workers don't have XHR
    xhr = null;
  }
  return xhr;
}
function checkTypeSupport(type) {
  var xhr = getXHR();
  if (!xhr) return false;
  try {
    xhr.responseType = type;
    return xhr.responseType === type;
  } catch (e) {}
  return false;
}

// If fetch is supported, then arraybuffer will be supported too. Skip calling
// checkTypeSupport(), since that calls getXHR().
exports.arraybuffer = exports.fetch || checkTypeSupport("arraybuffer");

// These next two tests unavoidably show warnings in Chrome. Since fetch will always
// be used if it's available, just return false for these to avoid the warnings.
exports.msstream = !exports.fetch && checkTypeSupport("ms-stream");
exports.mozchunkedarraybuffer = !exports.fetch && checkTypeSupport("moz-chunked-arraybuffer");

// If fetch is supported, then overrideMimeType will be supported too. Skip calling
// getXHR().
exports.overrideMimeType = exports.fetch || (getXHR() ? isFunction(getXHR().overrideMimeType) : false);
function isFunction(value) {
  return typeof value === "function";
}
xhr = null; // Help gc

/***/ }),

/***/ 5114:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

/* provided dependency */ var Buffer = __webpack_require__(5851)["Buffer"];
/* provided dependency */ var process = __webpack_require__(2790);
var capability = __webpack_require__(7494);
var inherits = __webpack_require__(5153);
var response = __webpack_require__(5228);
var stream = __webpack_require__(9970);
var IncomingMessage = response.IncomingMessage;
var rStates = response.readyStates;
function decideMode(preferBinary, useFetch) {
  if (capability.fetch && useFetch) {
    return "fetch";
  } else if (capability.mozchunkedarraybuffer) {
    return "moz-chunked-arraybuffer";
  } else if (capability.msstream) {
    return "ms-stream";
  } else if (capability.arraybuffer && preferBinary) {
    return "arraybuffer";
  } else {
    return "text";
  }
}
var ClientRequest = module.exports = function (opts) {
  var self = this;
  stream.Writable.call(self);
  self._opts = opts;
  self._body = [];
  self._headers = {};
  if (opts.auth) self.setHeader("Authorization", "Basic " + Buffer.from(opts.auth).toString("base64"));
  Object.keys(opts.headers).forEach(function (name) {
    self.setHeader(name, opts.headers[name]);
  });
  var preferBinary;
  var useFetch = true;
  if (opts.mode === "disable-fetch" || "requestTimeout" in opts && !capability.abortController) {
    // If the use of XHR should be preferred. Not typically needed.
    useFetch = false;
    preferBinary = true;
  } else if (opts.mode === "prefer-streaming") {
    // If streaming is a high priority but binary compatibility and
    // the accuracy of the 'content-type' header aren't
    preferBinary = false;
  } else if (opts.mode === "allow-wrong-content-type") {
    // If streaming is more important than preserving the 'content-type' header
    preferBinary = !capability.overrideMimeType;
  } else if (!opts.mode || opts.mode === "default" || opts.mode === "prefer-fast") {
    // Use binary if text streaming may corrupt data or the content-type header, or for speed
    preferBinary = true;
  } else {
    throw new Error("Invalid value for opts.mode");
  }
  self._mode = decideMode(preferBinary, useFetch);
  self._fetchTimer = null;
  self._socketTimeout = null;
  self._socketTimer = null;
  self.on("finish", function () {
    self._onFinish();
  });
};
inherits(ClientRequest, stream.Writable);
ClientRequest.prototype.setHeader = function (name, value) {
  var self = this;
  var lowerName = name.toLowerCase();
  // This check is not necessary, but it prevents warnings from browsers about setting unsafe
  // headers. To be honest I'm not entirely sure hiding these warnings is a good thing, but
  // http-browserify did it, so I will too.
  if (unsafeHeaders.indexOf(lowerName) !== -1) return;
  self._headers[lowerName] = {
    name: name,
    value: value
  };
};
ClientRequest.prototype.getHeader = function (name) {
  var header = this._headers[name.toLowerCase()];
  if (header) return header.value;
  return null;
};
ClientRequest.prototype.removeHeader = function (name) {
  var self = this;
  delete self._headers[name.toLowerCase()];
};
ClientRequest.prototype._onFinish = function () {
  var self = this;
  if (self._destroyed) return;
  var opts = self._opts;
  if ("timeout" in opts && opts.timeout !== 0) {
    self.setTimeout(opts.timeout);
  }
  var headersObj = self._headers;
  var body = null;
  if (opts.method !== "GET" && opts.method !== "HEAD") {
    body = new Blob(self._body, {
      type: (headersObj["content-type"] || {}).value || ""
    });
  }

  // create flattened list of headers
  var headersList = [];
  Object.keys(headersObj).forEach(function (keyName) {
    var name = headersObj[keyName].name;
    var value = headersObj[keyName].value;
    if (Array.isArray(value)) {
      value.forEach(function (v) {
        headersList.push([name, v]);
      });
    } else {
      headersList.push([name, value]);
    }
  });
  if (self._mode === "fetch") {
    var signal = null;
    if (capability.abortController) {
      var controller = new AbortController();
      signal = controller.signal;
      self._fetchAbortController = controller;
      if ("requestTimeout" in opts && opts.requestTimeout !== 0) {
        self._fetchTimer = __webpack_require__.g.setTimeout(function () {
          self.emit("requestTimeout");
          if (self._fetchAbortController) self._fetchAbortController.abort();
        }, opts.requestTimeout);
      }
    }
    __webpack_require__.g.fetch(self._opts.url, {
      method: self._opts.method,
      headers: headersList,
      body: body || undefined,
      mode: "cors",
      credentials: opts.withCredentials ? "include" : "same-origin",
      signal: signal
    }).then(function (response) {
      self._fetchResponse = response;
      self._resetTimers(false);
      self._connect();
    }, function (reason) {
      self._resetTimers(true);
      if (!self._destroyed) self.emit("error", reason);
    });
  } else {
    var xhr = self._xhr = new __webpack_require__.g.XMLHttpRequest();
    try {
      xhr.open(self._opts.method, self._opts.url, true);
    } catch (err) {
      process.nextTick(function () {
        self.emit("error", err);
      });
      return;
    }

    // Can't set responseType on really old browsers
    if ("responseType" in xhr) xhr.responseType = self._mode;
    if ("withCredentials" in xhr) xhr.withCredentials = !!opts.withCredentials;
    if (self._mode === "text" && "overrideMimeType" in xhr) xhr.overrideMimeType("text/plain; charset=x-user-defined");
    if ("requestTimeout" in opts) {
      xhr.timeout = opts.requestTimeout;
      xhr.ontimeout = function () {
        self.emit("requestTimeout");
      };
    }
    headersList.forEach(function (header) {
      xhr.setRequestHeader(header[0], header[1]);
    });
    self._response = null;
    xhr.onreadystatechange = function () {
      switch (xhr.readyState) {
        case rStates.LOADING:
        case rStates.DONE:
          self._onXHRProgress();
          break;
      }
    };
    // Necessary for streaming in Firefox, since xhr.response is ONLY defined
    // in onprogress, not in onreadystatechange with xhr.readyState = 3
    if (self._mode === "moz-chunked-arraybuffer") {
      xhr.onprogress = function () {
        self._onXHRProgress();
      };
    }
    xhr.onerror = function () {
      if (self._destroyed) return;
      self._resetTimers(true);
      self.emit("error", new Error("XHR error"));
    };
    try {
      xhr.send(body);
    } catch (err) {
      process.nextTick(function () {
        self.emit("error", err);
      });
      return;
    }
  }
};

/**
 * Checks if xhr.status is readable and non-zero, indicating no error.
 * Even though the spec says it should be available in readyState 3,
 * accessing it throws an exception in IE8
 */
function statusValid(xhr) {
  try {
    var status = xhr.status;
    return status !== null && status !== 0;
  } catch (e) {
    return false;
  }
}
ClientRequest.prototype._onXHRProgress = function () {
  var self = this;
  self._resetTimers(false);
  if (!statusValid(self._xhr) || self._destroyed) return;
  if (!self._response) self._connect();
  self._response._onXHRProgress(self._resetTimers.bind(self));
};
ClientRequest.prototype._connect = function () {
  var self = this;
  if (self._destroyed) return;
  self._response = new IncomingMessage(self._xhr, self._fetchResponse, self._mode, self._resetTimers.bind(self));
  self._response.on("error", function (err) {
    self.emit("error", err);
  });
  self.emit("response", self._response);
};
ClientRequest.prototype._write = function (chunk, encoding, cb) {
  var self = this;
  self._body.push(chunk);
  cb();
};
ClientRequest.prototype._resetTimers = function (done) {
  var self = this;
  __webpack_require__.g.clearTimeout(self._socketTimer);
  self._socketTimer = null;
  if (done) {
    __webpack_require__.g.clearTimeout(self._fetchTimer);
    self._fetchTimer = null;
  } else if (self._socketTimeout) {
    self._socketTimer = __webpack_require__.g.setTimeout(function () {
      self.emit("timeout");
    }, self._socketTimeout);
  }
};
ClientRequest.prototype.abort = ClientRequest.prototype.destroy = function (err) {
  var self = this;
  self._destroyed = true;
  self._resetTimers(true);
  if (self._response) self._response._destroyed = true;
  if (self._xhr) self._xhr.abort();else if (self._fetchAbortController) self._fetchAbortController.abort();
  if (err) self.emit("error", err);
};
ClientRequest.prototype.end = function (data, encoding, cb) {
  var self = this;
  if (typeof data === "function") {
    cb = data;
    data = undefined;
  }
  stream.Writable.prototype.end.call(self, data, encoding, cb);
};
ClientRequest.prototype.setTimeout = function (timeout, cb) {
  var self = this;
  if (cb) self.once("timeout", cb);
  self._socketTimeout = timeout;
  self._resetTimers(false);
};
ClientRequest.prototype.flushHeaders = function () {};
ClientRequest.prototype.setNoDelay = function () {};
ClientRequest.prototype.setSocketKeepAlive = function () {};

// Taken from http://www.w3.org/TR/XMLHttpRequest/#the-setrequestheader%28%29-method
var unsafeHeaders = ["accept-charset", "accept-encoding", "access-control-request-headers", "access-control-request-method", "connection", "content-length", "cookie", "cookie2", "date", "dnt", "expect", "host", "keep-alive", "origin", "referer", "te", "trailer", "transfer-encoding", "upgrade", "via"];

/***/ }),

/***/ 5228:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

/* provided dependency */ var process = __webpack_require__(2790);
/* provided dependency */ var Buffer = __webpack_require__(5851)["Buffer"];
var capability = __webpack_require__(7494);
var inherits = __webpack_require__(5153);
var stream = __webpack_require__(9970);
var rStates = exports.readyStates = {
  UNSENT: 0,
  OPENED: 1,
  HEADERS_RECEIVED: 2,
  LOADING: 3,
  DONE: 4
};
var IncomingMessage = exports.IncomingMessage = function (xhr, response, mode, resetTimers) {
  var self = this;
  stream.Readable.call(self);
  self._mode = mode;
  self.headers = {};
  self.rawHeaders = [];
  self.trailers = {};
  self.rawTrailers = [];

  // Fake the 'close' event, but only once 'end' fires
  self.on("end", function () {
    // The nextTick is necessary to prevent the 'request' module from causing an infinite loop
    process.nextTick(function () {
      self.emit("close");
    });
  });
  if (mode === "fetch") {
    var read = function read() {
      reader.read().then(function (result) {
        if (self._destroyed) return;
        resetTimers(result.done);
        if (result.done) {
          self.push(null);
          return;
        }
        self.push(Buffer.from(result.value));
        read();
      })["catch"](function (err) {
        resetTimers(true);
        if (!self._destroyed) self.emit("error", err);
      });
    };
    self._fetchResponse = response;
    self.url = response.url;
    self.statusCode = response.status;
    self.statusMessage = response.statusText;
    response.headers.forEach(function (header, key) {
      self.headers[key.toLowerCase()] = header;
      self.rawHeaders.push(key, header);
    });
    if (capability.writableStream) {
      var writable = new WritableStream({
        write: function write(chunk) {
          resetTimers(false);
          return new Promise(function (resolve, reject) {
            if (self._destroyed) {
              reject();
            } else if (self.push(Buffer.from(chunk))) {
              resolve();
            } else {
              self._resumeFetch = resolve;
            }
          });
        },
        close: function close() {
          resetTimers(true);
          if (!self._destroyed) self.push(null);
        },
        abort: function abort(err) {
          resetTimers(true);
          if (!self._destroyed) self.emit("error", err);
        }
      });
      try {
        response.body.pipeTo(writable)["catch"](function (err) {
          resetTimers(true);
          if (!self._destroyed) self.emit("error", err);
        });
        return;
      } catch (e) {} // pipeTo method isn't defined. Can't find a better way to feature test this
    }
    // fallback for when writableStream or pipeTo aren't available
    var reader = response.body.getReader();
    read();
  } else {
    self._xhr = xhr;
    self._pos = 0;
    self.url = xhr.responseURL;
    self.statusCode = xhr.status;
    self.statusMessage = xhr.statusText;
    var headers = xhr.getAllResponseHeaders().split(/\r?\n/);
    headers.forEach(function (header) {
      var matches = header.match(/^([^:]+):\s*(.*)/);
      if (matches) {
        var key = matches[1].toLowerCase();
        if (key === "set-cookie") {
          if (self.headers[key] === undefined) {
            self.headers[key] = [];
          }
          self.headers[key].push(matches[2]);
        } else if (self.headers[key] !== undefined) {
          self.headers[key] += ", " + matches[2];
        } else {
          self.headers[key] = matches[2];
        }
        self.rawHeaders.push(matches[1], matches[2]);
      }
    });
    var contentType = self.headers["content-type"];
    if (contentType) {
      var charsetMatch = contentType.match(/;\s*charset=([^;])(;|$)/);
      if (charsetMatch) {
        self._charset = charsetMatch[1].toLowerCase();
      }
    }
    if (!self._charset) self._charset = "utf-8"; // best guess
  }
};

inherits(IncomingMessage, stream.Readable);
IncomingMessage.prototype._read = function () {
  var self = this;
  var resolve = self._resumeFetch;
  if (resolve) {
    self._resumeFetch = null;
    resolve();
  }
};
IncomingMessage.prototype._onXHRProgress = function (resetTimers) {
  var self = this;
  var xhr = self._xhr;
  var response = null;
  switch (self._mode) {
    case "text":
      response = xhr.responseText;
      if (response.length > self._pos) {
        var newData = response.substr(self._pos);
        if (self._charset === "x-user-defined") {
          var buffer = Buffer.alloc(newData.length);
          for (var i = 0; i < newData.length; i++) buffer[i] = newData.charCodeAt(i) & 0xff;
          self.push(buffer);
        } else {
          self.push(newData, self._charset);
        }
        self._pos = response.length;
      }
      break;
    case "arraybuffer":
      if (xhr.readyState !== rStates.DONE || !xhr.response) break;
      response = xhr.response;
      self.push(Buffer.from(new Uint8Array(response)));
      break;
    case "moz-chunked-arraybuffer":
      // take whole
      response = xhr.response;
      if (xhr.readyState !== rStates.LOADING || !response) break;
      self.push(Buffer.from(new Uint8Array(response)));
      break;
    case "ms-stream":
      response = xhr.response;
      if (xhr.readyState !== rStates.LOADING) break;
      var reader = new __webpack_require__.g.MSStreamReader();
      reader.onprogress = function () {
        if (reader.result.byteLength > self._pos) {
          self.push(Buffer.from(new Uint8Array(reader.result.slice(self._pos))));
          self._pos = reader.result.byteLength;
        }
      };
      reader.onload = function () {
        resetTimers(true);
        self.push(null);
      };
      // reader.onerror = ??? // TODO: this
      reader.readAsArrayBuffer(response);
      break;
  }

  // The ms-stream case handles end separately in reader.onload()
  if (self._xhr.readyState === rStates.DONE && self._mode !== "ms-stream") {
    resetTimers(true);
    self.push(null);
  }
};

/***/ }),

/***/ 9084:
/***/ ((__unused_webpack_module, exports) => {

"use strict";


function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return _typeof(key) === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (_typeof(input) !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (_typeof(res) !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
function _classPrivateFieldInitSpec(obj, privateMap, value) { _checkPrivateRedeclaration(obj, privateMap); privateMap.set(obj, value); }
function _checkPrivateRedeclaration(obj, privateCollection) { if (privateCollection.has(obj)) { throw new TypeError("Cannot initialize the same private elements twice on an object"); } }
function _classPrivateFieldGet(receiver, privateMap) { var descriptor = _classExtractFieldDescriptor(receiver, privateMap, "get"); return _classApplyDescriptorGet(receiver, descriptor); }
function _classApplyDescriptorGet(receiver, descriptor) { if (descriptor.get) { return descriptor.get.call(receiver); } return descriptor.value; }
function _classPrivateFieldSet(receiver, privateMap, value) { var descriptor = _classExtractFieldDescriptor(receiver, privateMap, "set"); _classApplyDescriptorSet(receiver, descriptor, value); return value; }
function _classExtractFieldDescriptor(receiver, privateMap, action) { if (!privateMap.has(receiver)) { throw new TypeError("attempted to " + action + " private field on non-instance"); } return privateMap.get(receiver); }
function _classApplyDescriptorSet(receiver, descriptor, value) { if (descriptor.set) { descriptor.set.call(receiver, value); } else { if (!descriptor.writable) { throw new TypeError("attempted to set read only private field"); } descriptor.value = value; } }
var _vm = /*#__PURE__*/new WeakMap();
var Context = /*#__PURE__*/function () {
  function Context() {
    _classCallCheck(this, Context);
    _classPrivateFieldInitSpec(this, _vm, {
      writable: true,
      value: void 0
    });
    _classPrivateFieldSet(this, _vm, __gopeed_create_vm());
  }
  _createClass(Context, [{
    key: "eval",
    value: function _eval(code) {
      for (var key in this) {
        _classPrivateFieldGet(this, _vm).set(key, this[key]);
      }
      var result = _classPrivateFieldGet(this, _vm).runString(code);
      for (var _key in this) {
        this[_key] = _classPrivateFieldGet(this, _vm).get(_key);
      }
      return result;
    }
  }]);
  return Context;
}();
var Script = /*#__PURE__*/function () {
  function Script(code) {
    _classCallCheck(this, Script);
    this.code = code;
  }
  _createClass(Script, [{
    key: "runInContext",
    value: function runInContext(context) {
      return context.eval(this.code);
    }
  }, {
    key: "runInNewContext",
    value: function runInNewContext(context) {
      var newCtx = exports.createContext(context);
      return exports.runInNewContext(this.code, newCtx);
    }
  }, {
    key: "runInThisContext",
    value: function runInThisContext() {
      return exports.runInThisContext(this.code);
    }
  }]);
  return Script;
}();
exports.runInThisContext = function (code) {
  return eval(code);
};
exports.createContext = function (contextObject) {
  var copy = new Context();
  if (_typeof(contextObject) === "object") {
    for (var key in contextObject) {
      copy[key] = contextObject[key];
    }
  }
  return copy;
};
exports.runInNewContext = function (code, contextObject) {
  var context = exports.createContext(contextObject);
  return context.eval(code);
};
exports.Script = Script;

/***/ }),

/***/ 4607:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var GetIntrinsic = __webpack_require__(3584);
var $defineProperty = GetIntrinsic('%Object.defineProperty%', true);
var hasPropertyDescriptors = function hasPropertyDescriptors() {
  if ($defineProperty) {
    try {
      $defineProperty({}, 'a', {
        value: 1
      });
      return true;
    } catch (e) {
      // IE 8 has a broken defineProperty
      return false;
    }
  }
  return false;
};
hasPropertyDescriptors.hasArrayLengthDefineBug = function hasArrayLengthDefineBug() {
  // node v0.6 has a bug where array lengths can be Set but not Defined
  if (!hasPropertyDescriptors()) {
    return null;
  }
  try {
    return $defineProperty([], 'length', {
      value: 1
    }).length !== 1;
  } catch (e) {
    // In Firefox 4-22, defining length on an array throws an exception.
    return true;
  }
};
module.exports = hasPropertyDescriptors;

/***/ }),

/***/ 7365:
/***/ ((module) => {

"use strict";


var test = {
  foo: {}
};
var $Object = Object;
module.exports = function hasProto() {
  return {
    __proto__: test
  }.foo === test.foo && !({
    __proto__: null
  } instanceof $Object);
};

/***/ }),

/***/ 563:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
var origSymbol = typeof Symbol !== 'undefined' && Symbol;
var hasSymbolSham = __webpack_require__(9956);
module.exports = function hasNativeSymbols() {
  if (typeof origSymbol !== 'function') {
    return false;
  }
  if (typeof Symbol !== 'function') {
    return false;
  }
  if (_typeof(origSymbol('foo')) !== 'symbol') {
    return false;
  }
  if (_typeof(Symbol('bar')) !== 'symbol') {
    return false;
  }
  return hasSymbolSham();
};

/***/ }),

/***/ 9956:
/***/ ((module) => {

"use strict";


/* eslint complexity: [2, 18], max-statements: [2, 33] */
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
module.exports = function hasSymbols() {
  if (typeof Symbol !== 'function' || typeof Object.getOwnPropertySymbols !== 'function') {
    return false;
  }
  if (_typeof(Symbol.iterator) === 'symbol') {
    return true;
  }
  var obj = {};
  var sym = Symbol('test');
  var symObj = Object(sym);
  if (typeof sym === 'string') {
    return false;
  }
  if (Object.prototype.toString.call(sym) !== '[object Symbol]') {
    return false;
  }
  if (Object.prototype.toString.call(symObj) !== '[object Symbol]') {
    return false;
  }

  // temp disabled per https://github.com/ljharb/object.assign/issues/17
  // if (sym instanceof Symbol) { return false; }
  // temp disabled per https://github.com/WebReflection/get-own-property-symbols/issues/4
  // if (!(symObj instanceof Symbol)) { return false; }

  // if (typeof Symbol.prototype.toString !== 'function') { return false; }
  // if (String(sym) !== Symbol.prototype.toString.call(sym)) { return false; }

  var symVal = 42;
  obj[sym] = symVal;
  for (sym in obj) {
    return false;
  } // eslint-disable-line no-restricted-syntax, no-unreachable-loop
  if (typeof Object.keys === 'function' && Object.keys(obj).length !== 0) {
    return false;
  }
  if (typeof Object.getOwnPropertyNames === 'function' && Object.getOwnPropertyNames(obj).length !== 0) {
    return false;
  }
  var syms = Object.getOwnPropertySymbols(obj);
  if (syms.length !== 1 || syms[0] !== sym) {
    return false;
  }
  if (!Object.prototype.propertyIsEnumerable.call(obj, sym)) {
    return false;
  }
  if (typeof Object.getOwnPropertyDescriptor === 'function') {
    var descriptor = Object.getOwnPropertyDescriptor(obj, sym);
    if (descriptor.value !== symVal || descriptor.enumerable !== true) {
      return false;
    }
  }
  return true;
};

/***/ }),

/***/ 4057:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var call = Function.prototype.call;
var $hasOwn = Object.prototype.hasOwnProperty;
var bind = __webpack_require__(4597);

/** @type {(o: {}, p: PropertyKey) => p is keyof o} */
module.exports = bind.call(call, $hasOwn);

/***/ }),

/***/ 9804:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var http = __webpack_require__(1780);
var url = __webpack_require__(3149);
var https = module.exports;
for (var key in http) {
  if (http.hasOwnProperty(key)) https[key] = http[key];
}
https.request = function (params, cb) {
  params = validateParams(params);
  return http.request.call(this, params, cb);
};
https.get = function (params, cb) {
  params = validateParams(params);
  return http.get.call(this, params, cb);
};
function validateParams(params) {
  if (typeof params === 'string') {
    params = url.parse(params);
  }
  if (!params.protocol) {
    params.protocol = 'https:';
  }
  if (params.protocol !== 'https:') {
    throw new Error('Protocol "' + params.protocol + '" not supported. Expected "https:"');
  }
  return params;
}

/***/ }),

/***/ 9350:
/***/ ((__unused_webpack_module, exports) => {

/*! ieee754. BSD-3-Clause License. Feross Aboukhadijeh <https://feross.org/opensource> */
exports.read = function (buffer, offset, isLE, mLen, nBytes) {
  var e, m;
  var eLen = nBytes * 8 - mLen - 1;
  var eMax = (1 << eLen) - 1;
  var eBias = eMax >> 1;
  var nBits = -7;
  var i = isLE ? nBytes - 1 : 0;
  var d = isLE ? -1 : 1;
  var s = buffer[offset + i];
  i += d;
  e = s & (1 << -nBits) - 1;
  s >>= -nBits;
  nBits += eLen;
  for (; nBits > 0; e = e * 256 + buffer[offset + i], i += d, nBits -= 8) {}
  m = e & (1 << -nBits) - 1;
  e >>= -nBits;
  nBits += mLen;
  for (; nBits > 0; m = m * 256 + buffer[offset + i], i += d, nBits -= 8) {}
  if (e === 0) {
    e = 1 - eBias;
  } else if (e === eMax) {
    return m ? NaN : (s ? -1 : 1) * Infinity;
  } else {
    m = m + Math.pow(2, mLen);
    e = e - eBias;
  }
  return (s ? -1 : 1) * m * Math.pow(2, e - mLen);
};
exports.write = function (buffer, value, offset, isLE, mLen, nBytes) {
  var e, m, c;
  var eLen = nBytes * 8 - mLen - 1;
  var eMax = (1 << eLen) - 1;
  var eBias = eMax >> 1;
  var rt = mLen === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0;
  var i = isLE ? 0 : nBytes - 1;
  var d = isLE ? 1 : -1;
  var s = value < 0 || value === 0 && 1 / value < 0 ? 1 : 0;
  value = Math.abs(value);
  if (isNaN(value) || value === Infinity) {
    m = isNaN(value) ? 1 : 0;
    e = eMax;
  } else {
    e = Math.floor(Math.log(value) / Math.LN2);
    if (value * (c = Math.pow(2, -e)) < 1) {
      e--;
      c *= 2;
    }
    if (e + eBias >= 1) {
      value += rt / c;
    } else {
      value += rt * Math.pow(2, 1 - eBias);
    }
    if (value * c >= 2) {
      e++;
      c /= 2;
    }
    if (e + eBias >= eMax) {
      m = 0;
      e = eMax;
    } else if (e + eBias >= 1) {
      m = (value * c - 1) * Math.pow(2, mLen);
      e = e + eBias;
    } else {
      m = value * Math.pow(2, eBias - 1) * Math.pow(2, mLen);
      e = 0;
    }
  }
  for (; mLen >= 8; buffer[offset + i] = m & 0xff, i += d, m /= 256, mLen -= 8) {}
  e = e << mLen | m;
  eLen += mLen;
  for (; eLen > 0; buffer[offset + i] = e & 0xff, i += d, e /= 256, eLen -= 8) {}
  buffer[offset + i - d] |= s * 128;
};

/***/ }),

/***/ 5153:
/***/ ((module) => {

if (typeof Object.create === 'function') {
  // implementation from standard node.js 'util' module
  module.exports = function inherits(ctor, superCtor) {
    if (superCtor) {
      ctor.super_ = superCtor;
      ctor.prototype = Object.create(superCtor.prototype, {
        constructor: {
          value: ctor,
          enumerable: false,
          writable: true,
          configurable: true
        }
      });
    }
  };
} else {
  // old school shim for old browsers
  module.exports = function inherits(ctor, superCtor) {
    if (superCtor) {
      ctor.super_ = superCtor;
      var TempCtor = function TempCtor() {};
      TempCtor.prototype = superCtor.prototype;
      ctor.prototype = new TempCtor();
      ctor.prototype.constructor = ctor;
    }
  };
}

/***/ }),

/***/ 5434:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";


function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return _typeof(key) === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (_typeof(input) !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (_typeof(res) !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); Object.defineProperty(subClass, "prototype", { writable: false }); if (superClass) _setPrototypeOf(subClass, superClass); }
function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }
function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }
function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } else if (call !== void 0) { throw new TypeError("Derived constructors may only return object or undefined"); } return _assertThisInitialized(self); }
function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }
function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }
function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }
var __importDefault = this && this.__importDefault || function (mod) {
  return mod && mod.__esModule ? mod : {
    "default": mod
  };
};
Object.defineProperty(exports, "__esModule", ({
  value: true
}));
var stream_1 = __webpack_require__(9788);
var sax_1 = __importDefault(__webpack_require__(3555));
var parse_time_1 = __webpack_require__(4);
/**
 * A wrapper around sax that emits segments.
 */
var DashMPDParser = /*#__PURE__*/function (_stream_1$Writable) {
  _inherits(DashMPDParser, _stream_1$Writable);
  var _super = _createSuper(DashMPDParser);
  function DashMPDParser(targetID) {
    var _this;
    _classCallCheck(this, DashMPDParser);
    _this = _super.call(this);
    _this._parser = sax_1["default"].createStream(false, {
      lowercase: true
    });
    _this._parser.on('error', _this.destroy.bind(_assertThisInitialized(_this)));
    var lastTag;
    var currtime = 0;
    var seq = 0;
    var segmentTemplate;
    var timescale, offset, duration, baseURL;
    var timeline = [];
    var getSegments = false;
    var gotSegments = false;
    var isStatic;
    var treeLevel;
    var periodStart;
    var tmpl = function tmpl(str) {
      var context = {
        RepresentationID: targetID,
        Number: seq,
        Time: currtime
      };
      return str.replace(/\$(\w+)\$/g, function (m, p1) {
        return "".concat(context[p1]);
      });
    };
    _this._parser.on('opentag', function (node) {
      switch (node.name) {
        case 'mpd':
          currtime = node.attributes.availabilitystarttime ? new Date(node.attributes.availabilitystarttime).getTime() : 0;
          isStatic = node.attributes.type !== 'dynamic';
          break;
        case 'period':
          // Reset everything on <Period> tag.
          seq = 0;
          timescale = 1000;
          duration = 0;
          offset = 0;
          baseURL = [];
          treeLevel = 0;
          periodStart = parse_time_1.durationStr(node.attributes.start) || 0;
          break;
        case 'segmentlist':
          seq = parseInt(node.attributes.startnumber) || seq;
          timescale = parseInt(node.attributes.timescale) || timescale;
          duration = parseInt(node.attributes.duration) || duration;
          offset = parseInt(node.attributes.presentationtimeoffset) || offset;
          break;
        case 'segmenttemplate':
          segmentTemplate = node.attributes;
          seq = parseInt(node.attributes.startnumber) || seq;
          timescale = parseInt(node.attributes.timescale) || timescale;
          break;
        case 'segmenttimeline':
        case 'baseurl':
          lastTag = node.name;
          break;
        case 's':
          timeline.push({
            duration: parseInt(node.attributes.d),
            repeat: parseInt(node.attributes.r),
            time: parseInt(node.attributes.t)
          });
          break;
        case 'adaptationset':
        case 'representation':
          treeLevel++;
          if (!targetID) {
            targetID = node.attributes.id;
          }
          getSegments = node.attributes.id === "".concat(targetID);
          if (getSegments) {
            if (periodStart) {
              currtime += periodStart;
            }
            if (offset) {
              currtime -= offset / timescale * 1000;
            }
            _this.emit('starttime', currtime);
          }
          break;
        case 'initialization':
          if (getSegments) {
            _this.emit('item', {
              url: baseURL.filter(function (s) {
                return !!s;
              }).join('') + node.attributes.sourceurl,
              seq: seq,
              init: true,
              duration: 0
            });
          }
          break;
        case 'segmenturl':
          if (getSegments) {
            gotSegments = true;
            var tl = timeline.shift();
            var segmentDuration = ((tl === null || tl === void 0 ? void 0 : tl.duration) || duration) / timescale * 1000;
            _this.emit('item', {
              url: baseURL.filter(function (s) {
                return !!s;
              }).join('') + node.attributes.media,
              seq: seq++,
              duration: segmentDuration
            });
            currtime += segmentDuration;
          }
          break;
      }
    });
    var onEnd = function onEnd() {
      if (isStatic) {
        _this.emit('endlist');
      }
      if (!getSegments) {
        _this.destroy(Error("Representation '".concat(targetID, "' not found")));
      } else {
        _this.emit('end');
      }
    };
    _this._parser.on('closetag', function (tagName) {
      switch (tagName) {
        case 'adaptationset':
        case 'representation':
          treeLevel--;
          if (segmentTemplate && timeline.length) {
            gotSegments = true;
            if (segmentTemplate.initialization) {
              _this.emit('item', {
                url: baseURL.filter(function (s) {
                  return !!s;
                }).join('') + tmpl(segmentTemplate.initialization),
                seq: seq,
                init: true,
                duration: 0
              });
            }
            for (var _i = 0, _timeline = timeline; _i < _timeline.length; _i++) {
              var _timeline$_i = _timeline[_i],
                itemDuration = _timeline$_i.duration,
                repeat = _timeline$_i.repeat,
                time = _timeline$_i.time;
              itemDuration = itemDuration / timescale * 1000;
              repeat = repeat || 1;
              currtime = time || currtime;
              for (var i = 0; i < repeat; i++) {
                _this.emit('item', {
                  url: baseURL.filter(function (s) {
                    return !!s;
                  }).join('') + tmpl(segmentTemplate.media),
                  seq: seq++,
                  duration: itemDuration
                });
                currtime += itemDuration;
              }
            }
          }
          if (gotSegments) {
            _this.emit('endearly');
            onEnd();
            _this._parser.removeAllListeners();
            _this.removeAllListeners('finish');
          }
          break;
      }
    });
    _this._parser.on('text', function (text) {
      if (lastTag === 'baseurl') {
        baseURL[treeLevel] = text;
        lastTag = null;
      }
    });
    _this.on('finish', onEnd);
    return _this;
  }
  _createClass(DashMPDParser, [{
    key: "_write",
    value: function _write(chunk, encoding, callback) {
      this._parser.write(chunk);
      callback();
    }
  }]);
  return DashMPDParser;
}(stream_1.Writable);
exports["default"] = DashMPDParser;

/***/ }),

/***/ 1808:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";


var __importDefault = this && this.__importDefault || function (mod) {
  return mod && mod.__esModule ? mod : {
    "default": mod
  };
};
var stream_1 = __webpack_require__(9788);
var miniget_1 = __importDefault(__webpack_require__(6206));
var m3u8_parser_1 = __importDefault(__webpack_require__(7696));
var dash_mpd_parser_1 = __importDefault(__webpack_require__(5434));
var queue_1 = __webpack_require__(5862);
var parse_time_1 = __webpack_require__(4);
var supportedParsers = {
  m3u8: m3u8_parser_1["default"],
  'dash-mpd': dash_mpd_parser_1["default"]
};
var m3u8stream = function m3u8stream(playlistURL) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var stream = new stream_1.PassThrough({
    highWaterMark: options.highWaterMark
  });
  var chunkReadahead = options.chunkReadahead || 3;
  // 20 seconds.
  var liveBuffer = options.liveBuffer || 20000;
  var requestOptions = options.requestOptions;
  var Parser = supportedParsers[options.parser || (/\.mpd$/.test(playlistURL) ? 'dash-mpd' : 'm3u8')];
  if (!Parser) {
    throw TypeError("parser '".concat(options.parser, "' not supported"));
  }
  var begin = 0;
  if (typeof options.begin !== 'undefined') {
    begin = typeof options.begin === 'string' ? parse_time_1.humanStr(options.begin) : Math.max(options.begin - liveBuffer, 0);
  }
  var forwardEvents = function forwardEvents(req) {
    for (var _i = 0, _arr = ['abort', 'request', 'response', 'redirect', 'retry', 'reconnect']; _i < _arr.length; _i++) {
      var event = _arr[_i];
      req.on(event, stream.emit.bind(stream, event));
    }
  };
  var currSegment;
  var streamQueue = new queue_1.Queue(function (req, callback) {
    currSegment = req;
    // Count the size manually, since the `content-length` header is not
    // always there.
    var size = 0;
    req.on('data', function (chunk) {
      return size += chunk.length;
    });
    req.pipe(stream, {
      end: false
    });
    req.on('end', function () {
      return callback(null, size);
    });
  }, {
    concurrency: 1
  });
  var segmentNumber = 0;
  var downloaded = 0;
  var requestQueue = new queue_1.Queue(function (segment, callback) {
    var reqOptions = Object.assign({}, requestOptions);
    if (segment.range) {
      reqOptions.headers = Object.assign({}, reqOptions.headers, {
        Range: "bytes=".concat(segment.range.start, "-").concat(segment.range.end)
      });
    }
    var req = miniget_1["default"](new URL(segment.url, playlistURL).toString(), reqOptions);
    req.on('error', callback);
    forwardEvents(req);
    streamQueue.push(req, function (_, size) {
      downloaded += +size;
      stream.emit('progress', {
        num: ++segmentNumber,
        size: size,
        duration: segment.duration,
        url: segment.url
      }, requestQueue.total, downloaded);
      callback(null);
    });
  }, {
    concurrency: chunkReadahead
  });
  var onError = function onError(err) {
    stream.emit('error', err);
    // Stop on any error.
    stream.end();
  };
  // When to look for items again.
  var refreshThreshold;
  var minRefreshTime;
  var refreshTimeout;
  var fetchingPlaylist = true;
  var ended = false;
  var isStatic = false;
  var lastRefresh;
  var onQueuedEnd = function onQueuedEnd(err) {
    currSegment = null;
    if (err) {
      onError(err);
    } else if (!fetchingPlaylist && !ended && !isStatic && requestQueue.tasks.length + requestQueue.active <= refreshThreshold) {
      var ms = Math.max(0, minRefreshTime - (Date.now() - lastRefresh));
      fetchingPlaylist = true;
      refreshTimeout = setTimeout(refreshPlaylist, ms);
    } else if ((ended || isStatic) && !requestQueue.tasks.length && !requestQueue.active) {
      stream.end();
    }
  };
  var currPlaylist;
  var lastSeq;
  var starttime = 0;
  var refreshPlaylist = function refreshPlaylist() {
    lastRefresh = Date.now();
    currPlaylist = miniget_1["default"](playlistURL, requestOptions);
    currPlaylist.on('error', onError);
    forwardEvents(currPlaylist);
    var parser = currPlaylist.pipe(new Parser(options.id));
    parser.on('starttime', function (a) {
      if (starttime) {
        return;
      }
      starttime = a;
      if (typeof options.begin === 'string' && begin >= 0) {
        begin += starttime;
      }
    });
    parser.on('endlist', function () {
      isStatic = true;
    });
    parser.on('endearly', currPlaylist.unpipe.bind(currPlaylist, parser));
    var addedItems = [];
    var addItem = function addItem(item) {
      if (!item.init) {
        if (item.seq <= lastSeq) {
          return;
        }
        lastSeq = item.seq;
      }
      begin = item.time;
      requestQueue.push(item, onQueuedEnd);
      addedItems.push(item);
    };
    var tailedItems = [],
      tailedItemsDuration = 0;
    parser.on('item', function (item) {
      var timedItem = Object.assign({
        time: starttime
      }, item);
      if (begin <= timedItem.time) {
        addItem(timedItem);
      } else {
        tailedItems.push(timedItem);
        tailedItemsDuration += timedItem.duration;
        // Only keep the last `liveBuffer` of items.
        while (tailedItems.length > 1 && tailedItemsDuration - tailedItems[0].duration > liveBuffer) {
          var lastItem = tailedItems.shift();
          tailedItemsDuration -= lastItem.duration;
        }
      }
      starttime += timedItem.duration;
    });
    parser.on('end', function () {
      currPlaylist = null;
      // If we are too ahead of the stream, make sure to get the
      // latest available items with a small buffer.
      if (!addedItems.length && tailedItems.length) {
        tailedItems.forEach(function (item) {
          addItem(item);
        });
      }
      // Refresh the playlist when remaining segments get low.
      refreshThreshold = Math.max(1, Math.ceil(addedItems.length * 0.01));
      // Throttle refreshing the playlist by looking at the duration
      // of live items added on this refresh.
      minRefreshTime = addedItems.reduce(function (total, item) {
        return item.duration + total;
      }, 0);
      fetchingPlaylist = false;
      onQueuedEnd(null);
    });
  };
  refreshPlaylist();
  stream.end = function () {
    ended = true;
    streamQueue.die();
    requestQueue.die();
    clearTimeout(refreshTimeout);
    currPlaylist === null || currPlaylist === void 0 ? void 0 : currPlaylist.destroy();
    currSegment === null || currSegment === void 0 ? void 0 : currSegment.destroy();
    stream_1.PassThrough.prototype.end.call(stream, null);
    return stream;
  };
  return stream;
};
m3u8stream.parseTimestamp = parse_time_1.humanStr;
module.exports = m3u8stream;

/***/ }),

/***/ 7696:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return _typeof(key) === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (_typeof(input) !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (_typeof(res) !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); Object.defineProperty(subClass, "prototype", { writable: false }); if (superClass) _setPrototypeOf(subClass, superClass); }
function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }
function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }
function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } else if (call !== void 0) { throw new TypeError("Derived constructors may only return object or undefined"); } return _assertThisInitialized(self); }
function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }
function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }
function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }
Object.defineProperty(exports, "__esModule", ({
  value: true
}));
var stream_1 = __webpack_require__(9788);
/**
 * A very simple m3u8 playlist file parser that detects tags and segments.
 */
var m3u8Parser = /*#__PURE__*/function (_stream_1$Writable) {
  _inherits(m3u8Parser, _stream_1$Writable);
  var _super = _createSuper(m3u8Parser);
  function m3u8Parser() {
    var _this;
    _classCallCheck(this, m3u8Parser);
    _this = _super.call(this);
    _this._lastLine = '';
    _this._seq = 0;
    _this._nextItemDuration = null;
    _this._nextItemRange = null;
    _this._lastItemRangeEnd = 0;
    _this.on('finish', function () {
      _this._parseLine(_this._lastLine);
      _this.emit('end');
    });
    return _this;
  }
  _createClass(m3u8Parser, [{
    key: "_parseAttrList",
    value: function _parseAttrList(value) {
      var attrs = {};
      var regex = /([A-Z0-9-]+)=(?:"([^"]*?)"|([^,]*?))/g;
      var match;
      while ((match = regex.exec(value)) !== null) {
        attrs[match[1]] = match[2] || match[3];
      }
      return attrs;
    }
  }, {
    key: "_parseRange",
    value: function _parseRange(value) {
      if (!value) return null;
      var svalue = value.split('@');
      var start = svalue[1] ? parseInt(svalue[1]) : this._lastItemRangeEnd + 1;
      var end = start + parseInt(svalue[0]) - 1;
      var range = {
        start: start,
        end: end
      };
      this._lastItemRangeEnd = range.end;
      return range;
    }
  }, {
    key: "_parseLine",
    value: function _parseLine(line) {
      var match = line.match(/^#(EXT[A-Z0-9-]+)(?::(.*))?/);
      if (match) {
        // This is a tag.
        var tag = match[1];
        var value = match[2] || '';
        switch (tag) {
          case 'EXT-X-PROGRAM-DATE-TIME':
            this.emit('starttime', new Date(value).getTime());
            break;
          case 'EXT-X-MEDIA-SEQUENCE':
            this._seq = parseInt(value);
            break;
          case 'EXT-X-MAP':
            {
              var attrs = this._parseAttrList(value);
              if (!attrs.URI) {
                this.destroy(new Error('`EXT-X-MAP` found without required attribute `URI`'));
                return;
              }
              this.emit('item', {
                url: attrs.URI,
                seq: this._seq,
                init: true,
                duration: 0,
                range: this._parseRange(attrs.BYTERANGE)
              });
              break;
            }
          case 'EXT-X-BYTERANGE':
            {
              this._nextItemRange = this._parseRange(value);
              break;
            }
          case 'EXTINF':
            this._nextItemDuration = Math.round(parseFloat(value.split(',')[0]) * 1000);
            break;
          case 'EXT-X-ENDLIST':
            this.emit('endlist');
            break;
        }
      } else if (!/^#/.test(line) && line.trim()) {
        // This is a segment
        this.emit('item', {
          url: line.trim(),
          seq: this._seq++,
          duration: this._nextItemDuration,
          range: this._nextItemRange
        });
        this._nextItemRange = null;
      }
    }
  }, {
    key: "_write",
    value: function _write(chunk, encoding, callback) {
      var _this2 = this;
      var lines = chunk.toString('utf8').split('\n');
      if (this._lastLine) {
        lines[0] = this._lastLine + lines[0];
      }
      lines.forEach(function (line, i) {
        if (_this2.destroyed) return;
        if (i < lines.length - 1) {
          _this2._parseLine(line);
        } else {
          // Save the last line in case it has been broken up.
          _this2._lastLine = line;
        }
      });
      callback();
    }
  }]);
  return m3u8Parser;
}(stream_1.Writable);
exports["default"] = m3u8Parser;

/***/ }),

/***/ 4:
/***/ ((__unused_webpack_module, exports) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.durationStr = exports.humanStr = void 0;
var numberFormat = /^\d+$/;
var timeFormat = /^(?:(?:(\d+):)?(\d{1,2}):)?(\d{1,2})(?:\.(\d{3}))?$/;
var timeUnits = {
  ms: 1,
  s: 1000,
  m: 60000,
  h: 3600000
};
/**
 * Converts human friendly time to milliseconds. Supports the format
 * 00:00:00.000 for hours, minutes, seconds, and milliseconds respectively.
 * And 0ms, 0s, 0m, 0h, and together 1m1s.
 *
 * @param {number|string} time
 * @returns {number}
 */
exports.humanStr = function (time) {
  if (typeof time === 'number') {
    return time;
  }
  if (numberFormat.test(time)) {
    return +time;
  }
  var firstFormat = timeFormat.exec(time);
  if (firstFormat) {
    return +(firstFormat[1] || 0) * timeUnits.h + +(firstFormat[2] || 0) * timeUnits.m + +firstFormat[3] * timeUnits.s + +(firstFormat[4] || 0);
  } else {
    var total = 0;
    var r = /(-?\d+)(ms|s|m|h)/g;
    var rs;
    while ((rs = r.exec(time)) !== null) {
      total += +rs[1] * timeUnits[rs[2]];
    }
    return total;
  }
};
/**
 * Parses a duration string in the form of "123.456S", returns milliseconds.
 *
 * @param {string} time
 * @returns {number}
 */
exports.durationStr = function (time) {
  var total = 0;
  var r = /(\d+(?:\.\d+)?)(S|M|H)/g;
  var rs;
  while ((rs = r.exec(time)) !== null) {
    total += +rs[1] * timeUnits[rs[2].toLowerCase()];
  }
  return total;
};

/***/ }),

/***/ 5862:
/***/ ((__unused_webpack_module, exports) => {

"use strict";


function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return _typeof(key) === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (_typeof(input) !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (_typeof(res) !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.Queue = void 0;
var Queue = /*#__PURE__*/function () {
  /**
   * A really simple queue with concurrency.
   *
   * @param {Function} worker
   * @param {Object} options
   * @param {!number} options.concurrency
   */
  function Queue(worker) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    _classCallCheck(this, Queue);
    this._worker = worker;
    this._concurrency = options.concurrency || 1;
    this.tasks = [];
    this.total = 0;
    this.active = 0;
  }
  /**
   * Push a task to the queue.
   *
   *  @param {T} item
   *  @param {!Function} callback
   */
  _createClass(Queue, [{
    key: "push",
    value: function push(item, callback) {
      this.tasks.push({
        item: item,
        callback: callback
      });
      this.total++;
      this._next();
    }
    /**
     * Process next job in queue.
     */
  }, {
    key: "_next",
    value: function _next() {
      var _this = this;
      if (this.active >= this._concurrency || !this.tasks.length) {
        return;
      }
      var _this$tasks$shift = this.tasks.shift(),
        item = _this$tasks$shift.item,
        callback = _this$tasks$shift.callback;
      var callbackCalled = false;
      this.active++;
      this._worker(item, function (err, result) {
        if (callbackCalled) {
          return;
        }
        _this.active--;
        callbackCalled = true;
        callback === null || callback === void 0 ? void 0 : callback(err, result);
        _this._next();
      });
    }
    /**
     * Stops processing queued jobs.
     */
  }, {
    key: "die",
    value: function die() {
      this.tasks = [];
    }
  }]);
  return Queue;
}();
exports.Queue = Queue;

/***/ }),

/***/ 6206:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";
/* provided dependency */ var process = __webpack_require__(2790);


function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }
function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }
function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return _typeof(key) === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (_typeof(input) !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (_typeof(res) !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); Object.defineProperty(subClass, "prototype", { writable: false }); if (superClass) _setPrototypeOf(subClass, superClass); }
function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }
function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } else if (call !== void 0) { throw new TypeError("Derived constructors may only return object or undefined"); } return _assertThisInitialized(self); }
function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }
function _wrapNativeSuper(Class) { var _cache = typeof Map === "function" ? new Map() : undefined; _wrapNativeSuper = function _wrapNativeSuper(Class) { if (Class === null || !_isNativeFunction(Class)) return Class; if (typeof Class !== "function") { throw new TypeError("Super expression must either be null or a function"); } if (typeof _cache !== "undefined") { if (_cache.has(Class)) return _cache.get(Class); _cache.set(Class, Wrapper); } function Wrapper() { return _construct(Class, arguments, _getPrototypeOf(this).constructor); } Wrapper.prototype = Object.create(Class.prototype, { constructor: { value: Wrapper, enumerable: false, writable: true, configurable: true } }); return _setPrototypeOf(Wrapper, Class); }; return _wrapNativeSuper(Class); }
function _construct(Parent, args, Class) { if (_isNativeReflectConstruct()) { _construct = Reflect.construct.bind(); } else { _construct = function _construct(Parent, args, Class) { var a = [null]; a.push.apply(a, args); var Constructor = Function.bind.apply(Parent, a); var instance = new Constructor(); if (Class) _setPrototypeOf(instance, Class.prototype); return instance; }; } return _construct.apply(null, arguments); }
function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }
function _isNativeFunction(fn) { try { return Function.toString.call(fn).indexOf("[native code]") !== -1; } catch (e) { return typeof fn === "function"; } }
function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }
function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }
var __importDefault = this && this.__importDefault || function (mod) {
  return mod && mod.__esModule ? mod : {
    "default": mod
  };
};
var http_1 = __importDefault(__webpack_require__(1780));
var https_1 = __importDefault(__webpack_require__(9804));
var stream_1 = __webpack_require__(9788);
var httpLibs = {
  'http:': http_1["default"],
  'https:': https_1["default"]
};
var redirectStatusCodes = new Set([301, 302, 303, 307, 308]);
var retryStatusCodes = new Set([429, 503]);
// `request`, `response`, `abort`, left out, miniget will emit these.
var requestEvents = ['connect', 'continue', 'information', 'socket', 'timeout', 'upgrade'];
var responseEvents = ['aborted'];
Miniget.MinigetError = /*#__PURE__*/function (_Error) {
  _inherits(MinigetError, _Error);
  var _super = _createSuper(MinigetError);
  function MinigetError(message, statusCode) {
    var _this;
    _classCallCheck(this, MinigetError);
    _this = _super.call(this, message);
    _this.statusCode = statusCode;
    return _this;
  }
  return _createClass(MinigetError);
}( /*#__PURE__*/_wrapNativeSuper(Error));
Miniget.defaultOptions = {
  maxRedirects: 10,
  maxRetries: 2,
  maxReconnects: 0,
  backoff: {
    inc: 100,
    max: 10000
  }
};
function Miniget(url) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var _a;
  var opts = Object.assign({}, Miniget.defaultOptions, options);
  var stream = new stream_1.PassThrough({
    highWaterMark: opts.highWaterMark
  });
  stream.destroyed = stream.aborted = false;
  var activeRequest;
  var activeResponse;
  var activeDecodedStream;
  var redirects = 0;
  var retries = 0;
  var retryTimeout;
  var reconnects = 0;
  var contentLength;
  var acceptRanges = false;
  var rangeStart = 0,
    rangeEnd;
  var downloaded = 0;
  // Check if this is a ranged request.
  if ((_a = opts.headers) === null || _a === void 0 ? void 0 : _a.Range) {
    var r = /bytes=(\d+)-(\d+)?/.exec("".concat(opts.headers.Range));
    if (r) {
      rangeStart = parseInt(r[1], 10);
      rangeEnd = parseInt(r[2], 10);
    }
  }
  // Add `Accept-Encoding` header.
  if (opts.acceptEncoding) {
    opts.headers = Object.assign({
      'Accept-Encoding': Object.keys(opts.acceptEncoding).join(', ')
    }, opts.headers);
  }
  var downloadHasStarted = function downloadHasStarted() {
    return activeDecodedStream && downloaded > 0;
  };
  var downloadComplete = function downloadComplete() {
    return !acceptRanges || downloaded === contentLength;
  };
  var reconnect = function reconnect(err) {
    activeDecodedStream = null;
    retries = 0;
    var inc = opts.backoff.inc;
    var ms = Math.min(inc, opts.backoff.max);
    retryTimeout = setTimeout(doDownload, ms);
    stream.emit('reconnect', reconnects, err);
  };
  var reconnectIfEndedEarly = function reconnectIfEndedEarly(err) {
    if (options.method !== 'HEAD' && !downloadComplete() && reconnects++ < opts.maxReconnects) {
      reconnect(err);
      return true;
    }
    return false;
  };
  var retryRequest = function retryRequest(retryOptions) {
    if (stream.destroyed) {
      return false;
    }
    if (downloadHasStarted()) {
      return reconnectIfEndedEarly(retryOptions.err);
    } else if ((!retryOptions.err || retryOptions.err.message === 'ENOTFOUND') && retries++ < opts.maxRetries) {
      var ms = retryOptions.retryAfter || Math.min(retries * opts.backoff.inc, opts.backoff.max);
      retryTimeout = setTimeout(doDownload, ms);
      stream.emit('retry', retries, retryOptions.err);
      return true;
    }
    return false;
  };
  var forwardEvents = function forwardEvents(ee, events) {
    var _iterator = _createForOfIteratorHelper(events),
      _step;
    try {
      for (_iterator.s(); !(_step = _iterator.n()).done;) {
        var event = _step.value;
        ee.on(event, stream.emit.bind(stream, event));
      }
    } catch (err) {
      _iterator.e(err);
    } finally {
      _iterator.f();
    }
  };
  var doDownload = function doDownload() {
    var parsed = {},
      httpLib;
    try {
      var urlObj = typeof url === 'string' ? new URL(url) : url;
      parsed = Object.assign({}, {
        host: urlObj.host,
        hostname: urlObj.hostname,
        path: urlObj.pathname + urlObj.search + urlObj.hash,
        port: urlObj.port,
        protocol: urlObj.protocol
      });
      if (urlObj.username) {
        parsed.auth = "".concat(urlObj.username, ":").concat(urlObj.password);
      }
      httpLib = httpLibs[String(parsed.protocol)];
    } catch (err) {
      // Let the error be caught by the if statement below.
    }
    if (!httpLib) {
      stream.emit('error', new Miniget.MinigetError("Invalid URL: ".concat(url)));
      return;
    }
    Object.assign(parsed, opts);
    if (acceptRanges && downloaded > 0) {
      var start = downloaded + rangeStart;
      var end = rangeEnd || '';
      parsed.headers = Object.assign({}, parsed.headers, {
        Range: "bytes=".concat(start, "-").concat(end)
      });
    }
    if (opts.transform) {
      try {
        parsed = opts.transform(parsed);
      } catch (err) {
        stream.emit('error', err);
        return;
      }
      if (!parsed || parsed.protocol) {
        httpLib = httpLibs[String(parsed === null || parsed === void 0 ? void 0 : parsed.protocol)];
        if (!httpLib) {
          stream.emit('error', new Miniget.MinigetError('Invalid URL object from `transform` function'));
          return;
        }
      }
    }
    var onError = function onError(err) {
      if (stream.destroyed || stream.readableEnded) {
        return;
      }
      cleanup();
      if (!retryRequest({
        err: err
      })) {
        stream.emit('error', err);
      } else {
        activeRequest.removeListener('close', onRequestClose);
      }
    };
    var onRequestClose = function onRequestClose() {
      cleanup();
      retryRequest({});
    };
    var cleanup = function cleanup() {
      activeRequest.removeListener('close', onRequestClose);
      activeResponse === null || activeResponse === void 0 ? void 0 : activeResponse.removeListener('data', onData);
      activeDecodedStream === null || activeDecodedStream === void 0 ? void 0 : activeDecodedStream.removeListener('end', onEnd);
    };
    var onData = function onData(chunk) {
      downloaded += chunk.length;
    };
    var onEnd = function onEnd() {
      cleanup();
      if (!reconnectIfEndedEarly()) {
        stream.end();
      }
    };
    activeRequest = httpLib.request(parsed, function (res) {
      // Needed for node v10, v12.
      // istanbul ignore next
      if (stream.destroyed) {
        return;
      }
      if (redirectStatusCodes.has(res.statusCode)) {
        if (redirects++ >= opts.maxRedirects) {
          stream.emit('error', new Miniget.MinigetError('Too many redirects'));
        } else {
          if (res.headers.location) {
            url = res.headers.location;
          } else {
            var err = new Miniget.MinigetError('Redirect status code given with no location', res.statusCode);
            stream.emit('error', err);
            cleanup();
            return;
          }
          setTimeout(doDownload, parseInt(res.headers['retry-after'] || '0', 10) * 1000);
          stream.emit('redirect', url);
        }
        cleanup();
        return;
        // Check for rate limiting.
      } else if (retryStatusCodes.has(res.statusCode)) {
        if (!retryRequest({
          retryAfter: parseInt(res.headers['retry-after'] || '0', 10)
        })) {
          var _err = new Miniget.MinigetError("Status code: ".concat(res.statusCode), res.statusCode);
          stream.emit('error', _err);
        }
        cleanup();
        return;
      } else if (res.statusCode && (res.statusCode < 200 || res.statusCode >= 400)) {
        var _err2 = new Miniget.MinigetError("Status code: ".concat(res.statusCode), res.statusCode);
        if (res.statusCode >= 500) {
          onError(_err2);
        } else {
          stream.emit('error', _err2);
        }
        cleanup();
        return;
      }
      activeDecodedStream = res;
      if (opts.acceptEncoding && res.headers['content-encoding']) {
        var _iterator2 = _createForOfIteratorHelper(res.headers['content-encoding'].split(', ').reverse()),
          _step2;
        try {
          for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
            var enc = _step2.value;
            var fn = opts.acceptEncoding[enc];
            if (fn) {
              activeDecodedStream = activeDecodedStream.pipe(fn());
              activeDecodedStream.on('error', onError);
            }
          }
        } catch (err) {
          _iterator2.e(err);
        } finally {
          _iterator2.f();
        }
      }
      if (!contentLength) {
        contentLength = parseInt("".concat(res.headers['content-length']), 10);
        acceptRanges = res.headers['accept-ranges'] === 'bytes' && contentLength > 0 && opts.maxReconnects > 0;
      }
      res.on('data', onData);
      activeDecodedStream.on('end', onEnd);
      activeDecodedStream.pipe(stream, {
        end: !acceptRanges
      });
      activeResponse = res;
      stream.emit('response', res);
      res.on('error', onError);
      forwardEvents(res, responseEvents);
    });
    activeRequest.on('error', onError);
    activeRequest.on('close', onRequestClose);
    forwardEvents(activeRequest, requestEvents);
    if (stream.destroyed) {
      streamDestroy.apply(void 0, _toConsumableArray(destroyArgs));
    }
    stream.emit('request', activeRequest);
    activeRequest.end();
  };
  stream.abort = function (err) {
    console.warn('`MinigetStream#abort()` has been deprecated in favor of `MinigetStream#destroy()`');
    stream.aborted = true;
    stream.emit('abort');
    stream.destroy(err);
  };
  var destroyArgs = [];
  var streamDestroy = function streamDestroy(err) {
    activeRequest.destroy(err);
    activeDecodedStream === null || activeDecodedStream === void 0 ? void 0 : activeDecodedStream.unpipe(stream);
    activeDecodedStream === null || activeDecodedStream === void 0 ? void 0 : activeDecodedStream.destroy();
    clearTimeout(retryTimeout);
  };
  stream._destroy = function () {
    stream.destroyed = true;
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }
    if (activeRequest) {
      streamDestroy.apply(void 0, args);
    } else {
      destroyArgs = args;
    }
  };
  stream.text = function () {
    return new Promise(function (resolve, reject) {
      var body = '';
      stream.setEncoding('utf8');
      stream.on('data', function (chunk) {
        return body += chunk;
      });
      stream.on('end', function () {
        return resolve(body);
      });
      stream.on('error', reject);
    });
  };
  process.nextTick(doDownload);
  return stream;
}
module.exports = Miniget;

/***/ }),

/***/ 8291:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
var hasMap = typeof Map === 'function' && Map.prototype;
var mapSizeDescriptor = Object.getOwnPropertyDescriptor && hasMap ? Object.getOwnPropertyDescriptor(Map.prototype, 'size') : null;
var mapSize = hasMap && mapSizeDescriptor && typeof mapSizeDescriptor.get === 'function' ? mapSizeDescriptor.get : null;
var mapForEach = hasMap && Map.prototype.forEach;
var hasSet = typeof Set === 'function' && Set.prototype;
var setSizeDescriptor = Object.getOwnPropertyDescriptor && hasSet ? Object.getOwnPropertyDescriptor(Set.prototype, 'size') : null;
var setSize = hasSet && setSizeDescriptor && typeof setSizeDescriptor.get === 'function' ? setSizeDescriptor.get : null;
var setForEach = hasSet && Set.prototype.forEach;
var hasWeakMap = typeof WeakMap === 'function' && WeakMap.prototype;
var weakMapHas = hasWeakMap ? WeakMap.prototype.has : null;
var hasWeakSet = typeof WeakSet === 'function' && WeakSet.prototype;
var weakSetHas = hasWeakSet ? WeakSet.prototype.has : null;
var hasWeakRef = typeof WeakRef === 'function' && WeakRef.prototype;
var weakRefDeref = hasWeakRef ? WeakRef.prototype.deref : null;
var booleanValueOf = Boolean.prototype.valueOf;
var objectToString = Object.prototype.toString;
var functionToString = Function.prototype.toString;
var $match = String.prototype.match;
var $slice = String.prototype.slice;
var $replace = String.prototype.replace;
var $toUpperCase = String.prototype.toUpperCase;
var $toLowerCase = String.prototype.toLowerCase;
var $test = RegExp.prototype.test;
var $concat = Array.prototype.concat;
var $join = Array.prototype.join;
var $arrSlice = Array.prototype.slice;
var $floor = Math.floor;
var bigIntValueOf = typeof BigInt === 'function' ? BigInt.prototype.valueOf : null;
var gOPS = Object.getOwnPropertySymbols;
var symToString = typeof Symbol === 'function' && _typeof(Symbol.iterator) === 'symbol' ? Symbol.prototype.toString : null;
var hasShammedSymbols = typeof Symbol === 'function' && _typeof(Symbol.iterator) === 'object';
// ie, `has-tostringtag/shams
var toStringTag = typeof Symbol === 'function' && Symbol.toStringTag && (_typeof(Symbol.toStringTag) === hasShammedSymbols ? 'object' : 'symbol') ? Symbol.toStringTag : null;
var isEnumerable = Object.prototype.propertyIsEnumerable;
var gPO = (typeof Reflect === 'function' ? Reflect.getPrototypeOf : Object.getPrototypeOf) || ([].__proto__ === Array.prototype // eslint-disable-line no-proto
? function (O) {
  return O.__proto__; // eslint-disable-line no-proto
} : null);
function addNumericSeparator(num, str) {
  if (num === Infinity || num === -Infinity || num !== num || num && num > -1000 && num < 1000 || $test.call(/e/, str)) {
    return str;
  }
  var sepRegex = /[0-9](?=(?:[0-9]{3})+(?![0-9]))/g;
  if (typeof num === 'number') {
    var _int = num < 0 ? -$floor(-num) : $floor(num); // trunc(num)
    if (_int !== num) {
      var intStr = String(_int);
      var dec = $slice.call(str, intStr.length + 1);
      return $replace.call(intStr, sepRegex, '$&_') + '.' + $replace.call($replace.call(dec, /([0-9]{3})/g, '$&_'), /_$/, '');
    }
  }
  return $replace.call(str, sepRegex, '$&_');
}
var utilInspect = __webpack_require__(4654);
var inspectCustom = utilInspect.custom;
var inspectSymbol = isSymbol(inspectCustom) ? inspectCustom : null;
module.exports = function inspect_(obj, options, depth, seen) {
  var opts = options || {};
  if (has(opts, 'quoteStyle') && opts.quoteStyle !== 'single' && opts.quoteStyle !== 'double') {
    throw new TypeError('option "quoteStyle" must be "single" or "double"');
  }
  if (has(opts, 'maxStringLength') && (typeof opts.maxStringLength === 'number' ? opts.maxStringLength < 0 && opts.maxStringLength !== Infinity : opts.maxStringLength !== null)) {
    throw new TypeError('option "maxStringLength", if provided, must be a positive integer, Infinity, or `null`');
  }
  var customInspect = has(opts, 'customInspect') ? opts.customInspect : true;
  if (typeof customInspect !== 'boolean' && customInspect !== 'symbol') {
    throw new TypeError('option "customInspect", if provided, must be `true`, `false`, or `\'symbol\'`');
  }
  if (has(opts, 'indent') && opts.indent !== null && opts.indent !== '\t' && !(parseInt(opts.indent, 10) === opts.indent && opts.indent > 0)) {
    throw new TypeError('option "indent" must be "\\t", an integer > 0, or `null`');
  }
  if (has(opts, 'numericSeparator') && typeof opts.numericSeparator !== 'boolean') {
    throw new TypeError('option "numericSeparator", if provided, must be `true` or `false`');
  }
  var numericSeparator = opts.numericSeparator;
  if (typeof obj === 'undefined') {
    return 'undefined';
  }
  if (obj === null) {
    return 'null';
  }
  if (typeof obj === 'boolean') {
    return obj ? 'true' : 'false';
  }
  if (typeof obj === 'string') {
    return inspectString(obj, opts);
  }
  if (typeof obj === 'number') {
    if (obj === 0) {
      return Infinity / obj > 0 ? '0' : '-0';
    }
    var str = String(obj);
    return numericSeparator ? addNumericSeparator(obj, str) : str;
  }
  if (typeof obj === 'bigint') {
    var bigIntStr = String(obj) + 'n';
    return numericSeparator ? addNumericSeparator(obj, bigIntStr) : bigIntStr;
  }
  var maxDepth = typeof opts.depth === 'undefined' ? 5 : opts.depth;
  if (typeof depth === 'undefined') {
    depth = 0;
  }
  if (depth >= maxDepth && maxDepth > 0 && _typeof(obj) === 'object') {
    return isArray(obj) ? '[Array]' : '[Object]';
  }
  var indent = getIndent(opts, depth);
  if (typeof seen === 'undefined') {
    seen = [];
  } else if (indexOf(seen, obj) >= 0) {
    return '[Circular]';
  }
  function inspect(value, from, noIndent) {
    if (from) {
      seen = $arrSlice.call(seen);
      seen.push(from);
    }
    if (noIndent) {
      var newOpts = {
        depth: opts.depth
      };
      if (has(opts, 'quoteStyle')) {
        newOpts.quoteStyle = opts.quoteStyle;
      }
      return inspect_(value, newOpts, depth + 1, seen);
    }
    return inspect_(value, opts, depth + 1, seen);
  }
  if (typeof obj === 'function' && !isRegExp(obj)) {
    // in older engines, regexes are callable
    var name = nameOf(obj);
    var keys = arrObjKeys(obj, inspect);
    return '[Function' + (name ? ': ' + name : ' (anonymous)') + ']' + (keys.length > 0 ? ' { ' + $join.call(keys, ', ') + ' }' : '');
  }
  if (isSymbol(obj)) {
    var symString = hasShammedSymbols ? $replace.call(String(obj), /^(Symbol\(.*\))_[^)]*$/, '$1') : symToString.call(obj);
    return _typeof(obj) === 'object' && !hasShammedSymbols ? markBoxed(symString) : symString;
  }
  if (isElement(obj)) {
    var s = '<' + $toLowerCase.call(String(obj.nodeName));
    var attrs = obj.attributes || [];
    for (var i = 0; i < attrs.length; i++) {
      s += ' ' + attrs[i].name + '=' + wrapQuotes(quote(attrs[i].value), 'double', opts);
    }
    s += '>';
    if (obj.childNodes && obj.childNodes.length) {
      s += '...';
    }
    s += '</' + $toLowerCase.call(String(obj.nodeName)) + '>';
    return s;
  }
  if (isArray(obj)) {
    if (obj.length === 0) {
      return '[]';
    }
    var xs = arrObjKeys(obj, inspect);
    if (indent && !singleLineValues(xs)) {
      return '[' + indentedJoin(xs, indent) + ']';
    }
    return '[ ' + $join.call(xs, ', ') + ' ]';
  }
  if (isError(obj)) {
    var parts = arrObjKeys(obj, inspect);
    if (!('cause' in Error.prototype) && 'cause' in obj && !isEnumerable.call(obj, 'cause')) {
      return '{ [' + String(obj) + '] ' + $join.call($concat.call('[cause]: ' + inspect(obj.cause), parts), ', ') + ' }';
    }
    if (parts.length === 0) {
      return '[' + String(obj) + ']';
    }
    return '{ [' + String(obj) + '] ' + $join.call(parts, ', ') + ' }';
  }
  if (_typeof(obj) === 'object' && customInspect) {
    if (inspectSymbol && typeof obj[inspectSymbol] === 'function' && utilInspect) {
      return utilInspect(obj, {
        depth: maxDepth - depth
      });
    } else if (customInspect !== 'symbol' && typeof obj.inspect === 'function') {
      return obj.inspect();
    }
  }
  if (isMap(obj)) {
    var mapParts = [];
    if (mapForEach) {
      mapForEach.call(obj, function (value, key) {
        mapParts.push(inspect(key, obj, true) + ' => ' + inspect(value, obj));
      });
    }
    return collectionOf('Map', mapSize.call(obj), mapParts, indent);
  }
  if (isSet(obj)) {
    var setParts = [];
    if (setForEach) {
      setForEach.call(obj, function (value) {
        setParts.push(inspect(value, obj));
      });
    }
    return collectionOf('Set', setSize.call(obj), setParts, indent);
  }
  if (isWeakMap(obj)) {
    return weakCollectionOf('WeakMap');
  }
  if (isWeakSet(obj)) {
    return weakCollectionOf('WeakSet');
  }
  if (isWeakRef(obj)) {
    return weakCollectionOf('WeakRef');
  }
  if (isNumber(obj)) {
    return markBoxed(inspect(Number(obj)));
  }
  if (isBigInt(obj)) {
    return markBoxed(inspect(bigIntValueOf.call(obj)));
  }
  if (isBoolean(obj)) {
    return markBoxed(booleanValueOf.call(obj));
  }
  if (isString(obj)) {
    return markBoxed(inspect(String(obj)));
  }
  // note: in IE 8, sometimes `global !== window` but both are the prototypes of each other
  /* eslint-env browser */
  if (typeof window !== 'undefined' && obj === window) {
    return '{ [object Window] }';
  }
  if (obj === __webpack_require__.g) {
    return '{ [object globalThis] }';
  }
  if (!isDate(obj) && !isRegExp(obj)) {
    var ys = arrObjKeys(obj, inspect);
    var isPlainObject = gPO ? gPO(obj) === Object.prototype : obj instanceof Object || obj.constructor === Object;
    var protoTag = obj instanceof Object ? '' : 'null prototype';
    var stringTag = !isPlainObject && toStringTag && Object(obj) === obj && toStringTag in obj ? $slice.call(toStr(obj), 8, -1) : protoTag ? 'Object' : '';
    var constructorTag = isPlainObject || typeof obj.constructor !== 'function' ? '' : obj.constructor.name ? obj.constructor.name + ' ' : '';
    var tag = constructorTag + (stringTag || protoTag ? '[' + $join.call($concat.call([], stringTag || [], protoTag || []), ': ') + '] ' : '');
    if (ys.length === 0) {
      return tag + '{}';
    }
    if (indent) {
      return tag + '{' + indentedJoin(ys, indent) + '}';
    }
    return tag + '{ ' + $join.call(ys, ', ') + ' }';
  }
  return String(obj);
};
function wrapQuotes(s, defaultStyle, opts) {
  var quoteChar = (opts.quoteStyle || defaultStyle) === 'double' ? '"' : "'";
  return quoteChar + s + quoteChar;
}
function quote(s) {
  return $replace.call(String(s), /"/g, '&quot;');
}
function isArray(obj) {
  return toStr(obj) === '[object Array]' && (!toStringTag || !(_typeof(obj) === 'object' && toStringTag in obj));
}
function isDate(obj) {
  return toStr(obj) === '[object Date]' && (!toStringTag || !(_typeof(obj) === 'object' && toStringTag in obj));
}
function isRegExp(obj) {
  return toStr(obj) === '[object RegExp]' && (!toStringTag || !(_typeof(obj) === 'object' && toStringTag in obj));
}
function isError(obj) {
  return toStr(obj) === '[object Error]' && (!toStringTag || !(_typeof(obj) === 'object' && toStringTag in obj));
}
function isString(obj) {
  return toStr(obj) === '[object String]' && (!toStringTag || !(_typeof(obj) === 'object' && toStringTag in obj));
}
function isNumber(obj) {
  return toStr(obj) === '[object Number]' && (!toStringTag || !(_typeof(obj) === 'object' && toStringTag in obj));
}
function isBoolean(obj) {
  return toStr(obj) === '[object Boolean]' && (!toStringTag || !(_typeof(obj) === 'object' && toStringTag in obj));
}

// Symbol and BigInt do have Symbol.toStringTag by spec, so that can't be used to eliminate false positives
function isSymbol(obj) {
  if (hasShammedSymbols) {
    return obj && _typeof(obj) === 'object' && obj instanceof Symbol;
  }
  if (_typeof(obj) === 'symbol') {
    return true;
  }
  if (!obj || _typeof(obj) !== 'object' || !symToString) {
    return false;
  }
  try {
    symToString.call(obj);
    return true;
  } catch (e) {}
  return false;
}
function isBigInt(obj) {
  if (!obj || _typeof(obj) !== 'object' || !bigIntValueOf) {
    return false;
  }
  try {
    bigIntValueOf.call(obj);
    return true;
  } catch (e) {}
  return false;
}
var hasOwn = Object.prototype.hasOwnProperty || function (key) {
  return key in this;
};
function has(obj, key) {
  return hasOwn.call(obj, key);
}
function toStr(obj) {
  return objectToString.call(obj);
}
function nameOf(f) {
  if (f.name) {
    return f.name;
  }
  var m = $match.call(functionToString.call(f), /^function\s*([\w$]+)/);
  if (m) {
    return m[1];
  }
  return null;
}
function indexOf(xs, x) {
  if (xs.indexOf) {
    return xs.indexOf(x);
  }
  for (var i = 0, l = xs.length; i < l; i++) {
    if (xs[i] === x) {
      return i;
    }
  }
  return -1;
}
function isMap(x) {
  if (!mapSize || !x || _typeof(x) !== 'object') {
    return false;
  }
  try {
    mapSize.call(x);
    try {
      setSize.call(x);
    } catch (s) {
      return true;
    }
    return x instanceof Map; // core-js workaround, pre-v2.5.0
  } catch (e) {}
  return false;
}
function isWeakMap(x) {
  if (!weakMapHas || !x || _typeof(x) !== 'object') {
    return false;
  }
  try {
    weakMapHas.call(x, weakMapHas);
    try {
      weakSetHas.call(x, weakSetHas);
    } catch (s) {
      return true;
    }
    return x instanceof WeakMap; // core-js workaround, pre-v2.5.0
  } catch (e) {}
  return false;
}
function isWeakRef(x) {
  if (!weakRefDeref || !x || _typeof(x) !== 'object') {
    return false;
  }
  try {
    weakRefDeref.call(x);
    return true;
  } catch (e) {}
  return false;
}
function isSet(x) {
  if (!setSize || !x || _typeof(x) !== 'object') {
    return false;
  }
  try {
    setSize.call(x);
    try {
      mapSize.call(x);
    } catch (m) {
      return true;
    }
    return x instanceof Set; // core-js workaround, pre-v2.5.0
  } catch (e) {}
  return false;
}
function isWeakSet(x) {
  if (!weakSetHas || !x || _typeof(x) !== 'object') {
    return false;
  }
  try {
    weakSetHas.call(x, weakSetHas);
    try {
      weakMapHas.call(x, weakMapHas);
    } catch (s) {
      return true;
    }
    return x instanceof WeakSet; // core-js workaround, pre-v2.5.0
  } catch (e) {}
  return false;
}
function isElement(x) {
  if (!x || _typeof(x) !== 'object') {
    return false;
  }
  if (typeof HTMLElement !== 'undefined' && x instanceof HTMLElement) {
    return true;
  }
  return typeof x.nodeName === 'string' && typeof x.getAttribute === 'function';
}
function inspectString(str, opts) {
  if (str.length > opts.maxStringLength) {
    var remaining = str.length - opts.maxStringLength;
    var trailer = '... ' + remaining + ' more character' + (remaining > 1 ? 's' : '');
    return inspectString($slice.call(str, 0, opts.maxStringLength), opts) + trailer;
  }
  // eslint-disable-next-line no-control-regex
  var s = $replace.call($replace.call(str, /(['\\])/g, '\\$1'), /[\x00-\x1f]/g, lowbyte);
  return wrapQuotes(s, 'single', opts);
}
function lowbyte(c) {
  var n = c.charCodeAt(0);
  var x = {
    8: 'b',
    9: 't',
    10: 'n',
    12: 'f',
    13: 'r'
  }[n];
  if (x) {
    return '\\' + x;
  }
  return '\\x' + (n < 0x10 ? '0' : '') + $toUpperCase.call(n.toString(16));
}
function markBoxed(str) {
  return 'Object(' + str + ')';
}
function weakCollectionOf(type) {
  return type + ' { ? }';
}
function collectionOf(type, size, entries, indent) {
  var joinedEntries = indent ? indentedJoin(entries, indent) : $join.call(entries, ', ');
  return type + ' (' + size + ') {' + joinedEntries + '}';
}
function singleLineValues(xs) {
  for (var i = 0; i < xs.length; i++) {
    if (indexOf(xs[i], '\n') >= 0) {
      return false;
    }
  }
  return true;
}
function getIndent(opts, depth) {
  var baseIndent;
  if (opts.indent === '\t') {
    baseIndent = '\t';
  } else if (typeof opts.indent === 'number' && opts.indent > 0) {
    baseIndent = $join.call(Array(opts.indent + 1), ' ');
  } else {
    return null;
  }
  return {
    base: baseIndent,
    prev: $join.call(Array(depth + 1), baseIndent)
  };
}
function indentedJoin(xs, indent) {
  if (xs.length === 0) {
    return '';
  }
  var lineJoiner = '\n' + indent.prev + indent.base;
  return lineJoiner + $join.call(xs, ',' + lineJoiner) + '\n' + indent.prev;
}
function arrObjKeys(obj, inspect) {
  var isArr = isArray(obj);
  var xs = [];
  if (isArr) {
    xs.length = obj.length;
    for (var i = 0; i < obj.length; i++) {
      xs[i] = has(obj, i) ? inspect(obj[i], obj) : '';
    }
  }
  var syms = typeof gOPS === 'function' ? gOPS(obj) : [];
  var symMap;
  if (hasShammedSymbols) {
    symMap = {};
    for (var k = 0; k < syms.length; k++) {
      symMap['$' + syms[k]] = syms[k];
    }
  }
  for (var key in obj) {
    // eslint-disable-line no-restricted-syntax
    if (!has(obj, key)) {
      continue;
    } // eslint-disable-line no-restricted-syntax, no-continue
    if (isArr && String(Number(key)) === key && key < obj.length) {
      continue;
    } // eslint-disable-line no-restricted-syntax, no-continue
    if (hasShammedSymbols && symMap['$' + key] instanceof Symbol) {
      // this is to prevent shammed Symbols, which are stored as strings, from being included in the string key section
      continue; // eslint-disable-line no-restricted-syntax, no-continue
    } else if ($test.call(/[^\w$]/, key)) {
      xs.push(inspect(key, obj) + ': ' + inspect(obj[key], obj));
    } else {
      xs.push(key + ': ' + inspect(obj[key], obj));
    }
  }
  if (typeof gOPS === 'function') {
    for (var j = 0; j < syms.length; j++) {
      if (isEnumerable.call(obj, syms[j])) {
        xs.push('[' + inspect(syms[j]) + ']: ' + inspect(obj[syms[j]], obj));
      }
    }
  }
  return xs;
}

/***/ }),

/***/ 2790:
/***/ ((module) => {

// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;
function defaultSetTimout() {
  throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout() {
  throw new Error('clearTimeout has not been defined');
}
(function () {
  try {
    if (typeof setTimeout === 'function') {
      cachedSetTimeout = setTimeout;
    } else {
      cachedSetTimeout = defaultSetTimout;
    }
  } catch (e) {
    cachedSetTimeout = defaultSetTimout;
  }
  try {
    if (typeof clearTimeout === 'function') {
      cachedClearTimeout = clearTimeout;
    } else {
      cachedClearTimeout = defaultClearTimeout;
    }
  } catch (e) {
    cachedClearTimeout = defaultClearTimeout;
  }
})();
function runTimeout(fun) {
  if (cachedSetTimeout === setTimeout) {
    //normal enviroments in sane situations
    return setTimeout(fun, 0);
  }
  // if setTimeout wasn't available but was latter defined
  if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
    cachedSetTimeout = setTimeout;
    return setTimeout(fun, 0);
  }
  try {
    // when when somebody has screwed with setTimeout but no I.E. maddness
    return cachedSetTimeout(fun, 0);
  } catch (e) {
    try {
      // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
      return cachedSetTimeout.call(null, fun, 0);
    } catch (e) {
      // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
      return cachedSetTimeout.call(this, fun, 0);
    }
  }
}
function runClearTimeout(marker) {
  if (cachedClearTimeout === clearTimeout) {
    //normal enviroments in sane situations
    return clearTimeout(marker);
  }
  // if clearTimeout wasn't available but was latter defined
  if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
    cachedClearTimeout = clearTimeout;
    return clearTimeout(marker);
  }
  try {
    // when when somebody has screwed with setTimeout but no I.E. maddness
    return cachedClearTimeout(marker);
  } catch (e) {
    try {
      // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
      return cachedClearTimeout.call(null, marker);
    } catch (e) {
      // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
      // Some versions of I.E. have different rules for clearTimeout vs setTimeout
      return cachedClearTimeout.call(this, marker);
    }
  }
}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;
function cleanUpNextTick() {
  if (!draining || !currentQueue) {
    return;
  }
  draining = false;
  if (currentQueue.length) {
    queue = currentQueue.concat(queue);
  } else {
    queueIndex = -1;
  }
  if (queue.length) {
    drainQueue();
  }
}
function drainQueue() {
  if (draining) {
    return;
  }
  var timeout = runTimeout(cleanUpNextTick);
  draining = true;
  var len = queue.length;
  while (len) {
    currentQueue = queue;
    queue = [];
    while (++queueIndex < len) {
      if (currentQueue) {
        currentQueue[queueIndex].run();
      }
    }
    queueIndex = -1;
    len = queue.length;
  }
  currentQueue = null;
  draining = false;
  runClearTimeout(timeout);
}
process.nextTick = function (fun) {
  var args = new Array(arguments.length - 1);
  if (arguments.length > 1) {
    for (var i = 1; i < arguments.length; i++) {
      args[i - 1] = arguments[i];
    }
  }
  queue.push(new Item(fun, args));
  if (queue.length === 1 && !draining) {
    runTimeout(drainQueue);
  }
};

// v8 likes predictible objects
function Item(fun, array) {
  this.fun = fun;
  this.array = array;
}
Item.prototype.run = function () {
  this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};
function noop() {}
process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;
process.listeners = function (name) {
  return [];
};
process.binding = function (name) {
  throw new Error('process.binding is not supported');
};
process.cwd = function () {
  return '/';
};
process.chdir = function (dir) {
  throw new Error('process.chdir is not supported');
};
process.umask = function () {
  return 0;
};

/***/ }),

/***/ 2280:
/***/ ((module) => {

"use strict";


var replace = String.prototype.replace;
var percentTwenties = /%20/g;
var Format = {
  RFC1738: 'RFC1738',
  RFC3986: 'RFC3986'
};
module.exports = {
  'default': Format.RFC3986,
  formatters: {
    RFC1738: function RFC1738(value) {
      return replace.call(value, percentTwenties, '+');
    },
    RFC3986: function RFC3986(value) {
      return String(value);
    }
  },
  RFC1738: Format.RFC1738,
  RFC3986: Format.RFC3986
};

/***/ }),

/***/ 520:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var stringify = __webpack_require__(535);
var parse = __webpack_require__(8503);
var formats = __webpack_require__(2280);
module.exports = {
  formats: formats,
  parse: parse,
  stringify: stringify
};

/***/ }),

/***/ 8503:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var utils = __webpack_require__(3706);
var has = Object.prototype.hasOwnProperty;
var isArray = Array.isArray;
var defaults = {
  allowDots: false,
  allowPrototypes: false,
  allowSparse: false,
  arrayLimit: 20,
  charset: 'utf-8',
  charsetSentinel: false,
  comma: false,
  decoder: utils.decode,
  delimiter: '&',
  depth: 5,
  ignoreQueryPrefix: false,
  interpretNumericEntities: false,
  parameterLimit: 1000,
  parseArrays: true,
  plainObjects: false,
  strictNullHandling: false
};
var interpretNumericEntities = function interpretNumericEntities(str) {
  return str.replace(/&#(\d+);/g, function ($0, numberStr) {
    return String.fromCharCode(parseInt(numberStr, 10));
  });
};
var parseArrayValue = function parseArrayValue(val, options) {
  if (val && typeof val === 'string' && options.comma && val.indexOf(',') > -1) {
    return val.split(',');
  }
  return val;
};

// This is what browsers will submit when the ✓ character occurs in an
// application/x-www-form-urlencoded body and the encoding of the page containing
// the form is iso-8859-1, or when the submitted form has an accept-charset
// attribute of iso-8859-1. Presumably also with other charsets that do not contain
// the ✓ character, such as us-ascii.
var isoSentinel = 'utf8=%26%2310003%3B'; // encodeURIComponent('&#10003;')

// These are the percent-encoded utf-8 octets representing a checkmark, indicating that the request actually is utf-8 encoded.
var charsetSentinel = 'utf8=%E2%9C%93'; // encodeURIComponent('✓')

var parseValues = function parseQueryStringValues(str, options) {
  var obj = {
    __proto__: null
  };
  var cleanStr = options.ignoreQueryPrefix ? str.replace(/^\?/, '') : str;
  var limit = options.parameterLimit === Infinity ? undefined : options.parameterLimit;
  var parts = cleanStr.split(options.delimiter, limit);
  var skipIndex = -1; // Keep track of where the utf8 sentinel was found
  var i;
  var charset = options.charset;
  if (options.charsetSentinel) {
    for (i = 0; i < parts.length; ++i) {
      if (parts[i].indexOf('utf8=') === 0) {
        if (parts[i] === charsetSentinel) {
          charset = 'utf-8';
        } else if (parts[i] === isoSentinel) {
          charset = 'iso-8859-1';
        }
        skipIndex = i;
        i = parts.length; // The eslint settings do not allow break;
      }
    }
  }

  for (i = 0; i < parts.length; ++i) {
    if (i === skipIndex) {
      continue;
    }
    var part = parts[i];
    var bracketEqualsPos = part.indexOf(']=');
    var pos = bracketEqualsPos === -1 ? part.indexOf('=') : bracketEqualsPos + 1;
    var key, val;
    if (pos === -1) {
      key = options.decoder(part, defaults.decoder, charset, 'key');
      val = options.strictNullHandling ? null : '';
    } else {
      key = options.decoder(part.slice(0, pos), defaults.decoder, charset, 'key');
      val = utils.maybeMap(parseArrayValue(part.slice(pos + 1), options), function (encodedVal) {
        return options.decoder(encodedVal, defaults.decoder, charset, 'value');
      });
    }
    if (val && options.interpretNumericEntities && charset === 'iso-8859-1') {
      val = interpretNumericEntities(val);
    }
    if (part.indexOf('[]=') > -1) {
      val = isArray(val) ? [val] : val;
    }
    if (has.call(obj, key)) {
      obj[key] = utils.combine(obj[key], val);
    } else {
      obj[key] = val;
    }
  }
  return obj;
};
var parseObject = function parseObject(chain, val, options, valuesParsed) {
  var leaf = valuesParsed ? val : parseArrayValue(val, options);
  for (var i = chain.length - 1; i >= 0; --i) {
    var obj;
    var root = chain[i];
    if (root === '[]' && options.parseArrays) {
      obj = [].concat(leaf);
    } else {
      obj = options.plainObjects ? Object.create(null) : {};
      var cleanRoot = root.charAt(0) === '[' && root.charAt(root.length - 1) === ']' ? root.slice(1, -1) : root;
      var index = parseInt(cleanRoot, 10);
      if (!options.parseArrays && cleanRoot === '') {
        obj = {
          0: leaf
        };
      } else if (!isNaN(index) && root !== cleanRoot && String(index) === cleanRoot && index >= 0 && options.parseArrays && index <= options.arrayLimit) {
        obj = [];
        obj[index] = leaf;
      } else if (cleanRoot !== '__proto__') {
        obj[cleanRoot] = leaf;
      }
    }
    leaf = obj;
  }
  return leaf;
};
var parseKeys = function parseQueryStringKeys(givenKey, val, options, valuesParsed) {
  if (!givenKey) {
    return;
  }

  // Transform dot notation to bracket notation
  var key = options.allowDots ? givenKey.replace(/\.([^.[]+)/g, '[$1]') : givenKey;

  // The regex chunks

  var brackets = /(\[[^[\]]*])/;
  var child = /(\[[^[\]]*])/g;

  // Get the parent

  var segment = options.depth > 0 && brackets.exec(key);
  var parent = segment ? key.slice(0, segment.index) : key;

  // Stash the parent if it exists

  var keys = [];
  if (parent) {
    // If we aren't using plain objects, optionally prefix keys that would overwrite object prototype properties
    if (!options.plainObjects && has.call(Object.prototype, parent)) {
      if (!options.allowPrototypes) {
        return;
      }
    }
    keys.push(parent);
  }

  // Loop through children appending to the array until we hit depth

  var i = 0;
  while (options.depth > 0 && (segment = child.exec(key)) !== null && i < options.depth) {
    i += 1;
    if (!options.plainObjects && has.call(Object.prototype, segment[1].slice(1, -1))) {
      if (!options.allowPrototypes) {
        return;
      }
    }
    keys.push(segment[1]);
  }

  // If there's a remainder, just add whatever is left

  if (segment) {
    keys.push('[' + key.slice(segment.index) + ']');
  }
  return parseObject(keys, val, options, valuesParsed);
};
var normalizeParseOptions = function normalizeParseOptions(opts) {
  if (!opts) {
    return defaults;
  }
  if (opts.decoder !== null && opts.decoder !== undefined && typeof opts.decoder !== 'function') {
    throw new TypeError('Decoder has to be a function.');
  }
  if (typeof opts.charset !== 'undefined' && opts.charset !== 'utf-8' && opts.charset !== 'iso-8859-1') {
    throw new TypeError('The charset option must be either utf-8, iso-8859-1, or undefined');
  }
  var charset = typeof opts.charset === 'undefined' ? defaults.charset : opts.charset;
  return {
    allowDots: typeof opts.allowDots === 'undefined' ? defaults.allowDots : !!opts.allowDots,
    allowPrototypes: typeof opts.allowPrototypes === 'boolean' ? opts.allowPrototypes : defaults.allowPrototypes,
    allowSparse: typeof opts.allowSparse === 'boolean' ? opts.allowSparse : defaults.allowSparse,
    arrayLimit: typeof opts.arrayLimit === 'number' ? opts.arrayLimit : defaults.arrayLimit,
    charset: charset,
    charsetSentinel: typeof opts.charsetSentinel === 'boolean' ? opts.charsetSentinel : defaults.charsetSentinel,
    comma: typeof opts.comma === 'boolean' ? opts.comma : defaults.comma,
    decoder: typeof opts.decoder === 'function' ? opts.decoder : defaults.decoder,
    delimiter: typeof opts.delimiter === 'string' || utils.isRegExp(opts.delimiter) ? opts.delimiter : defaults.delimiter,
    // eslint-disable-next-line no-implicit-coercion, no-extra-parens
    depth: typeof opts.depth === 'number' || opts.depth === false ? +opts.depth : defaults.depth,
    ignoreQueryPrefix: opts.ignoreQueryPrefix === true,
    interpretNumericEntities: typeof opts.interpretNumericEntities === 'boolean' ? opts.interpretNumericEntities : defaults.interpretNumericEntities,
    parameterLimit: typeof opts.parameterLimit === 'number' ? opts.parameterLimit : defaults.parameterLimit,
    parseArrays: opts.parseArrays !== false,
    plainObjects: typeof opts.plainObjects === 'boolean' ? opts.plainObjects : defaults.plainObjects,
    strictNullHandling: typeof opts.strictNullHandling === 'boolean' ? opts.strictNullHandling : defaults.strictNullHandling
  };
};
module.exports = function (str, opts) {
  var options = normalizeParseOptions(opts);
  if (str === '' || str === null || typeof str === 'undefined') {
    return options.plainObjects ? Object.create(null) : {};
  }
  var tempObj = typeof str === 'string' ? parseValues(str, options) : str;
  var obj = options.plainObjects ? Object.create(null) : {};

  // Iterate over the keys and setup the new object

  var keys = Object.keys(tempObj);
  for (var i = 0; i < keys.length; ++i) {
    var key = keys[i];
    var newObj = parseKeys(key, tempObj[key], options, typeof str === 'string');
    obj = utils.merge(obj, newObj, options);
  }
  if (options.allowSparse === true) {
    return obj;
  }
  return utils.compact(obj);
};

/***/ }),

/***/ 535:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
var getSideChannel = __webpack_require__(705);
var utils = __webpack_require__(3706);
var formats = __webpack_require__(2280);
var has = Object.prototype.hasOwnProperty;
var arrayPrefixGenerators = {
  brackets: function brackets(prefix) {
    return prefix + '[]';
  },
  comma: 'comma',
  indices: function indices(prefix, key) {
    return prefix + '[' + key + ']';
  },
  repeat: function repeat(prefix) {
    return prefix;
  }
};
var isArray = Array.isArray;
var push = Array.prototype.push;
var pushToArray = function pushToArray(arr, valueOrArray) {
  push.apply(arr, isArray(valueOrArray) ? valueOrArray : [valueOrArray]);
};
var toISO = Date.prototype.toISOString;
var defaultFormat = formats['default'];
var defaults = {
  addQueryPrefix: false,
  allowDots: false,
  charset: 'utf-8',
  charsetSentinel: false,
  delimiter: '&',
  encode: true,
  encoder: utils.encode,
  encodeValuesOnly: false,
  format: defaultFormat,
  formatter: formats.formatters[defaultFormat],
  // deprecated
  indices: false,
  serializeDate: function serializeDate(date) {
    return toISO.call(date);
  },
  skipNulls: false,
  strictNullHandling: false
};
var isNonNullishPrimitive = function isNonNullishPrimitive(v) {
  return typeof v === 'string' || typeof v === 'number' || typeof v === 'boolean' || _typeof(v) === 'symbol' || typeof v === 'bigint';
};
var sentinel = {};
var stringify = function stringify(object, prefix, generateArrayPrefix, commaRoundTrip, strictNullHandling, skipNulls, encoder, filter, sort, allowDots, serializeDate, format, formatter, encodeValuesOnly, charset, sideChannel) {
  var obj = object;
  var tmpSc = sideChannel;
  var step = 0;
  var findFlag = false;
  while ((tmpSc = tmpSc.get(sentinel)) !== void undefined && !findFlag) {
    // Where object last appeared in the ref tree
    var pos = tmpSc.get(object);
    step += 1;
    if (typeof pos !== 'undefined') {
      if (pos === step) {
        throw new RangeError('Cyclic object value');
      } else {
        findFlag = true; // Break while
      }
    }

    if (typeof tmpSc.get(sentinel) === 'undefined') {
      step = 0;
    }
  }
  if (typeof filter === 'function') {
    obj = filter(prefix, obj);
  } else if (obj instanceof Date) {
    obj = serializeDate(obj);
  } else if (generateArrayPrefix === 'comma' && isArray(obj)) {
    obj = utils.maybeMap(obj, function (value) {
      if (value instanceof Date) {
        return serializeDate(value);
      }
      return value;
    });
  }
  if (obj === null) {
    if (strictNullHandling) {
      return encoder && !encodeValuesOnly ? encoder(prefix, defaults.encoder, charset, 'key', format) : prefix;
    }
    obj = '';
  }
  if (isNonNullishPrimitive(obj) || utils.isBuffer(obj)) {
    if (encoder) {
      var keyValue = encodeValuesOnly ? prefix : encoder(prefix, defaults.encoder, charset, 'key', format);
      return [formatter(keyValue) + '=' + formatter(encoder(obj, defaults.encoder, charset, 'value', format))];
    }
    return [formatter(prefix) + '=' + formatter(String(obj))];
  }
  var values = [];
  if (typeof obj === 'undefined') {
    return values;
  }
  var objKeys;
  if (generateArrayPrefix === 'comma' && isArray(obj)) {
    // we need to join elements in
    if (encodeValuesOnly && encoder) {
      obj = utils.maybeMap(obj, encoder);
    }
    objKeys = [{
      value: obj.length > 0 ? obj.join(',') || null : void undefined
    }];
  } else if (isArray(filter)) {
    objKeys = filter;
  } else {
    var keys = Object.keys(obj);
    objKeys = sort ? keys.sort(sort) : keys;
  }
  var adjustedPrefix = commaRoundTrip && isArray(obj) && obj.length === 1 ? prefix + '[]' : prefix;
  for (var j = 0; j < objKeys.length; ++j) {
    var key = objKeys[j];
    var value = _typeof(key) === 'object' && typeof key.value !== 'undefined' ? key.value : obj[key];
    if (skipNulls && value === null) {
      continue;
    }
    var keyPrefix = isArray(obj) ? typeof generateArrayPrefix === 'function' ? generateArrayPrefix(adjustedPrefix, key) : adjustedPrefix : adjustedPrefix + (allowDots ? '.' + key : '[' + key + ']');
    sideChannel.set(object, step);
    var valueSideChannel = getSideChannel();
    valueSideChannel.set(sentinel, sideChannel);
    pushToArray(values, stringify(value, keyPrefix, generateArrayPrefix, commaRoundTrip, strictNullHandling, skipNulls, generateArrayPrefix === 'comma' && encodeValuesOnly && isArray(obj) ? null : encoder, filter, sort, allowDots, serializeDate, format, formatter, encodeValuesOnly, charset, valueSideChannel));
  }
  return values;
};
var normalizeStringifyOptions = function normalizeStringifyOptions(opts) {
  if (!opts) {
    return defaults;
  }
  if (opts.encoder !== null && typeof opts.encoder !== 'undefined' && typeof opts.encoder !== 'function') {
    throw new TypeError('Encoder has to be a function.');
  }
  var charset = opts.charset || defaults.charset;
  if (typeof opts.charset !== 'undefined' && opts.charset !== 'utf-8' && opts.charset !== 'iso-8859-1') {
    throw new TypeError('The charset option must be either utf-8, iso-8859-1, or undefined');
  }
  var format = formats['default'];
  if (typeof opts.format !== 'undefined') {
    if (!has.call(formats.formatters, opts.format)) {
      throw new TypeError('Unknown format option provided.');
    }
    format = opts.format;
  }
  var formatter = formats.formatters[format];
  var filter = defaults.filter;
  if (typeof opts.filter === 'function' || isArray(opts.filter)) {
    filter = opts.filter;
  }
  return {
    addQueryPrefix: typeof opts.addQueryPrefix === 'boolean' ? opts.addQueryPrefix : defaults.addQueryPrefix,
    allowDots: typeof opts.allowDots === 'undefined' ? defaults.allowDots : !!opts.allowDots,
    charset: charset,
    charsetSentinel: typeof opts.charsetSentinel === 'boolean' ? opts.charsetSentinel : defaults.charsetSentinel,
    delimiter: typeof opts.delimiter === 'undefined' ? defaults.delimiter : opts.delimiter,
    encode: typeof opts.encode === 'boolean' ? opts.encode : defaults.encode,
    encoder: typeof opts.encoder === 'function' ? opts.encoder : defaults.encoder,
    encodeValuesOnly: typeof opts.encodeValuesOnly === 'boolean' ? opts.encodeValuesOnly : defaults.encodeValuesOnly,
    filter: filter,
    format: format,
    formatter: formatter,
    serializeDate: typeof opts.serializeDate === 'function' ? opts.serializeDate : defaults.serializeDate,
    skipNulls: typeof opts.skipNulls === 'boolean' ? opts.skipNulls : defaults.skipNulls,
    sort: typeof opts.sort === 'function' ? opts.sort : null,
    strictNullHandling: typeof opts.strictNullHandling === 'boolean' ? opts.strictNullHandling : defaults.strictNullHandling
  };
};
module.exports = function (object, opts) {
  var obj = object;
  var options = normalizeStringifyOptions(opts);
  var objKeys;
  var filter;
  if (typeof options.filter === 'function') {
    filter = options.filter;
    obj = filter('', obj);
  } else if (isArray(options.filter)) {
    filter = options.filter;
    objKeys = filter;
  }
  var keys = [];
  if (_typeof(obj) !== 'object' || obj === null) {
    return '';
  }
  var arrayFormat;
  if (opts && opts.arrayFormat in arrayPrefixGenerators) {
    arrayFormat = opts.arrayFormat;
  } else if (opts && 'indices' in opts) {
    arrayFormat = opts.indices ? 'indices' : 'repeat';
  } else {
    arrayFormat = 'indices';
  }
  var generateArrayPrefix = arrayPrefixGenerators[arrayFormat];
  if (opts && 'commaRoundTrip' in opts && typeof opts.commaRoundTrip !== 'boolean') {
    throw new TypeError('`commaRoundTrip` must be a boolean, or absent');
  }
  var commaRoundTrip = generateArrayPrefix === 'comma' && opts && opts.commaRoundTrip;
  if (!objKeys) {
    objKeys = Object.keys(obj);
  }
  if (options.sort) {
    objKeys.sort(options.sort);
  }
  var sideChannel = getSideChannel();
  for (var i = 0; i < objKeys.length; ++i) {
    var key = objKeys[i];
    if (options.skipNulls && obj[key] === null) {
      continue;
    }
    pushToArray(keys, stringify(obj[key], key, generateArrayPrefix, commaRoundTrip, options.strictNullHandling, options.skipNulls, options.encode ? options.encoder : null, options.filter, options.sort, options.allowDots, options.serializeDate, options.format, options.formatter, options.encodeValuesOnly, options.charset, sideChannel));
  }
  var joined = keys.join(options.delimiter);
  var prefix = options.addQueryPrefix === true ? '?' : '';
  if (options.charsetSentinel) {
    if (options.charset === 'iso-8859-1') {
      // encodeURIComponent('&#10003;'), the "numeric entity" representation of a checkmark
      prefix += 'utf8=%26%2310003%3B&';
    } else {
      // encodeURIComponent('✓')
      prefix += 'utf8=%E2%9C%93&';
    }
  }
  return joined.length > 0 ? prefix + joined : '';
};

/***/ }),

/***/ 3706:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
var formats = __webpack_require__(2280);
var has = Object.prototype.hasOwnProperty;
var isArray = Array.isArray;
var hexTable = function () {
  var array = [];
  for (var i = 0; i < 256; ++i) {
    array.push('%' + ((i < 16 ? '0' : '') + i.toString(16)).toUpperCase());
  }
  return array;
}();
var compactQueue = function compactQueue(queue) {
  while (queue.length > 1) {
    var item = queue.pop();
    var obj = item.obj[item.prop];
    if (isArray(obj)) {
      var compacted = [];
      for (var j = 0; j < obj.length; ++j) {
        if (typeof obj[j] !== 'undefined') {
          compacted.push(obj[j]);
        }
      }
      item.obj[item.prop] = compacted;
    }
  }
};
var arrayToObject = function arrayToObject(source, options) {
  var obj = options && options.plainObjects ? Object.create(null) : {};
  for (var i = 0; i < source.length; ++i) {
    if (typeof source[i] !== 'undefined') {
      obj[i] = source[i];
    }
  }
  return obj;
};
var merge = function merge(target, source, options) {
  /* eslint no-param-reassign: 0 */
  if (!source) {
    return target;
  }
  if (_typeof(source) !== 'object') {
    if (isArray(target)) {
      target.push(source);
    } else if (target && _typeof(target) === 'object') {
      if (options && (options.plainObjects || options.allowPrototypes) || !has.call(Object.prototype, source)) {
        target[source] = true;
      }
    } else {
      return [target, source];
    }
    return target;
  }
  if (!target || _typeof(target) !== 'object') {
    return [target].concat(source);
  }
  var mergeTarget = target;
  if (isArray(target) && !isArray(source)) {
    mergeTarget = arrayToObject(target, options);
  }
  if (isArray(target) && isArray(source)) {
    source.forEach(function (item, i) {
      if (has.call(target, i)) {
        var targetItem = target[i];
        if (targetItem && _typeof(targetItem) === 'object' && item && _typeof(item) === 'object') {
          target[i] = merge(targetItem, item, options);
        } else {
          target.push(item);
        }
      } else {
        target[i] = item;
      }
    });
    return target;
  }
  return Object.keys(source).reduce(function (acc, key) {
    var value = source[key];
    if (has.call(acc, key)) {
      acc[key] = merge(acc[key], value, options);
    } else {
      acc[key] = value;
    }
    return acc;
  }, mergeTarget);
};
var assign = function assignSingleSource(target, source) {
  return Object.keys(source).reduce(function (acc, key) {
    acc[key] = source[key];
    return acc;
  }, target);
};
var decode = function decode(str, decoder, charset) {
  var strWithoutPlus = str.replace(/\+/g, ' ');
  if (charset === 'iso-8859-1') {
    // unescape never throws, no try...catch needed:
    return strWithoutPlus.replace(/%[0-9a-f]{2}/gi, unescape);
  }
  // utf-8
  try {
    return decodeURIComponent(strWithoutPlus);
  } catch (e) {
    return strWithoutPlus;
  }
};
var encode = function encode(str, defaultEncoder, charset, kind, format) {
  // This code was originally written by Brian White (mscdex) for the io.js core querystring library.
  // It has been adapted here for stricter adherence to RFC 3986
  if (str.length === 0) {
    return str;
  }
  var string = str;
  if (_typeof(str) === 'symbol') {
    string = Symbol.prototype.toString.call(str);
  } else if (typeof str !== 'string') {
    string = String(str);
  }
  if (charset === 'iso-8859-1') {
    return escape(string).replace(/%u[0-9a-f]{4}/gi, function ($0) {
      return '%26%23' + parseInt($0.slice(2), 16) + '%3B';
    });
  }
  var out = '';
  for (var i = 0; i < string.length; ++i) {
    var c = string.charCodeAt(i);
    if (c === 0x2D // -
    || c === 0x2E // .
    || c === 0x5F // _
    || c === 0x7E // ~
    || c >= 0x30 && c <= 0x39 // 0-9
    || c >= 0x41 && c <= 0x5A // a-z
    || c >= 0x61 && c <= 0x7A // A-Z
    || format === formats.RFC1738 && (c === 0x28 || c === 0x29) // ( )
    ) {
      out += string.charAt(i);
      continue;
    }
    if (c < 0x80) {
      out = out + hexTable[c];
      continue;
    }
    if (c < 0x800) {
      out = out + (hexTable[0xC0 | c >> 6] + hexTable[0x80 | c & 0x3F]);
      continue;
    }
    if (c < 0xD800 || c >= 0xE000) {
      out = out + (hexTable[0xE0 | c >> 12] + hexTable[0x80 | c >> 6 & 0x3F] + hexTable[0x80 | c & 0x3F]);
      continue;
    }
    i += 1;
    c = 0x10000 + ((c & 0x3FF) << 10 | string.charCodeAt(i) & 0x3FF);
    /* eslint operator-linebreak: [2, "before"] */
    out += hexTable[0xF0 | c >> 18] + hexTable[0x80 | c >> 12 & 0x3F] + hexTable[0x80 | c >> 6 & 0x3F] + hexTable[0x80 | c & 0x3F];
  }
  return out;
};
var compact = function compact(value) {
  var queue = [{
    obj: {
      o: value
    },
    prop: 'o'
  }];
  var refs = [];
  for (var i = 0; i < queue.length; ++i) {
    var item = queue[i];
    var obj = item.obj[item.prop];
    var keys = Object.keys(obj);
    for (var j = 0; j < keys.length; ++j) {
      var key = keys[j];
      var val = obj[key];
      if (_typeof(val) === 'object' && val !== null && refs.indexOf(val) === -1) {
        queue.push({
          obj: obj,
          prop: key
        });
        refs.push(val);
      }
    }
  }
  compactQueue(queue);
  return value;
};
var isRegExp = function isRegExp(obj) {
  return Object.prototype.toString.call(obj) === '[object RegExp]';
};
var isBuffer = function isBuffer(obj) {
  if (!obj || _typeof(obj) !== 'object') {
    return false;
  }
  return !!(obj.constructor && obj.constructor.isBuffer && obj.constructor.isBuffer(obj));
};
var combine = function combine(a, b) {
  return [].concat(a, b);
};
var maybeMap = function maybeMap(val, fn) {
  if (isArray(val)) {
    var mapped = [];
    for (var i = 0; i < val.length; i += 1) {
      mapped.push(fn(val[i]));
    }
    return mapped;
  }
  return fn(val);
};
module.exports = {
  arrayToObject: arrayToObject,
  assign: assign,
  combine: combine,
  compact: compact,
  decode: decode,
  encode: encode,
  isBuffer: isBuffer,
  isRegExp: isRegExp,
  maybeMap: maybeMap,
  merge: merge
};

/***/ }),

/***/ 2635:
/***/ ((module) => {

"use strict";
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.



// If obj.hasOwnProperty has been overridden, then calling
// obj.hasOwnProperty(prop) will break.
// See: https://github.com/joyent/node/issues/1707
function hasOwnProperty(obj, prop) {
  return Object.prototype.hasOwnProperty.call(obj, prop);
}
module.exports = function (qs, sep, eq, options) {
  sep = sep || '&';
  eq = eq || '=';
  var obj = {};
  if (typeof qs !== 'string' || qs.length === 0) {
    return obj;
  }
  var regexp = /\+/g;
  qs = qs.split(sep);
  var maxKeys = 1000;
  if (options && typeof options.maxKeys === 'number') {
    maxKeys = options.maxKeys;
  }
  var len = qs.length;
  // maxKeys <= 0 means that we should not limit keys count
  if (maxKeys > 0 && len > maxKeys) {
    len = maxKeys;
  }
  for (var i = 0; i < len; ++i) {
    var x = qs[i].replace(regexp, '%20'),
      idx = x.indexOf(eq),
      kstr,
      vstr,
      k,
      v;
    if (idx >= 0) {
      kstr = x.substr(0, idx);
      vstr = x.substr(idx + 1);
    } else {
      kstr = x;
      vstr = '';
    }
    k = decodeURIComponent(kstr);
    v = decodeURIComponent(vstr);
    if (!hasOwnProperty(obj, k)) {
      obj[k] = v;
    } else if (isArray(obj[k])) {
      obj[k].push(v);
    } else {
      obj[k] = [obj[k], v];
    }
  }
  return obj;
};
var isArray = Array.isArray || function (xs) {
  return Object.prototype.toString.call(xs) === '[object Array]';
};

/***/ }),

/***/ 7778:
/***/ ((module) => {

"use strict";
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.



function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
var stringifyPrimitive = function stringifyPrimitive(v) {
  switch (_typeof(v)) {
    case 'string':
      return v;
    case 'boolean':
      return v ? 'true' : 'false';
    case 'number':
      return isFinite(v) ? v : '';
    default:
      return '';
  }
};
module.exports = function (obj, sep, eq, name) {
  sep = sep || '&';
  eq = eq || '=';
  if (obj === null) {
    obj = undefined;
  }
  if (_typeof(obj) === 'object') {
    return map(objectKeys(obj), function (k) {
      var ks = encodeURIComponent(stringifyPrimitive(k)) + eq;
      if (isArray(obj[k])) {
        return map(obj[k], function (v) {
          return ks + encodeURIComponent(stringifyPrimitive(v));
        }).join(sep);
      } else {
        return ks + encodeURIComponent(stringifyPrimitive(obj[k]));
      }
    }).join(sep);
  }
  if (!name) return '';
  return encodeURIComponent(stringifyPrimitive(name)) + eq + encodeURIComponent(stringifyPrimitive(obj));
};
var isArray = Array.isArray || function (xs) {
  return Object.prototype.toString.call(xs) === '[object Array]';
};
function map(xs, f) {
  if (xs.map) return xs.map(f);
  var res = [];
  for (var i = 0; i < xs.length; i++) {
    res.push(f(xs[i], i));
  }
  return res;
}
var objectKeys = Object.keys || function (obj) {
  var res = [];
  for (var key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) res.push(key);
  }
  return res;
};

/***/ }),

/***/ 9774:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


exports.decode = exports.parse = __webpack_require__(2635);
exports.encode = exports.stringify = __webpack_require__(7778);

/***/ }),

/***/ 352:
/***/ ((module) => {

"use strict";


function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _inheritsLoose(subClass, superClass) {
  subClass.prototype = Object.create(superClass.prototype);
  subClass.prototype.constructor = subClass;
  subClass.__proto__ = superClass;
}
var codes = {};
function createErrorType(code, message, Base) {
  if (!Base) {
    Base = Error;
  }
  function getMessage(arg1, arg2, arg3) {
    if (typeof message === 'string') {
      return message;
    } else {
      return message(arg1, arg2, arg3);
    }
  }
  var NodeError = /*#__PURE__*/
  function (_Base) {
    _inheritsLoose(NodeError, _Base);
    function NodeError(arg1, arg2, arg3) {
      return _Base.call(this, getMessage(arg1, arg2, arg3)) || this;
    }
    return NodeError;
  }(Base);
  NodeError.prototype.name = Base.name;
  NodeError.prototype.code = code;
  codes[code] = NodeError;
} // https://github.com/nodejs/node/blob/v10.8.0/lib/internal/errors.js

function oneOf(expected, thing) {
  if (Array.isArray(expected)) {
    var len = expected.length;
    expected = expected.map(function (i) {
      return String(i);
    });
    if (len > 2) {
      return "one of ".concat(thing, " ").concat(expected.slice(0, len - 1).join(', '), ", or ") + expected[len - 1];
    } else if (len === 2) {
      return "one of ".concat(thing, " ").concat(expected[0], " or ").concat(expected[1]);
    } else {
      return "of ".concat(thing, " ").concat(expected[0]);
    }
  } else {
    return "of ".concat(thing, " ").concat(String(expected));
  }
} // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/startsWith

function startsWith(str, search, pos) {
  return str.substr(!pos || pos < 0 ? 0 : +pos, search.length) === search;
} // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/endsWith

function endsWith(str, search, this_len) {
  if (this_len === undefined || this_len > str.length) {
    this_len = str.length;
  }
  return str.substring(this_len - search.length, this_len) === search;
} // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/includes

function includes(str, search, start) {
  if (typeof start !== 'number') {
    start = 0;
  }
  if (start + search.length > str.length) {
    return false;
  } else {
    return str.indexOf(search, start) !== -1;
  }
}
createErrorType('ERR_INVALID_OPT_VALUE', function (name, value) {
  return 'The value "' + value + '" is invalid for option "' + name + '"';
}, TypeError);
createErrorType('ERR_INVALID_ARG_TYPE', function (name, expected, actual) {
  // determiner: 'must be' or 'must not be'
  var determiner;
  if (typeof expected === 'string' && startsWith(expected, 'not ')) {
    determiner = 'must not be';
    expected = expected.replace(/^not /, '');
  } else {
    determiner = 'must be';
  }
  var msg;
  if (endsWith(name, ' argument')) {
    // For cases like 'first argument'
    msg = "The ".concat(name, " ").concat(determiner, " ").concat(oneOf(expected, 'type'));
  } else {
    var type = includes(name, '.') ? 'property' : 'argument';
    msg = "The \"".concat(name, "\" ").concat(type, " ").concat(determiner, " ").concat(oneOf(expected, 'type'));
  }
  msg += ". Received type ".concat(_typeof(actual));
  return msg;
}, TypeError);
createErrorType('ERR_STREAM_PUSH_AFTER_EOF', 'stream.push() after EOF');
createErrorType('ERR_METHOD_NOT_IMPLEMENTED', function (name) {
  return 'The ' + name + ' method is not implemented';
});
createErrorType('ERR_STREAM_PREMATURE_CLOSE', 'Premature close');
createErrorType('ERR_STREAM_DESTROYED', function (name) {
  return 'Cannot call ' + name + ' after a stream was destroyed';
});
createErrorType('ERR_MULTIPLE_CALLBACK', 'Callback called multiple times');
createErrorType('ERR_STREAM_CANNOT_PIPE', 'Cannot pipe, not readable');
createErrorType('ERR_STREAM_WRITE_AFTER_END', 'write after end');
createErrorType('ERR_STREAM_NULL_VALUES', 'May not write null values to stream', TypeError);
createErrorType('ERR_UNKNOWN_ENCODING', function (arg) {
  return 'Unknown encoding: ' + arg;
}, TypeError);
createErrorType('ERR_STREAM_UNSHIFT_AFTER_END_EVENT', 'stream.unshift() after end event');
module.exports.q = codes;

/***/ }),

/***/ 3653:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
/* provided dependency */ var process = __webpack_require__(2790);
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

// a duplex stream is just a stream that is both readable and writable.
// Since JS doesn't have multiple prototypal inheritance, this class
// prototypally inherits from Readable, and then parasitically from
// Writable.



/*<replacement>*/
var objectKeys = Object.keys || function (obj) {
  var keys = [];
  for (var key in obj) keys.push(key);
  return keys;
};
/*</replacement>*/

module.exports = Duplex;
var Readable = __webpack_require__(8817);
var Writable = __webpack_require__(2248);
__webpack_require__(5153)(Duplex, Readable);
{
  // Allow the keys array to be GC'ed.
  var keys = objectKeys(Writable.prototype);
  for (var v = 0; v < keys.length; v++) {
    var method = keys[v];
    if (!Duplex.prototype[method]) Duplex.prototype[method] = Writable.prototype[method];
  }
}
function Duplex(options) {
  if (!(this instanceof Duplex)) return new Duplex(options);
  Readable.call(this, options);
  Writable.call(this, options);
  this.allowHalfOpen = true;
  if (options) {
    if (options.readable === false) this.readable = false;
    if (options.writable === false) this.writable = false;
    if (options.allowHalfOpen === false) {
      this.allowHalfOpen = false;
      this.once('end', onend);
    }
  }
}
Object.defineProperty(Duplex.prototype, 'writableHighWaterMark', {
  // making it explicit this property is not enumerable
  // because otherwise some prototype manipulation in
  // userland will fail
  enumerable: false,
  get: function get() {
    return this._writableState.highWaterMark;
  }
});
Object.defineProperty(Duplex.prototype, 'writableBuffer', {
  // making it explicit this property is not enumerable
  // because otherwise some prototype manipulation in
  // userland will fail
  enumerable: false,
  get: function get() {
    return this._writableState && this._writableState.getBuffer();
  }
});
Object.defineProperty(Duplex.prototype, 'writableLength', {
  // making it explicit this property is not enumerable
  // because otherwise some prototype manipulation in
  // userland will fail
  enumerable: false,
  get: function get() {
    return this._writableState.length;
  }
});

// the no-half-open enforcer
function onend() {
  // If the writable side ended, then we're ok.
  if (this._writableState.ended) return;

  // no more data can be written.
  // But allow more writes to happen in this tick.
  process.nextTick(onEndNT, this);
}
function onEndNT(self) {
  self.end();
}
Object.defineProperty(Duplex.prototype, 'destroyed', {
  // making it explicit this property is not enumerable
  // because otherwise some prototype manipulation in
  // userland will fail
  enumerable: false,
  get: function get() {
    if (this._readableState === undefined || this._writableState === undefined) {
      return false;
    }
    return this._readableState.destroyed && this._writableState.destroyed;
  },
  set: function set(value) {
    // we ignore the value if the stream
    // has not been initialized yet
    if (this._readableState === undefined || this._writableState === undefined) {
      return;
    }

    // backward compatibility, the user is explicitly
    // managing destroyed
    this._readableState.destroyed = value;
    this._writableState.destroyed = value;
  }
});

/***/ }),

/***/ 8210:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

// a passthrough stream.
// basically just the most minimal sort of Transform stream.
// Every written chunk gets output as-is.



module.exports = PassThrough;
var Transform = __webpack_require__(5500);
__webpack_require__(5153)(PassThrough, Transform);
function PassThrough(options) {
  if (!(this instanceof PassThrough)) return new PassThrough(options);
  Transform.call(this, options);
}
PassThrough.prototype._transform = function (chunk, encoding, cb) {
  cb(null, chunk);
};

/***/ }),

/***/ 8817:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
/* provided dependency */ var process = __webpack_require__(2790);
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.



module.exports = Readable;

/*<replacement>*/
var Duplex;
/*</replacement>*/

Readable.ReadableState = ReadableState;

/*<replacement>*/
var EE = (__webpack_require__(1590).EventEmitter);
var EElistenerCount = function EElistenerCount(emitter, type) {
  return emitter.listeners(type).length;
};
/*</replacement>*/

/*<replacement>*/
var Stream = __webpack_require__(1773);
/*</replacement>*/

var Buffer = (__webpack_require__(5851).Buffer);
var OurUint8Array = (typeof __webpack_require__.g !== 'undefined' ? __webpack_require__.g : typeof window !== 'undefined' ? window : typeof self !== 'undefined' ? self : {}).Uint8Array || function () {};
function _uint8ArrayToBuffer(chunk) {
  return Buffer.from(chunk);
}
function _isUint8Array(obj) {
  return Buffer.isBuffer(obj) || obj instanceof OurUint8Array;
}

/*<replacement>*/
var debugUtil = __webpack_require__(4616);
var debug;
if (debugUtil && debugUtil.debuglog) {
  debug = debugUtil.debuglog('stream');
} else {
  debug = function debug() {};
}
/*</replacement>*/

var BufferList = __webpack_require__(2923);
var destroyImpl = __webpack_require__(1735);
var _require = __webpack_require__(9604),
  getHighWaterMark = _require.getHighWaterMark;
var _require$codes = (__webpack_require__(352)/* .codes */ .q),
  ERR_INVALID_ARG_TYPE = _require$codes.ERR_INVALID_ARG_TYPE,
  ERR_STREAM_PUSH_AFTER_EOF = _require$codes.ERR_STREAM_PUSH_AFTER_EOF,
  ERR_METHOD_NOT_IMPLEMENTED = _require$codes.ERR_METHOD_NOT_IMPLEMENTED,
  ERR_STREAM_UNSHIFT_AFTER_END_EVENT = _require$codes.ERR_STREAM_UNSHIFT_AFTER_END_EVENT;

// Lazy loaded to improve the startup performance.
var StringDecoder;
var createReadableStreamAsyncIterator;
var from;
__webpack_require__(5153)(Readable, Stream);
var errorOrDestroy = destroyImpl.errorOrDestroy;
var kProxyEvents = ['error', 'close', 'destroy', 'pause', 'resume'];
function prependListener(emitter, event, fn) {
  // Sadly this is not cacheable as some libraries bundle their own
  // event emitter implementation with them.
  if (typeof emitter.prependListener === 'function') return emitter.prependListener(event, fn);

  // This is a hack to make sure that our error handler is attached before any
  // userland ones.  NEVER DO THIS. This is here only because this code needs
  // to continue to work with older versions of Node.js that do not include
  // the prependListener() method. The goal is to eventually remove this hack.
  if (!emitter._events || !emitter._events[event]) emitter.on(event, fn);else if (Array.isArray(emitter._events[event])) emitter._events[event].unshift(fn);else emitter._events[event] = [fn, emitter._events[event]];
}
function ReadableState(options, stream, isDuplex) {
  Duplex = Duplex || __webpack_require__(3653);
  options = options || {};

  // Duplex streams are both readable and writable, but share
  // the same options object.
  // However, some cases require setting options to different
  // values for the readable and the writable sides of the duplex stream.
  // These options can be provided separately as readableXXX and writableXXX.
  if (typeof isDuplex !== 'boolean') isDuplex = stream instanceof Duplex;

  // object stream flag. Used to make read(n) ignore n and to
  // make all the buffer merging and length checks go away
  this.objectMode = !!options.objectMode;
  if (isDuplex) this.objectMode = this.objectMode || !!options.readableObjectMode;

  // the point at which it stops calling _read() to fill the buffer
  // Note: 0 is a valid value, means "don't call _read preemptively ever"
  this.highWaterMark = getHighWaterMark(this, options, 'readableHighWaterMark', isDuplex);

  // A linked list is used to store data chunks instead of an array because the
  // linked list can remove elements from the beginning faster than
  // array.shift()
  this.buffer = new BufferList();
  this.length = 0;
  this.pipes = null;
  this.pipesCount = 0;
  this.flowing = null;
  this.ended = false;
  this.endEmitted = false;
  this.reading = false;

  // a flag to be able to tell if the event 'readable'/'data' is emitted
  // immediately, or on a later tick.  We set this to true at first, because
  // any actions that shouldn't happen until "later" should generally also
  // not happen before the first read call.
  this.sync = true;

  // whenever we return null, then we set a flag to say
  // that we're awaiting a 'readable' event emission.
  this.needReadable = false;
  this.emittedReadable = false;
  this.readableListening = false;
  this.resumeScheduled = false;
  this.paused = true;

  // Should close be emitted on destroy. Defaults to true.
  this.emitClose = options.emitClose !== false;

  // Should .destroy() be called after 'end' (and potentially 'finish')
  this.autoDestroy = !!options.autoDestroy;

  // has it been destroyed
  this.destroyed = false;

  // Crypto is kind of old and crusty.  Historically, its default string
  // encoding is 'binary' so we have to make this configurable.
  // Everything else in the universe uses 'utf8', though.
  this.defaultEncoding = options.defaultEncoding || 'utf8';

  // the number of writers that are awaiting a drain event in .pipe()s
  this.awaitDrain = 0;

  // if true, a maybeReadMore has been scheduled
  this.readingMore = false;
  this.decoder = null;
  this.encoding = null;
  if (options.encoding) {
    if (!StringDecoder) StringDecoder = (__webpack_require__(1907)/* .StringDecoder */ .s);
    this.decoder = new StringDecoder(options.encoding);
    this.encoding = options.encoding;
  }
}
function Readable(options) {
  Duplex = Duplex || __webpack_require__(3653);
  if (!(this instanceof Readable)) return new Readable(options);

  // Checking for a Stream.Duplex instance is faster here instead of inside
  // the ReadableState constructor, at least with V8 6.5
  var isDuplex = this instanceof Duplex;
  this._readableState = new ReadableState(options, this, isDuplex);

  // legacy
  this.readable = true;
  if (options) {
    if (typeof options.read === 'function') this._read = options.read;
    if (typeof options.destroy === 'function') this._destroy = options.destroy;
  }
  Stream.call(this);
}
Object.defineProperty(Readable.prototype, 'destroyed', {
  // making it explicit this property is not enumerable
  // because otherwise some prototype manipulation in
  // userland will fail
  enumerable: false,
  get: function get() {
    if (this._readableState === undefined) {
      return false;
    }
    return this._readableState.destroyed;
  },
  set: function set(value) {
    // we ignore the value if the stream
    // has not been initialized yet
    if (!this._readableState) {
      return;
    }

    // backward compatibility, the user is explicitly
    // managing destroyed
    this._readableState.destroyed = value;
  }
});
Readable.prototype.destroy = destroyImpl.destroy;
Readable.prototype._undestroy = destroyImpl.undestroy;
Readable.prototype._destroy = function (err, cb) {
  cb(err);
};

// Manually shove something into the read() buffer.
// This returns true if the highWaterMark has not been hit yet,
// similar to how Writable.write() returns true if you should
// write() some more.
Readable.prototype.push = function (chunk, encoding) {
  var state = this._readableState;
  var skipChunkCheck;
  if (!state.objectMode) {
    if (typeof chunk === 'string') {
      encoding = encoding || state.defaultEncoding;
      if (encoding !== state.encoding) {
        chunk = Buffer.from(chunk, encoding);
        encoding = '';
      }
      skipChunkCheck = true;
    }
  } else {
    skipChunkCheck = true;
  }
  return readableAddChunk(this, chunk, encoding, false, skipChunkCheck);
};

// Unshift should *always* be something directly out of read()
Readable.prototype.unshift = function (chunk) {
  return readableAddChunk(this, chunk, null, true, false);
};
function readableAddChunk(stream, chunk, encoding, addToFront, skipChunkCheck) {
  debug('readableAddChunk', chunk);
  var state = stream._readableState;
  if (chunk === null) {
    state.reading = false;
    onEofChunk(stream, state);
  } else {
    var er;
    if (!skipChunkCheck) er = chunkInvalid(state, chunk);
    if (er) {
      errorOrDestroy(stream, er);
    } else if (state.objectMode || chunk && chunk.length > 0) {
      if (typeof chunk !== 'string' && !state.objectMode && Object.getPrototypeOf(chunk) !== Buffer.prototype) {
        chunk = _uint8ArrayToBuffer(chunk);
      }
      if (addToFront) {
        if (state.endEmitted) errorOrDestroy(stream, new ERR_STREAM_UNSHIFT_AFTER_END_EVENT());else addChunk(stream, state, chunk, true);
      } else if (state.ended) {
        errorOrDestroy(stream, new ERR_STREAM_PUSH_AFTER_EOF());
      } else if (state.destroyed) {
        return false;
      } else {
        state.reading = false;
        if (state.decoder && !encoding) {
          chunk = state.decoder.write(chunk);
          if (state.objectMode || chunk.length !== 0) addChunk(stream, state, chunk, false);else maybeReadMore(stream, state);
        } else {
          addChunk(stream, state, chunk, false);
        }
      }
    } else if (!addToFront) {
      state.reading = false;
      maybeReadMore(stream, state);
    }
  }

  // We can push more data if we are below the highWaterMark.
  // Also, if we have no data yet, we can stand some more bytes.
  // This is to work around cases where hwm=0, such as the repl.
  return !state.ended && (state.length < state.highWaterMark || state.length === 0);
}
function addChunk(stream, state, chunk, addToFront) {
  if (state.flowing && state.length === 0 && !state.sync) {
    state.awaitDrain = 0;
    stream.emit('data', chunk);
  } else {
    // update the buffer info.
    state.length += state.objectMode ? 1 : chunk.length;
    if (addToFront) state.buffer.unshift(chunk);else state.buffer.push(chunk);
    if (state.needReadable) emitReadable(stream);
  }
  maybeReadMore(stream, state);
}
function chunkInvalid(state, chunk) {
  var er;
  if (!_isUint8Array(chunk) && typeof chunk !== 'string' && chunk !== undefined && !state.objectMode) {
    er = new ERR_INVALID_ARG_TYPE('chunk', ['string', 'Buffer', 'Uint8Array'], chunk);
  }
  return er;
}
Readable.prototype.isPaused = function () {
  return this._readableState.flowing === false;
};

// backwards compatibility.
Readable.prototype.setEncoding = function (enc) {
  if (!StringDecoder) StringDecoder = (__webpack_require__(1907)/* .StringDecoder */ .s);
  var decoder = new StringDecoder(enc);
  this._readableState.decoder = decoder;
  // If setEncoding(null), decoder.encoding equals utf8
  this._readableState.encoding = this._readableState.decoder.encoding;

  // Iterate over current buffer to convert already stored Buffers:
  var p = this._readableState.buffer.head;
  var content = '';
  while (p !== null) {
    content += decoder.write(p.data);
    p = p.next;
  }
  this._readableState.buffer.clear();
  if (content !== '') this._readableState.buffer.push(content);
  this._readableState.length = content.length;
  return this;
};

// Don't raise the hwm > 1GB
var MAX_HWM = 0x40000000;
function computeNewHighWaterMark(n) {
  if (n >= MAX_HWM) {
    // TODO(ronag): Throw ERR_VALUE_OUT_OF_RANGE.
    n = MAX_HWM;
  } else {
    // Get the next highest power of 2 to prevent increasing hwm excessively in
    // tiny amounts
    n--;
    n |= n >>> 1;
    n |= n >>> 2;
    n |= n >>> 4;
    n |= n >>> 8;
    n |= n >>> 16;
    n++;
  }
  return n;
}

// This function is designed to be inlinable, so please take care when making
// changes to the function body.
function howMuchToRead(n, state) {
  if (n <= 0 || state.length === 0 && state.ended) return 0;
  if (state.objectMode) return 1;
  if (n !== n) {
    // Only flow one buffer at a time
    if (state.flowing && state.length) return state.buffer.head.data.length;else return state.length;
  }
  // If we're asking for more than the current hwm, then raise the hwm.
  if (n > state.highWaterMark) state.highWaterMark = computeNewHighWaterMark(n);
  if (n <= state.length) return n;
  // Don't have enough
  if (!state.ended) {
    state.needReadable = true;
    return 0;
  }
  return state.length;
}

// you can override either this method, or the async _read(n) below.
Readable.prototype.read = function (n) {
  debug('read', n);
  n = parseInt(n, 10);
  var state = this._readableState;
  var nOrig = n;
  if (n !== 0) state.emittedReadable = false;

  // if we're doing read(0) to trigger a readable event, but we
  // already have a bunch of data in the buffer, then just trigger
  // the 'readable' event and move on.
  if (n === 0 && state.needReadable && ((state.highWaterMark !== 0 ? state.length >= state.highWaterMark : state.length > 0) || state.ended)) {
    debug('read: emitReadable', state.length, state.ended);
    if (state.length === 0 && state.ended) endReadable(this);else emitReadable(this);
    return null;
  }
  n = howMuchToRead(n, state);

  // if we've ended, and we're now clear, then finish it up.
  if (n === 0 && state.ended) {
    if (state.length === 0) endReadable(this);
    return null;
  }

  // All the actual chunk generation logic needs to be
  // *below* the call to _read.  The reason is that in certain
  // synthetic stream cases, such as passthrough streams, _read
  // may be a completely synchronous operation which may change
  // the state of the read buffer, providing enough data when
  // before there was *not* enough.
  //
  // So, the steps are:
  // 1. Figure out what the state of things will be after we do
  // a read from the buffer.
  //
  // 2. If that resulting state will trigger a _read, then call _read.
  // Note that this may be asynchronous, or synchronous.  Yes, it is
  // deeply ugly to write APIs this way, but that still doesn't mean
  // that the Readable class should behave improperly, as streams are
  // designed to be sync/async agnostic.
  // Take note if the _read call is sync or async (ie, if the read call
  // has returned yet), so that we know whether or not it's safe to emit
  // 'readable' etc.
  //
  // 3. Actually pull the requested chunks out of the buffer and return.

  // if we need a readable event, then we need to do some reading.
  var doRead = state.needReadable;
  debug('need readable', doRead);

  // if we currently have less than the highWaterMark, then also read some
  if (state.length === 0 || state.length - n < state.highWaterMark) {
    doRead = true;
    debug('length less than watermark', doRead);
  }

  // however, if we've ended, then there's no point, and if we're already
  // reading, then it's unnecessary.
  if (state.ended || state.reading) {
    doRead = false;
    debug('reading or ended', doRead);
  } else if (doRead) {
    debug('do read');
    state.reading = true;
    state.sync = true;
    // if the length is currently zero, then we *need* a readable event.
    if (state.length === 0) state.needReadable = true;
    // call internal read method
    this._read(state.highWaterMark);
    state.sync = false;
    // If _read pushed data synchronously, then `reading` will be false,
    // and we need to re-evaluate how much data we can return to the user.
    if (!state.reading) n = howMuchToRead(nOrig, state);
  }
  var ret;
  if (n > 0) ret = fromList(n, state);else ret = null;
  if (ret === null) {
    state.needReadable = state.length <= state.highWaterMark;
    n = 0;
  } else {
    state.length -= n;
    state.awaitDrain = 0;
  }
  if (state.length === 0) {
    // If we have nothing in the buffer, then we want to know
    // as soon as we *do* get something into the buffer.
    if (!state.ended) state.needReadable = true;

    // If we tried to read() past the EOF, then emit end on the next tick.
    if (nOrig !== n && state.ended) endReadable(this);
  }
  if (ret !== null) this.emit('data', ret);
  return ret;
};
function onEofChunk(stream, state) {
  debug('onEofChunk');
  if (state.ended) return;
  if (state.decoder) {
    var chunk = state.decoder.end();
    if (chunk && chunk.length) {
      state.buffer.push(chunk);
      state.length += state.objectMode ? 1 : chunk.length;
    }
  }
  state.ended = true;
  if (state.sync) {
    // if we are sync, wait until next tick to emit the data.
    // Otherwise we risk emitting data in the flow()
    // the readable code triggers during a read() call
    emitReadable(stream);
  } else {
    // emit 'readable' now to make sure it gets picked up.
    state.needReadable = false;
    if (!state.emittedReadable) {
      state.emittedReadable = true;
      emitReadable_(stream);
    }
  }
}

// Don't emit readable right away in sync mode, because this can trigger
// another read() call => stack overflow.  This way, it might trigger
// a nextTick recursion warning, but that's not so bad.
function emitReadable(stream) {
  var state = stream._readableState;
  debug('emitReadable', state.needReadable, state.emittedReadable);
  state.needReadable = false;
  if (!state.emittedReadable) {
    debug('emitReadable', state.flowing);
    state.emittedReadable = true;
    process.nextTick(emitReadable_, stream);
  }
}
function emitReadable_(stream) {
  var state = stream._readableState;
  debug('emitReadable_', state.destroyed, state.length, state.ended);
  if (!state.destroyed && (state.length || state.ended)) {
    stream.emit('readable');
    state.emittedReadable = false;
  }

  // The stream needs another readable event if
  // 1. It is not flowing, as the flow mechanism will take
  //    care of it.
  // 2. It is not ended.
  // 3. It is below the highWaterMark, so we can schedule
  //    another readable later.
  state.needReadable = !state.flowing && !state.ended && state.length <= state.highWaterMark;
  flow(stream);
}

// at this point, the user has presumably seen the 'readable' event,
// and called read() to consume some data.  that may have triggered
// in turn another _read(n) call, in which case reading = true if
// it's in progress.
// However, if we're not ended, or reading, and the length < hwm,
// then go ahead and try to read some more preemptively.
function maybeReadMore(stream, state) {
  if (!state.readingMore) {
    state.readingMore = true;
    process.nextTick(maybeReadMore_, stream, state);
  }
}
function maybeReadMore_(stream, state) {
  // Attempt to read more data if we should.
  //
  // The conditions for reading more data are (one of):
  // - Not enough data buffered (state.length < state.highWaterMark). The loop
  //   is responsible for filling the buffer with enough data if such data
  //   is available. If highWaterMark is 0 and we are not in the flowing mode
  //   we should _not_ attempt to buffer any extra data. We'll get more data
  //   when the stream consumer calls read() instead.
  // - No data in the buffer, and the stream is in flowing mode. In this mode
  //   the loop below is responsible for ensuring read() is called. Failing to
  //   call read here would abort the flow and there's no other mechanism for
  //   continuing the flow if the stream consumer has just subscribed to the
  //   'data' event.
  //
  // In addition to the above conditions to keep reading data, the following
  // conditions prevent the data from being read:
  // - The stream has ended (state.ended).
  // - There is already a pending 'read' operation (state.reading). This is a
  //   case where the the stream has called the implementation defined _read()
  //   method, but they are processing the call asynchronously and have _not_
  //   called push() with new data. In this case we skip performing more
  //   read()s. The execution ends in this method again after the _read() ends
  //   up calling push() with more data.
  while (!state.reading && !state.ended && (state.length < state.highWaterMark || state.flowing && state.length === 0)) {
    var len = state.length;
    debug('maybeReadMore read 0');
    stream.read(0);
    if (len === state.length)
      // didn't get any data, stop spinning.
      break;
  }
  state.readingMore = false;
}

// abstract method.  to be overridden in specific implementation classes.
// call cb(er, data) where data is <= n in length.
// for virtual (non-string, non-buffer) streams, "length" is somewhat
// arbitrary, and perhaps not very meaningful.
Readable.prototype._read = function (n) {
  errorOrDestroy(this, new ERR_METHOD_NOT_IMPLEMENTED('_read()'));
};
Readable.prototype.pipe = function (dest, pipeOpts) {
  var src = this;
  var state = this._readableState;
  switch (state.pipesCount) {
    case 0:
      state.pipes = dest;
      break;
    case 1:
      state.pipes = [state.pipes, dest];
      break;
    default:
      state.pipes.push(dest);
      break;
  }
  state.pipesCount += 1;
  debug('pipe count=%d opts=%j', state.pipesCount, pipeOpts);
  var doEnd = (!pipeOpts || pipeOpts.end !== false) && dest !== process.stdout && dest !== process.stderr;
  var endFn = doEnd ? onend : unpipe;
  if (state.endEmitted) process.nextTick(endFn);else src.once('end', endFn);
  dest.on('unpipe', onunpipe);
  function onunpipe(readable, unpipeInfo) {
    debug('onunpipe');
    if (readable === src) {
      if (unpipeInfo && unpipeInfo.hasUnpiped === false) {
        unpipeInfo.hasUnpiped = true;
        cleanup();
      }
    }
  }
  function onend() {
    debug('onend');
    dest.end();
  }

  // when the dest drains, it reduces the awaitDrain counter
  // on the source.  This would be more elegant with a .once()
  // handler in flow(), but adding and removing repeatedly is
  // too slow.
  var ondrain = pipeOnDrain(src);
  dest.on('drain', ondrain);
  var cleanedUp = false;
  function cleanup() {
    debug('cleanup');
    // cleanup event handlers once the pipe is broken
    dest.removeListener('close', onclose);
    dest.removeListener('finish', onfinish);
    dest.removeListener('drain', ondrain);
    dest.removeListener('error', onerror);
    dest.removeListener('unpipe', onunpipe);
    src.removeListener('end', onend);
    src.removeListener('end', unpipe);
    src.removeListener('data', ondata);
    cleanedUp = true;

    // if the reader is waiting for a drain event from this
    // specific writer, then it would cause it to never start
    // flowing again.
    // So, if this is awaiting a drain, then we just call it now.
    // If we don't know, then assume that we are waiting for one.
    if (state.awaitDrain && (!dest._writableState || dest._writableState.needDrain)) ondrain();
  }
  src.on('data', ondata);
  function ondata(chunk) {
    debug('ondata');
    var ret = dest.write(chunk);
    debug('dest.write', ret);
    if (ret === false) {
      // If the user unpiped during `dest.write()`, it is possible
      // to get stuck in a permanently paused state if that write
      // also returned false.
      // => Check whether `dest` is still a piping destination.
      if ((state.pipesCount === 1 && state.pipes === dest || state.pipesCount > 1 && indexOf(state.pipes, dest) !== -1) && !cleanedUp) {
        debug('false write response, pause', state.awaitDrain);
        state.awaitDrain++;
      }
      src.pause();
    }
  }

  // if the dest has an error, then stop piping into it.
  // however, don't suppress the throwing behavior for this.
  function onerror(er) {
    debug('onerror', er);
    unpipe();
    dest.removeListener('error', onerror);
    if (EElistenerCount(dest, 'error') === 0) errorOrDestroy(dest, er);
  }

  // Make sure our error handler is attached before userland ones.
  prependListener(dest, 'error', onerror);

  // Both close and finish should trigger unpipe, but only once.
  function onclose() {
    dest.removeListener('finish', onfinish);
    unpipe();
  }
  dest.once('close', onclose);
  function onfinish() {
    debug('onfinish');
    dest.removeListener('close', onclose);
    unpipe();
  }
  dest.once('finish', onfinish);
  function unpipe() {
    debug('unpipe');
    src.unpipe(dest);
  }

  // tell the dest that it's being piped to
  dest.emit('pipe', src);

  // start the flow if it hasn't been started already.
  if (!state.flowing) {
    debug('pipe resume');
    src.resume();
  }
  return dest;
};
function pipeOnDrain(src) {
  return function pipeOnDrainFunctionResult() {
    var state = src._readableState;
    debug('pipeOnDrain', state.awaitDrain);
    if (state.awaitDrain) state.awaitDrain--;
    if (state.awaitDrain === 0 && EElistenerCount(src, 'data')) {
      state.flowing = true;
      flow(src);
    }
  };
}
Readable.prototype.unpipe = function (dest) {
  var state = this._readableState;
  var unpipeInfo = {
    hasUnpiped: false
  };

  // if we're not piping anywhere, then do nothing.
  if (state.pipesCount === 0) return this;

  // just one destination.  most common case.
  if (state.pipesCount === 1) {
    // passed in one, but it's not the right one.
    if (dest && dest !== state.pipes) return this;
    if (!dest) dest = state.pipes;

    // got a match.
    state.pipes = null;
    state.pipesCount = 0;
    state.flowing = false;
    if (dest) dest.emit('unpipe', this, unpipeInfo);
    return this;
  }

  // slow case. multiple pipe destinations.

  if (!dest) {
    // remove all.
    var dests = state.pipes;
    var len = state.pipesCount;
    state.pipes = null;
    state.pipesCount = 0;
    state.flowing = false;
    for (var i = 0; i < len; i++) dests[i].emit('unpipe', this, {
      hasUnpiped: false
    });
    return this;
  }

  // try to find the right one.
  var index = indexOf(state.pipes, dest);
  if (index === -1) return this;
  state.pipes.splice(index, 1);
  state.pipesCount -= 1;
  if (state.pipesCount === 1) state.pipes = state.pipes[0];
  dest.emit('unpipe', this, unpipeInfo);
  return this;
};

// set up data events if they are asked for
// Ensure readable listeners eventually get something
Readable.prototype.on = function (ev, fn) {
  var res = Stream.prototype.on.call(this, ev, fn);
  var state = this._readableState;
  if (ev === 'data') {
    // update readableListening so that resume() may be a no-op
    // a few lines down. This is needed to support once('readable').
    state.readableListening = this.listenerCount('readable') > 0;

    // Try start flowing on next tick if stream isn't explicitly paused
    if (state.flowing !== false) this.resume();
  } else if (ev === 'readable') {
    if (!state.endEmitted && !state.readableListening) {
      state.readableListening = state.needReadable = true;
      state.flowing = false;
      state.emittedReadable = false;
      debug('on readable', state.length, state.reading);
      if (state.length) {
        emitReadable(this);
      } else if (!state.reading) {
        process.nextTick(nReadingNextTick, this);
      }
    }
  }
  return res;
};
Readable.prototype.addListener = Readable.prototype.on;
Readable.prototype.removeListener = function (ev, fn) {
  var res = Stream.prototype.removeListener.call(this, ev, fn);
  if (ev === 'readable') {
    // We need to check if there is someone still listening to
    // readable and reset the state. However this needs to happen
    // after readable has been emitted but before I/O (nextTick) to
    // support once('readable', fn) cycles. This means that calling
    // resume within the same tick will have no
    // effect.
    process.nextTick(updateReadableListening, this);
  }
  return res;
};
Readable.prototype.removeAllListeners = function (ev) {
  var res = Stream.prototype.removeAllListeners.apply(this, arguments);
  if (ev === 'readable' || ev === undefined) {
    // We need to check if there is someone still listening to
    // readable and reset the state. However this needs to happen
    // after readable has been emitted but before I/O (nextTick) to
    // support once('readable', fn) cycles. This means that calling
    // resume within the same tick will have no
    // effect.
    process.nextTick(updateReadableListening, this);
  }
  return res;
};
function updateReadableListening(self) {
  var state = self._readableState;
  state.readableListening = self.listenerCount('readable') > 0;
  if (state.resumeScheduled && !state.paused) {
    // flowing needs to be set to true now, otherwise
    // the upcoming resume will not flow.
    state.flowing = true;

    // crude way to check if we should resume
  } else if (self.listenerCount('data') > 0) {
    self.resume();
  }
}
function nReadingNextTick(self) {
  debug('readable nexttick read 0');
  self.read(0);
}

// pause() and resume() are remnants of the legacy readable stream API
// If the user uses them, then switch into old mode.
Readable.prototype.resume = function () {
  var state = this._readableState;
  if (!state.flowing) {
    debug('resume');
    // we flow only if there is no one listening
    // for readable, but we still have to call
    // resume()
    state.flowing = !state.readableListening;
    resume(this, state);
  }
  state.paused = false;
  return this;
};
function resume(stream, state) {
  if (!state.resumeScheduled) {
    state.resumeScheduled = true;
    process.nextTick(resume_, stream, state);
  }
}
function resume_(stream, state) {
  debug('resume', state.reading);
  if (!state.reading) {
    stream.read(0);
  }
  state.resumeScheduled = false;
  stream.emit('resume');
  flow(stream);
  if (state.flowing && !state.reading) stream.read(0);
}
Readable.prototype.pause = function () {
  debug('call pause flowing=%j', this._readableState.flowing);
  if (this._readableState.flowing !== false) {
    debug('pause');
    this._readableState.flowing = false;
    this.emit('pause');
  }
  this._readableState.paused = true;
  return this;
};
function flow(stream) {
  var state = stream._readableState;
  debug('flow', state.flowing);
  while (state.flowing && stream.read() !== null);
}

// wrap an old-style stream as the async data source.
// This is *not* part of the readable stream interface.
// It is an ugly unfortunate mess of history.
Readable.prototype.wrap = function (stream) {
  var _this = this;
  var state = this._readableState;
  var paused = false;
  stream.on('end', function () {
    debug('wrapped end');
    if (state.decoder && !state.ended) {
      var chunk = state.decoder.end();
      if (chunk && chunk.length) _this.push(chunk);
    }
    _this.push(null);
  });
  stream.on('data', function (chunk) {
    debug('wrapped data');
    if (state.decoder) chunk = state.decoder.write(chunk);

    // don't skip over falsy values in objectMode
    if (state.objectMode && (chunk === null || chunk === undefined)) return;else if (!state.objectMode && (!chunk || !chunk.length)) return;
    var ret = _this.push(chunk);
    if (!ret) {
      paused = true;
      stream.pause();
    }
  });

  // proxy all the other methods.
  // important when wrapping filters and duplexes.
  for (var i in stream) {
    if (this[i] === undefined && typeof stream[i] === 'function') {
      this[i] = function methodWrap(method) {
        return function methodWrapReturnFunction() {
          return stream[method].apply(stream, arguments);
        };
      }(i);
    }
  }

  // proxy certain important events.
  for (var n = 0; n < kProxyEvents.length; n++) {
    stream.on(kProxyEvents[n], this.emit.bind(this, kProxyEvents[n]));
  }

  // when we try to consume some more bytes, simply unpause the
  // underlying stream.
  this._read = function (n) {
    debug('wrapped _read', n);
    if (paused) {
      paused = false;
      stream.resume();
    }
  };
  return this;
};
if (typeof Symbol === 'function') {
  Readable.prototype[Symbol.asyncIterator] = function () {
    if (createReadableStreamAsyncIterator === undefined) {
      createReadableStreamAsyncIterator = __webpack_require__(4258);
    }
    return createReadableStreamAsyncIterator(this);
  };
}
Object.defineProperty(Readable.prototype, 'readableHighWaterMark', {
  // making it explicit this property is not enumerable
  // because otherwise some prototype manipulation in
  // userland will fail
  enumerable: false,
  get: function get() {
    return this._readableState.highWaterMark;
  }
});
Object.defineProperty(Readable.prototype, 'readableBuffer', {
  // making it explicit this property is not enumerable
  // because otherwise some prototype manipulation in
  // userland will fail
  enumerable: false,
  get: function get() {
    return this._readableState && this._readableState.buffer;
  }
});
Object.defineProperty(Readable.prototype, 'readableFlowing', {
  // making it explicit this property is not enumerable
  // because otherwise some prototype manipulation in
  // userland will fail
  enumerable: false,
  get: function get() {
    return this._readableState.flowing;
  },
  set: function set(state) {
    if (this._readableState) {
      this._readableState.flowing = state;
    }
  }
});

// exposed for testing purposes only.
Readable._fromList = fromList;
Object.defineProperty(Readable.prototype, 'readableLength', {
  // making it explicit this property is not enumerable
  // because otherwise some prototype manipulation in
  // userland will fail
  enumerable: false,
  get: function get() {
    return this._readableState.length;
  }
});

// Pluck off n bytes from an array of buffers.
// Length is the combined lengths of all the buffers in the list.
// This function is designed to be inlinable, so please take care when making
// changes to the function body.
function fromList(n, state) {
  // nothing buffered
  if (state.length === 0) return null;
  var ret;
  if (state.objectMode) ret = state.buffer.shift();else if (!n || n >= state.length) {
    // read it all, truncate the list
    if (state.decoder) ret = state.buffer.join('');else if (state.buffer.length === 1) ret = state.buffer.first();else ret = state.buffer.concat(state.length);
    state.buffer.clear();
  } else {
    // read part of list
    ret = state.buffer.consume(n, state.decoder);
  }
  return ret;
}
function endReadable(stream) {
  var state = stream._readableState;
  debug('endReadable', state.endEmitted);
  if (!state.endEmitted) {
    state.ended = true;
    process.nextTick(endReadableNT, state, stream);
  }
}
function endReadableNT(state, stream) {
  debug('endReadableNT', state.endEmitted, state.length);

  // Check that we didn't get one last unshift.
  if (!state.endEmitted && state.length === 0) {
    state.endEmitted = true;
    stream.readable = false;
    stream.emit('end');
    if (state.autoDestroy) {
      // In case of duplex streams we need a way to detect
      // if the writable side is ready for autoDestroy as well
      var wState = stream._writableState;
      if (!wState || wState.autoDestroy && wState.finished) {
        stream.destroy();
      }
    }
  }
}
if (typeof Symbol === 'function') {
  Readable.from = function (iterable, opts) {
    if (from === undefined) {
      from = __webpack_require__(7766);
    }
    return from(Readable, iterable, opts);
  };
}
function indexOf(xs, x) {
  for (var i = 0, l = xs.length; i < l; i++) {
    if (xs[i] === x) return i;
  }
  return -1;
}

/***/ }),

/***/ 5500:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

// a transform stream is a readable/writable stream where you do
// something with the data.  Sometimes it's called a "filter",
// but that's not a great name for it, since that implies a thing where
// some bits pass through, and others are simply ignored.  (That would
// be a valid example of a transform, of course.)
//
// While the output is causally related to the input, it's not a
// necessarily symmetric or synchronous transformation.  For example,
// a zlib stream might take multiple plain-text writes(), and then
// emit a single compressed chunk some time in the future.
//
// Here's how this works:
//
// The Transform stream has all the aspects of the readable and writable
// stream classes.  When you write(chunk), that calls _write(chunk,cb)
// internally, and returns false if there's a lot of pending writes
// buffered up.  When you call read(), that calls _read(n) until
// there's enough pending readable data buffered up.
//
// In a transform stream, the written data is placed in a buffer.  When
// _read(n) is called, it transforms the queued up data, calling the
// buffered _write cb's as it consumes chunks.  If consuming a single
// written chunk would result in multiple output chunks, then the first
// outputted bit calls the readcb, and subsequent chunks just go into
// the read buffer, and will cause it to emit 'readable' if necessary.
//
// This way, back-pressure is actually determined by the reading side,
// since _read has to be called to start processing a new chunk.  However,
// a pathological inflate type of transform can cause excessive buffering
// here.  For example, imagine a stream where every byte of input is
// interpreted as an integer from 0-255, and then results in that many
// bytes of output.  Writing the 4 bytes {ff,ff,ff,ff} would result in
// 1kb of data being output.  In this case, you could write a very small
// amount of input, and end up with a very large amount of output.  In
// such a pathological inflating mechanism, there'd be no way to tell
// the system to stop doing the transform.  A single 4MB write could
// cause the system to run out of memory.
//
// However, even in such a pathological case, only a single written chunk
// would be consumed, and then the rest would wait (un-transformed) until
// the results of the previous transformed chunk were consumed.



module.exports = Transform;
var _require$codes = (__webpack_require__(352)/* .codes */ .q),
  ERR_METHOD_NOT_IMPLEMENTED = _require$codes.ERR_METHOD_NOT_IMPLEMENTED,
  ERR_MULTIPLE_CALLBACK = _require$codes.ERR_MULTIPLE_CALLBACK,
  ERR_TRANSFORM_ALREADY_TRANSFORMING = _require$codes.ERR_TRANSFORM_ALREADY_TRANSFORMING,
  ERR_TRANSFORM_WITH_LENGTH_0 = _require$codes.ERR_TRANSFORM_WITH_LENGTH_0;
var Duplex = __webpack_require__(3653);
__webpack_require__(5153)(Transform, Duplex);
function afterTransform(er, data) {
  var ts = this._transformState;
  ts.transforming = false;
  var cb = ts.writecb;
  if (cb === null) {
    return this.emit('error', new ERR_MULTIPLE_CALLBACK());
  }
  ts.writechunk = null;
  ts.writecb = null;
  if (data != null)
    // single equals check for both `null` and `undefined`
    this.push(data);
  cb(er);
  var rs = this._readableState;
  rs.reading = false;
  if (rs.needReadable || rs.length < rs.highWaterMark) {
    this._read(rs.highWaterMark);
  }
}
function Transform(options) {
  if (!(this instanceof Transform)) return new Transform(options);
  Duplex.call(this, options);
  this._transformState = {
    afterTransform: afterTransform.bind(this),
    needTransform: false,
    transforming: false,
    writecb: null,
    writechunk: null,
    writeencoding: null
  };

  // start out asking for a readable event once data is transformed.
  this._readableState.needReadable = true;

  // we have implemented the _read method, and done the other things
  // that Readable wants before the first _read call, so unset the
  // sync guard flag.
  this._readableState.sync = false;
  if (options) {
    if (typeof options.transform === 'function') this._transform = options.transform;
    if (typeof options.flush === 'function') this._flush = options.flush;
  }

  // When the writable side finishes, then flush out anything remaining.
  this.on('prefinish', prefinish);
}
function prefinish() {
  var _this = this;
  if (typeof this._flush === 'function' && !this._readableState.destroyed) {
    this._flush(function (er, data) {
      done(_this, er, data);
    });
  } else {
    done(this, null, null);
  }
}
Transform.prototype.push = function (chunk, encoding) {
  this._transformState.needTransform = false;
  return Duplex.prototype.push.call(this, chunk, encoding);
};

// This is the part where you do stuff!
// override this function in implementation classes.
// 'chunk' is an input chunk.
//
// Call `push(newChunk)` to pass along transformed output
// to the readable side.  You may call 'push' zero or more times.
//
// Call `cb(err)` when you are done with this chunk.  If you pass
// an error, then that'll put the hurt on the whole operation.  If you
// never call cb(), then you'll never get another chunk.
Transform.prototype._transform = function (chunk, encoding, cb) {
  cb(new ERR_METHOD_NOT_IMPLEMENTED('_transform()'));
};
Transform.prototype._write = function (chunk, encoding, cb) {
  var ts = this._transformState;
  ts.writecb = cb;
  ts.writechunk = chunk;
  ts.writeencoding = encoding;
  if (!ts.transforming) {
    var rs = this._readableState;
    if (ts.needTransform || rs.needReadable || rs.length < rs.highWaterMark) this._read(rs.highWaterMark);
  }
};

// Doesn't matter what the args are here.
// _transform does all the work.
// That we got here means that the readable side wants more data.
Transform.prototype._read = function (n) {
  var ts = this._transformState;
  if (ts.writechunk !== null && !ts.transforming) {
    ts.transforming = true;
    this._transform(ts.writechunk, ts.writeencoding, ts.afterTransform);
  } else {
    // mark that we need a transform, so that any data that comes in
    // will get processed, now that we've asked for it.
    ts.needTransform = true;
  }
};
Transform.prototype._destroy = function (err, cb) {
  Duplex.prototype._destroy.call(this, err, function (err2) {
    cb(err2);
  });
};
function done(stream, er, data) {
  if (er) return stream.emit('error', er);
  if (data != null)
    // single equals check for both `null` and `undefined`
    stream.push(data);

  // TODO(BridgeAR): Write a test for these two error cases
  // if there's nothing in the write buffer, then that means
  // that nothing more will ever be provided
  if (stream._writableState.length) throw new ERR_TRANSFORM_WITH_LENGTH_0();
  if (stream._transformState.transforming) throw new ERR_TRANSFORM_ALREADY_TRANSFORMING();
  return stream.push(null);
}

/***/ }),

/***/ 2248:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
/* provided dependency */ var process = __webpack_require__(2790);
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

// A bit simpler than readable streams.
// Implement an async ._write(chunk, encoding, cb), and it'll handle all
// the drain event emission and buffering.



module.exports = Writable;

/* <replacement> */
function WriteReq(chunk, encoding, cb) {
  this.chunk = chunk;
  this.encoding = encoding;
  this.callback = cb;
  this.next = null;
}

// It seems a linked list but it is not
// there will be only 2 of these for each stream
function CorkedRequest(state) {
  var _this = this;
  this.next = null;
  this.entry = null;
  this.finish = function () {
    onCorkedFinish(_this, state);
  };
}
/* </replacement> */

/*<replacement>*/
var Duplex;
/*</replacement>*/

Writable.WritableState = WritableState;

/*<replacement>*/
var internalUtil = {
  deprecate: __webpack_require__(6276)
};
/*</replacement>*/

/*<replacement>*/
var Stream = __webpack_require__(1773);
/*</replacement>*/

var Buffer = (__webpack_require__(5851).Buffer);
var OurUint8Array = (typeof __webpack_require__.g !== 'undefined' ? __webpack_require__.g : typeof window !== 'undefined' ? window : typeof self !== 'undefined' ? self : {}).Uint8Array || function () {};
function _uint8ArrayToBuffer(chunk) {
  return Buffer.from(chunk);
}
function _isUint8Array(obj) {
  return Buffer.isBuffer(obj) || obj instanceof OurUint8Array;
}
var destroyImpl = __webpack_require__(1735);
var _require = __webpack_require__(9604),
  getHighWaterMark = _require.getHighWaterMark;
var _require$codes = (__webpack_require__(352)/* .codes */ .q),
  ERR_INVALID_ARG_TYPE = _require$codes.ERR_INVALID_ARG_TYPE,
  ERR_METHOD_NOT_IMPLEMENTED = _require$codes.ERR_METHOD_NOT_IMPLEMENTED,
  ERR_MULTIPLE_CALLBACK = _require$codes.ERR_MULTIPLE_CALLBACK,
  ERR_STREAM_CANNOT_PIPE = _require$codes.ERR_STREAM_CANNOT_PIPE,
  ERR_STREAM_DESTROYED = _require$codes.ERR_STREAM_DESTROYED,
  ERR_STREAM_NULL_VALUES = _require$codes.ERR_STREAM_NULL_VALUES,
  ERR_STREAM_WRITE_AFTER_END = _require$codes.ERR_STREAM_WRITE_AFTER_END,
  ERR_UNKNOWN_ENCODING = _require$codes.ERR_UNKNOWN_ENCODING;
var errorOrDestroy = destroyImpl.errorOrDestroy;
__webpack_require__(5153)(Writable, Stream);
function nop() {}
function WritableState(options, stream, isDuplex) {
  Duplex = Duplex || __webpack_require__(3653);
  options = options || {};

  // Duplex streams are both readable and writable, but share
  // the same options object.
  // However, some cases require setting options to different
  // values for the readable and the writable sides of the duplex stream,
  // e.g. options.readableObjectMode vs. options.writableObjectMode, etc.
  if (typeof isDuplex !== 'boolean') isDuplex = stream instanceof Duplex;

  // object stream flag to indicate whether or not this stream
  // contains buffers or objects.
  this.objectMode = !!options.objectMode;
  if (isDuplex) this.objectMode = this.objectMode || !!options.writableObjectMode;

  // the point at which write() starts returning false
  // Note: 0 is a valid value, means that we always return false if
  // the entire buffer is not flushed immediately on write()
  this.highWaterMark = getHighWaterMark(this, options, 'writableHighWaterMark', isDuplex);

  // if _final has been called
  this.finalCalled = false;

  // drain event flag.
  this.needDrain = false;
  // at the start of calling end()
  this.ending = false;
  // when end() has been called, and returned
  this.ended = false;
  // when 'finish' is emitted
  this.finished = false;

  // has it been destroyed
  this.destroyed = false;

  // should we decode strings into buffers before passing to _write?
  // this is here so that some node-core streams can optimize string
  // handling at a lower level.
  var noDecode = options.decodeStrings === false;
  this.decodeStrings = !noDecode;

  // Crypto is kind of old and crusty.  Historically, its default string
  // encoding is 'binary' so we have to make this configurable.
  // Everything else in the universe uses 'utf8', though.
  this.defaultEncoding = options.defaultEncoding || 'utf8';

  // not an actual buffer we keep track of, but a measurement
  // of how much we're waiting to get pushed to some underlying
  // socket or file.
  this.length = 0;

  // a flag to see when we're in the middle of a write.
  this.writing = false;

  // when true all writes will be buffered until .uncork() call
  this.corked = 0;

  // a flag to be able to tell if the onwrite cb is called immediately,
  // or on a later tick.  We set this to true at first, because any
  // actions that shouldn't happen until "later" should generally also
  // not happen before the first write call.
  this.sync = true;

  // a flag to know if we're processing previously buffered items, which
  // may call the _write() callback in the same tick, so that we don't
  // end up in an overlapped onwrite situation.
  this.bufferProcessing = false;

  // the callback that's passed to _write(chunk,cb)
  this.onwrite = function (er) {
    onwrite(stream, er);
  };

  // the callback that the user supplies to write(chunk,encoding,cb)
  this.writecb = null;

  // the amount that is being written when _write is called.
  this.writelen = 0;
  this.bufferedRequest = null;
  this.lastBufferedRequest = null;

  // number of pending user-supplied write callbacks
  // this must be 0 before 'finish' can be emitted
  this.pendingcb = 0;

  // emit prefinish if the only thing we're waiting for is _write cbs
  // This is relevant for synchronous Transform streams
  this.prefinished = false;

  // True if the error was already emitted and should not be thrown again
  this.errorEmitted = false;

  // Should close be emitted on destroy. Defaults to true.
  this.emitClose = options.emitClose !== false;

  // Should .destroy() be called after 'finish' (and potentially 'end')
  this.autoDestroy = !!options.autoDestroy;

  // count buffered requests
  this.bufferedRequestCount = 0;

  // allocate the first CorkedRequest, there is always
  // one allocated and free to use, and we maintain at most two
  this.corkedRequestsFree = new CorkedRequest(this);
}
WritableState.prototype.getBuffer = function getBuffer() {
  var current = this.bufferedRequest;
  var out = [];
  while (current) {
    out.push(current);
    current = current.next;
  }
  return out;
};
(function () {
  try {
    Object.defineProperty(WritableState.prototype, 'buffer', {
      get: internalUtil.deprecate(function writableStateBufferGetter() {
        return this.getBuffer();
      }, '_writableState.buffer is deprecated. Use _writableState.getBuffer ' + 'instead.', 'DEP0003')
    });
  } catch (_) {}
})();

// Test _writableState for inheritance to account for Duplex streams,
// whose prototype chain only points to Readable.
var realHasInstance;
if (typeof Symbol === 'function' && Symbol.hasInstance && typeof Function.prototype[Symbol.hasInstance] === 'function') {
  realHasInstance = Function.prototype[Symbol.hasInstance];
  Object.defineProperty(Writable, Symbol.hasInstance, {
    value: function value(object) {
      if (realHasInstance.call(this, object)) return true;
      if (this !== Writable) return false;
      return object && object._writableState instanceof WritableState;
    }
  });
} else {
  realHasInstance = function realHasInstance(object) {
    return object instanceof this;
  };
}
function Writable(options) {
  Duplex = Duplex || __webpack_require__(3653);

  // Writable ctor is applied to Duplexes, too.
  // `realHasInstance` is necessary because using plain `instanceof`
  // would return false, as no `_writableState` property is attached.

  // Trying to use the custom `instanceof` for Writable here will also break the
  // Node.js LazyTransform implementation, which has a non-trivial getter for
  // `_writableState` that would lead to infinite recursion.

  // Checking for a Stream.Duplex instance is faster here instead of inside
  // the WritableState constructor, at least with V8 6.5
  var isDuplex = this instanceof Duplex;
  if (!isDuplex && !realHasInstance.call(Writable, this)) return new Writable(options);
  this._writableState = new WritableState(options, this, isDuplex);

  // legacy.
  this.writable = true;
  if (options) {
    if (typeof options.write === 'function') this._write = options.write;
    if (typeof options.writev === 'function') this._writev = options.writev;
    if (typeof options.destroy === 'function') this._destroy = options.destroy;
    if (typeof options["final"] === 'function') this._final = options["final"];
  }
  Stream.call(this);
}

// Otherwise people can pipe Writable streams, which is just wrong.
Writable.prototype.pipe = function () {
  errorOrDestroy(this, new ERR_STREAM_CANNOT_PIPE());
};
function writeAfterEnd(stream, cb) {
  var er = new ERR_STREAM_WRITE_AFTER_END();
  // TODO: defer error events consistently everywhere, not just the cb
  errorOrDestroy(stream, er);
  process.nextTick(cb, er);
}

// Checks that a user-supplied chunk is valid, especially for the particular
// mode the stream is in. Currently this means that `null` is never accepted
// and undefined/non-string values are only allowed in object mode.
function validChunk(stream, state, chunk, cb) {
  var er;
  if (chunk === null) {
    er = new ERR_STREAM_NULL_VALUES();
  } else if (typeof chunk !== 'string' && !state.objectMode) {
    er = new ERR_INVALID_ARG_TYPE('chunk', ['string', 'Buffer'], chunk);
  }
  if (er) {
    errorOrDestroy(stream, er);
    process.nextTick(cb, er);
    return false;
  }
  return true;
}
Writable.prototype.write = function (chunk, encoding, cb) {
  var state = this._writableState;
  var ret = false;
  var isBuf = !state.objectMode && _isUint8Array(chunk);
  if (isBuf && !Buffer.isBuffer(chunk)) {
    chunk = _uint8ArrayToBuffer(chunk);
  }
  if (typeof encoding === 'function') {
    cb = encoding;
    encoding = null;
  }
  if (isBuf) encoding = 'buffer';else if (!encoding) encoding = state.defaultEncoding;
  if (typeof cb !== 'function') cb = nop;
  if (state.ending) writeAfterEnd(this, cb);else if (isBuf || validChunk(this, state, chunk, cb)) {
    state.pendingcb++;
    ret = writeOrBuffer(this, state, isBuf, chunk, encoding, cb);
  }
  return ret;
};
Writable.prototype.cork = function () {
  this._writableState.corked++;
};
Writable.prototype.uncork = function () {
  var state = this._writableState;
  if (state.corked) {
    state.corked--;
    if (!state.writing && !state.corked && !state.bufferProcessing && state.bufferedRequest) clearBuffer(this, state);
  }
};
Writable.prototype.setDefaultEncoding = function setDefaultEncoding(encoding) {
  // node::ParseEncoding() requires lower case.
  if (typeof encoding === 'string') encoding = encoding.toLowerCase();
  if (!(['hex', 'utf8', 'utf-8', 'ascii', 'binary', 'base64', 'ucs2', 'ucs-2', 'utf16le', 'utf-16le', 'raw'].indexOf((encoding + '').toLowerCase()) > -1)) throw new ERR_UNKNOWN_ENCODING(encoding);
  this._writableState.defaultEncoding = encoding;
  return this;
};
Object.defineProperty(Writable.prototype, 'writableBuffer', {
  // making it explicit this property is not enumerable
  // because otherwise some prototype manipulation in
  // userland will fail
  enumerable: false,
  get: function get() {
    return this._writableState && this._writableState.getBuffer();
  }
});
function decodeChunk(state, chunk, encoding) {
  if (!state.objectMode && state.decodeStrings !== false && typeof chunk === 'string') {
    chunk = Buffer.from(chunk, encoding);
  }
  return chunk;
}
Object.defineProperty(Writable.prototype, 'writableHighWaterMark', {
  // making it explicit this property is not enumerable
  // because otherwise some prototype manipulation in
  // userland will fail
  enumerable: false,
  get: function get() {
    return this._writableState.highWaterMark;
  }
});

// if we're already writing something, then just put this
// in the queue, and wait our turn.  Otherwise, call _write
// If we return false, then we need a drain event, so set that flag.
function writeOrBuffer(stream, state, isBuf, chunk, encoding, cb) {
  if (!isBuf) {
    var newChunk = decodeChunk(state, chunk, encoding);
    if (chunk !== newChunk) {
      isBuf = true;
      encoding = 'buffer';
      chunk = newChunk;
    }
  }
  var len = state.objectMode ? 1 : chunk.length;
  state.length += len;
  var ret = state.length < state.highWaterMark;
  // we must ensure that previous needDrain will not be reset to false.
  if (!ret) state.needDrain = true;
  if (state.writing || state.corked) {
    var last = state.lastBufferedRequest;
    state.lastBufferedRequest = {
      chunk: chunk,
      encoding: encoding,
      isBuf: isBuf,
      callback: cb,
      next: null
    };
    if (last) {
      last.next = state.lastBufferedRequest;
    } else {
      state.bufferedRequest = state.lastBufferedRequest;
    }
    state.bufferedRequestCount += 1;
  } else {
    doWrite(stream, state, false, len, chunk, encoding, cb);
  }
  return ret;
}
function doWrite(stream, state, writev, len, chunk, encoding, cb) {
  state.writelen = len;
  state.writecb = cb;
  state.writing = true;
  state.sync = true;
  if (state.destroyed) state.onwrite(new ERR_STREAM_DESTROYED('write'));else if (writev) stream._writev(chunk, state.onwrite);else stream._write(chunk, encoding, state.onwrite);
  state.sync = false;
}
function onwriteError(stream, state, sync, er, cb) {
  --state.pendingcb;
  if (sync) {
    // defer the callback if we are being called synchronously
    // to avoid piling up things on the stack
    process.nextTick(cb, er);
    // this can emit finish, and it will always happen
    // after error
    process.nextTick(finishMaybe, stream, state);
    stream._writableState.errorEmitted = true;
    errorOrDestroy(stream, er);
  } else {
    // the caller expect this to happen before if
    // it is async
    cb(er);
    stream._writableState.errorEmitted = true;
    errorOrDestroy(stream, er);
    // this can emit finish, but finish must
    // always follow error
    finishMaybe(stream, state);
  }
}
function onwriteStateUpdate(state) {
  state.writing = false;
  state.writecb = null;
  state.length -= state.writelen;
  state.writelen = 0;
}
function onwrite(stream, er) {
  var state = stream._writableState;
  var sync = state.sync;
  var cb = state.writecb;
  if (typeof cb !== 'function') throw new ERR_MULTIPLE_CALLBACK();
  onwriteStateUpdate(state);
  if (er) onwriteError(stream, state, sync, er, cb);else {
    // Check if we're actually ready to finish, but don't emit yet
    var finished = needFinish(state) || stream.destroyed;
    if (!finished && !state.corked && !state.bufferProcessing && state.bufferedRequest) {
      clearBuffer(stream, state);
    }
    if (sync) {
      process.nextTick(afterWrite, stream, state, finished, cb);
    } else {
      afterWrite(stream, state, finished, cb);
    }
  }
}
function afterWrite(stream, state, finished, cb) {
  if (!finished) onwriteDrain(stream, state);
  state.pendingcb--;
  cb();
  finishMaybe(stream, state);
}

// Must force callback to be called on nextTick, so that we don't
// emit 'drain' before the write() consumer gets the 'false' return
// value, and has a chance to attach a 'drain' listener.
function onwriteDrain(stream, state) {
  if (state.length === 0 && state.needDrain) {
    state.needDrain = false;
    stream.emit('drain');
  }
}

// if there's something in the buffer waiting, then process it
function clearBuffer(stream, state) {
  state.bufferProcessing = true;
  var entry = state.bufferedRequest;
  if (stream._writev && entry && entry.next) {
    // Fast case, write everything using _writev()
    var l = state.bufferedRequestCount;
    var buffer = new Array(l);
    var holder = state.corkedRequestsFree;
    holder.entry = entry;
    var count = 0;
    var allBuffers = true;
    while (entry) {
      buffer[count] = entry;
      if (!entry.isBuf) allBuffers = false;
      entry = entry.next;
      count += 1;
    }
    buffer.allBuffers = allBuffers;
    doWrite(stream, state, true, state.length, buffer, '', holder.finish);

    // doWrite is almost always async, defer these to save a bit of time
    // as the hot path ends with doWrite
    state.pendingcb++;
    state.lastBufferedRequest = null;
    if (holder.next) {
      state.corkedRequestsFree = holder.next;
      holder.next = null;
    } else {
      state.corkedRequestsFree = new CorkedRequest(state);
    }
    state.bufferedRequestCount = 0;
  } else {
    // Slow case, write chunks one-by-one
    while (entry) {
      var chunk = entry.chunk;
      var encoding = entry.encoding;
      var cb = entry.callback;
      var len = state.objectMode ? 1 : chunk.length;
      doWrite(stream, state, false, len, chunk, encoding, cb);
      entry = entry.next;
      state.bufferedRequestCount--;
      // if we didn't call the onwrite immediately, then
      // it means that we need to wait until it does.
      // also, that means that the chunk and cb are currently
      // being processed, so move the buffer counter past them.
      if (state.writing) {
        break;
      }
    }
    if (entry === null) state.lastBufferedRequest = null;
  }
  state.bufferedRequest = entry;
  state.bufferProcessing = false;
}
Writable.prototype._write = function (chunk, encoding, cb) {
  cb(new ERR_METHOD_NOT_IMPLEMENTED('_write()'));
};
Writable.prototype._writev = null;
Writable.prototype.end = function (chunk, encoding, cb) {
  var state = this._writableState;
  if (typeof chunk === 'function') {
    cb = chunk;
    chunk = null;
    encoding = null;
  } else if (typeof encoding === 'function') {
    cb = encoding;
    encoding = null;
  }
  if (chunk !== null && chunk !== undefined) this.write(chunk, encoding);

  // .end() fully uncorks
  if (state.corked) {
    state.corked = 1;
    this.uncork();
  }

  // ignore unnecessary end() calls.
  if (!state.ending) endWritable(this, state, cb);
  return this;
};
Object.defineProperty(Writable.prototype, 'writableLength', {
  // making it explicit this property is not enumerable
  // because otherwise some prototype manipulation in
  // userland will fail
  enumerable: false,
  get: function get() {
    return this._writableState.length;
  }
});
function needFinish(state) {
  return state.ending && state.length === 0 && state.bufferedRequest === null && !state.finished && !state.writing;
}
function callFinal(stream, state) {
  stream._final(function (err) {
    state.pendingcb--;
    if (err) {
      errorOrDestroy(stream, err);
    }
    state.prefinished = true;
    stream.emit('prefinish');
    finishMaybe(stream, state);
  });
}
function prefinish(stream, state) {
  if (!state.prefinished && !state.finalCalled) {
    if (typeof stream._final === 'function' && !state.destroyed) {
      state.pendingcb++;
      state.finalCalled = true;
      process.nextTick(callFinal, stream, state);
    } else {
      state.prefinished = true;
      stream.emit('prefinish');
    }
  }
}
function finishMaybe(stream, state) {
  var need = needFinish(state);
  if (need) {
    prefinish(stream, state);
    if (state.pendingcb === 0) {
      state.finished = true;
      stream.emit('finish');
      if (state.autoDestroy) {
        // In case of duplex streams we need a way to detect
        // if the readable side is ready for autoDestroy as well
        var rState = stream._readableState;
        if (!rState || rState.autoDestroy && rState.endEmitted) {
          stream.destroy();
        }
      }
    }
  }
  return need;
}
function endWritable(stream, state, cb) {
  state.ending = true;
  finishMaybe(stream, state);
  if (cb) {
    if (state.finished) process.nextTick(cb);else stream.once('finish', cb);
  }
  state.ended = true;
  stream.writable = false;
}
function onCorkedFinish(corkReq, state, err) {
  var entry = corkReq.entry;
  corkReq.entry = null;
  while (entry) {
    var cb = entry.callback;
    state.pendingcb--;
    cb(err);
    entry = entry.next;
  }

  // reuse the free corkReq.
  state.corkedRequestsFree.next = corkReq;
}
Object.defineProperty(Writable.prototype, 'destroyed', {
  // making it explicit this property is not enumerable
  // because otherwise some prototype manipulation in
  // userland will fail
  enumerable: false,
  get: function get() {
    if (this._writableState === undefined) {
      return false;
    }
    return this._writableState.destroyed;
  },
  set: function set(value) {
    // we ignore the value if the stream
    // has not been initialized yet
    if (!this._writableState) {
      return;
    }

    // backward compatibility, the user is explicitly
    // managing destroyed
    this._writableState.destroyed = value;
  }
});
Writable.prototype.destroy = destroyImpl.destroy;
Writable.prototype._undestroy = destroyImpl.undestroy;
Writable.prototype._destroy = function (err, cb) {
  cb(err);
};

/***/ }),

/***/ 4258:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
/* provided dependency */ var process = __webpack_require__(2790);


function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
var _Object$setPrototypeO;
function _defineProperty(obj, key, value) {
  key = _toPropertyKey(key);
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }
  return obj;
}
function _toPropertyKey(arg) {
  var key = _toPrimitive(arg, "string");
  return _typeof(key) === "symbol" ? key : String(key);
}
function _toPrimitive(input, hint) {
  if (_typeof(input) !== "object" || input === null) return input;
  var prim = input[Symbol.toPrimitive];
  if (prim !== undefined) {
    var res = prim.call(input, hint || "default");
    if (_typeof(res) !== "object") return res;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (hint === "string" ? String : Number)(input);
}
var finished = __webpack_require__(6591);
var kLastResolve = Symbol('lastResolve');
var kLastReject = Symbol('lastReject');
var kError = Symbol('error');
var kEnded = Symbol('ended');
var kLastPromise = Symbol('lastPromise');
var kHandlePromise = Symbol('handlePromise');
var kStream = Symbol('stream');
function createIterResult(value, done) {
  return {
    value: value,
    done: done
  };
}
function readAndResolve(iter) {
  var resolve = iter[kLastResolve];
  if (resolve !== null) {
    var data = iter[kStream].read();
    // we defer if data is null
    // we can be expecting either 'end' or
    // 'error'
    if (data !== null) {
      iter[kLastPromise] = null;
      iter[kLastResolve] = null;
      iter[kLastReject] = null;
      resolve(createIterResult(data, false));
    }
  }
}
function onReadable(iter) {
  // we wait for the next tick, because it might
  // emit an error with process.nextTick
  process.nextTick(readAndResolve, iter);
}
function wrapForNext(lastPromise, iter) {
  return function (resolve, reject) {
    lastPromise.then(function () {
      if (iter[kEnded]) {
        resolve(createIterResult(undefined, true));
        return;
      }
      iter[kHandlePromise](resolve, reject);
    }, reject);
  };
}
var AsyncIteratorPrototype = Object.getPrototypeOf(function () {});
var ReadableStreamAsyncIteratorPrototype = Object.setPrototypeOf((_Object$setPrototypeO = {
  get stream() {
    return this[kStream];
  },
  next: function next() {
    var _this = this;
    // if we have detected an error in the meanwhile
    // reject straight away
    var error = this[kError];
    if (error !== null) {
      return Promise.reject(error);
    }
    if (this[kEnded]) {
      return Promise.resolve(createIterResult(undefined, true));
    }
    if (this[kStream].destroyed) {
      // We need to defer via nextTick because if .destroy(err) is
      // called, the error will be emitted via nextTick, and
      // we cannot guarantee that there is no error lingering around
      // waiting to be emitted.
      return new Promise(function (resolve, reject) {
        process.nextTick(function () {
          if (_this[kError]) {
            reject(_this[kError]);
          } else {
            resolve(createIterResult(undefined, true));
          }
        });
      });
    }

    // if we have multiple next() calls
    // we will wait for the previous Promise to finish
    // this logic is optimized to support for await loops,
    // where next() is only called once at a time
    var lastPromise = this[kLastPromise];
    var promise;
    if (lastPromise) {
      promise = new Promise(wrapForNext(lastPromise, this));
    } else {
      // fast path needed to support multiple this.push()
      // without triggering the next() queue
      var data = this[kStream].read();
      if (data !== null) {
        return Promise.resolve(createIterResult(data, false));
      }
      promise = new Promise(this[kHandlePromise]);
    }
    this[kLastPromise] = promise;
    return promise;
  }
}, _defineProperty(_Object$setPrototypeO, Symbol.asyncIterator, function () {
  return this;
}), _defineProperty(_Object$setPrototypeO, "return", function _return() {
  var _this2 = this;
  // destroy(err, cb) is a private API
  // we can guarantee we have that here, because we control the
  // Readable class this is attached to
  return new Promise(function (resolve, reject) {
    _this2[kStream].destroy(null, function (err) {
      if (err) {
        reject(err);
        return;
      }
      resolve(createIterResult(undefined, true));
    });
  });
}), _Object$setPrototypeO), AsyncIteratorPrototype);
var createReadableStreamAsyncIterator = function createReadableStreamAsyncIterator(stream) {
  var _Object$create;
  var iterator = Object.create(ReadableStreamAsyncIteratorPrototype, (_Object$create = {}, _defineProperty(_Object$create, kStream, {
    value: stream,
    writable: true
  }), _defineProperty(_Object$create, kLastResolve, {
    value: null,
    writable: true
  }), _defineProperty(_Object$create, kLastReject, {
    value: null,
    writable: true
  }), _defineProperty(_Object$create, kError, {
    value: null,
    writable: true
  }), _defineProperty(_Object$create, kEnded, {
    value: stream._readableState.endEmitted,
    writable: true
  }), _defineProperty(_Object$create, kHandlePromise, {
    value: function value(resolve, reject) {
      var data = iterator[kStream].read();
      if (data) {
        iterator[kLastPromise] = null;
        iterator[kLastResolve] = null;
        iterator[kLastReject] = null;
        resolve(createIterResult(data, false));
      } else {
        iterator[kLastResolve] = resolve;
        iterator[kLastReject] = reject;
      }
    },
    writable: true
  }), _Object$create));
  iterator[kLastPromise] = null;
  finished(stream, function (err) {
    if (err && err.code !== 'ERR_STREAM_PREMATURE_CLOSE') {
      var reject = iterator[kLastReject];
      // reject if we are waiting for data in the Promise
      // returned by next() and store the error
      if (reject !== null) {
        iterator[kLastPromise] = null;
        iterator[kLastResolve] = null;
        iterator[kLastReject] = null;
        reject(err);
      }
      iterator[kError] = err;
      return;
    }
    var resolve = iterator[kLastResolve];
    if (resolve !== null) {
      iterator[kLastPromise] = null;
      iterator[kLastResolve] = null;
      iterator[kLastReject] = null;
      resolve(createIterResult(undefined, true));
    }
    iterator[kEnded] = true;
  });
  stream.on('readable', onReadable.bind(null, iterator));
  return iterator;
};
module.exports = createReadableStreamAsyncIterator;

/***/ }),

/***/ 2923:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function ownKeys(object, enumerableOnly) {
  var keys = Object.keys(object);
  if (Object.getOwnPropertySymbols) {
    var symbols = Object.getOwnPropertySymbols(object);
    enumerableOnly && (symbols = symbols.filter(function (sym) {
      return Object.getOwnPropertyDescriptor(object, sym).enumerable;
    })), keys.push.apply(keys, symbols);
  }
  return keys;
}
function _objectSpread(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = null != arguments[i] ? arguments[i] : {};
    i % 2 ? ownKeys(Object(source), !0).forEach(function (key) {
      _defineProperty(target, key, source[key]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) {
      Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
    });
  }
  return target;
}
function _defineProperty(obj, key, value) {
  key = _toPropertyKey(key);
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }
  return obj;
}
function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}
function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor);
  }
}
function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  Object.defineProperty(Constructor, "prototype", {
    writable: false
  });
  return Constructor;
}
function _toPropertyKey(arg) {
  var key = _toPrimitive(arg, "string");
  return _typeof(key) === "symbol" ? key : String(key);
}
function _toPrimitive(input, hint) {
  if (_typeof(input) !== "object" || input === null) return input;
  var prim = input[Symbol.toPrimitive];
  if (prim !== undefined) {
    var res = prim.call(input, hint || "default");
    if (_typeof(res) !== "object") return res;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (hint === "string" ? String : Number)(input);
}
var _require = __webpack_require__(5851),
  Buffer = _require.Buffer;
var _require2 = __webpack_require__(2361),
  inspect = _require2.inspect;
var custom = inspect && inspect.custom || 'inspect';
function copyBuffer(src, target, offset) {
  Buffer.prototype.copy.call(src, target, offset);
}
module.exports = /*#__PURE__*/function () {
  function BufferList() {
    _classCallCheck(this, BufferList);
    this.head = null;
    this.tail = null;
    this.length = 0;
  }
  _createClass(BufferList, [{
    key: "push",
    value: function push(v) {
      var entry = {
        data: v,
        next: null
      };
      if (this.length > 0) this.tail.next = entry;else this.head = entry;
      this.tail = entry;
      ++this.length;
    }
  }, {
    key: "unshift",
    value: function unshift(v) {
      var entry = {
        data: v,
        next: this.head
      };
      if (this.length === 0) this.tail = entry;
      this.head = entry;
      ++this.length;
    }
  }, {
    key: "shift",
    value: function shift() {
      if (this.length === 0) return;
      var ret = this.head.data;
      if (this.length === 1) this.head = this.tail = null;else this.head = this.head.next;
      --this.length;
      return ret;
    }
  }, {
    key: "clear",
    value: function clear() {
      this.head = this.tail = null;
      this.length = 0;
    }
  }, {
    key: "join",
    value: function join(s) {
      if (this.length === 0) return '';
      var p = this.head;
      var ret = '' + p.data;
      while (p = p.next) ret += s + p.data;
      return ret;
    }
  }, {
    key: "concat",
    value: function concat(n) {
      if (this.length === 0) return Buffer.alloc(0);
      var ret = Buffer.allocUnsafe(n >>> 0);
      var p = this.head;
      var i = 0;
      while (p) {
        copyBuffer(p.data, ret, i);
        i += p.data.length;
        p = p.next;
      }
      return ret;
    }

    // Consumes a specified amount of bytes or characters from the buffered data.
  }, {
    key: "consume",
    value: function consume(n, hasStrings) {
      var ret;
      if (n < this.head.data.length) {
        // `slice` is the same for buffers and strings.
        ret = this.head.data.slice(0, n);
        this.head.data = this.head.data.slice(n);
      } else if (n === this.head.data.length) {
        // First chunk is a perfect match.
        ret = this.shift();
      } else {
        // Result spans more than one buffer.
        ret = hasStrings ? this._getString(n) : this._getBuffer(n);
      }
      return ret;
    }
  }, {
    key: "first",
    value: function first() {
      return this.head.data;
    }

    // Consumes a specified amount of characters from the buffered data.
  }, {
    key: "_getString",
    value: function _getString(n) {
      var p = this.head;
      var c = 1;
      var ret = p.data;
      n -= ret.length;
      while (p = p.next) {
        var str = p.data;
        var nb = n > str.length ? str.length : n;
        if (nb === str.length) ret += str;else ret += str.slice(0, n);
        n -= nb;
        if (n === 0) {
          if (nb === str.length) {
            ++c;
            if (p.next) this.head = p.next;else this.head = this.tail = null;
          } else {
            this.head = p;
            p.data = str.slice(nb);
          }
          break;
        }
        ++c;
      }
      this.length -= c;
      return ret;
    }

    // Consumes a specified amount of bytes from the buffered data.
  }, {
    key: "_getBuffer",
    value: function _getBuffer(n) {
      var ret = Buffer.allocUnsafe(n);
      var p = this.head;
      var c = 1;
      p.data.copy(ret);
      n -= p.data.length;
      while (p = p.next) {
        var buf = p.data;
        var nb = n > buf.length ? buf.length : n;
        buf.copy(ret, ret.length - n, 0, nb);
        n -= nb;
        if (n === 0) {
          if (nb === buf.length) {
            ++c;
            if (p.next) this.head = p.next;else this.head = this.tail = null;
          } else {
            this.head = p;
            p.data = buf.slice(nb);
          }
          break;
        }
        ++c;
      }
      this.length -= c;
      return ret;
    }

    // Make sure the linked list only shows the minimal necessary information.
  }, {
    key: custom,
    value: function value(_, options) {
      return inspect(this, _objectSpread(_objectSpread({}, options), {}, {
        // Only inspect one level.
        depth: 0,
        // It should not recurse.
        customInspect: false
      }));
    }
  }]);
  return BufferList;
}();

/***/ }),

/***/ 1735:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
/* provided dependency */ var process = __webpack_require__(2790);


// undocumented cb() API, needed for core, not for public API
function destroy(err, cb) {
  var _this = this;
  var readableDestroyed = this._readableState && this._readableState.destroyed;
  var writableDestroyed = this._writableState && this._writableState.destroyed;
  if (readableDestroyed || writableDestroyed) {
    if (cb) {
      cb(err);
    } else if (err) {
      if (!this._writableState) {
        process.nextTick(emitErrorNT, this, err);
      } else if (!this._writableState.errorEmitted) {
        this._writableState.errorEmitted = true;
        process.nextTick(emitErrorNT, this, err);
      }
    }
    return this;
  }

  // we set destroyed to true before firing error callbacks in order
  // to make it re-entrance safe in case destroy() is called within callbacks

  if (this._readableState) {
    this._readableState.destroyed = true;
  }

  // if this is a duplex stream mark the writable part as destroyed as well
  if (this._writableState) {
    this._writableState.destroyed = true;
  }
  this._destroy(err || null, function (err) {
    if (!cb && err) {
      if (!_this._writableState) {
        process.nextTick(emitErrorAndCloseNT, _this, err);
      } else if (!_this._writableState.errorEmitted) {
        _this._writableState.errorEmitted = true;
        process.nextTick(emitErrorAndCloseNT, _this, err);
      } else {
        process.nextTick(emitCloseNT, _this);
      }
    } else if (cb) {
      process.nextTick(emitCloseNT, _this);
      cb(err);
    } else {
      process.nextTick(emitCloseNT, _this);
    }
  });
  return this;
}
function emitErrorAndCloseNT(self, err) {
  emitErrorNT(self, err);
  emitCloseNT(self);
}
function emitCloseNT(self) {
  if (self._writableState && !self._writableState.emitClose) return;
  if (self._readableState && !self._readableState.emitClose) return;
  self.emit('close');
}
function undestroy() {
  if (this._readableState) {
    this._readableState.destroyed = false;
    this._readableState.reading = false;
    this._readableState.ended = false;
    this._readableState.endEmitted = false;
  }
  if (this._writableState) {
    this._writableState.destroyed = false;
    this._writableState.ended = false;
    this._writableState.ending = false;
    this._writableState.finalCalled = false;
    this._writableState.prefinished = false;
    this._writableState.finished = false;
    this._writableState.errorEmitted = false;
  }
}
function emitErrorNT(self, err) {
  self.emit('error', err);
}
function errorOrDestroy(stream, err) {
  // We have tests that rely on errors being emitted
  // in the same tick, so changing this is semver major.
  // For now when you opt-in to autoDestroy we allow
  // the error to be emitted nextTick. In a future
  // semver major update we should change the default to this.

  var rState = stream._readableState;
  var wState = stream._writableState;
  if (rState && rState.autoDestroy || wState && wState.autoDestroy) stream.destroy(err);else stream.emit('error', err);
}
module.exports = {
  destroy: destroy,
  undestroy: undestroy,
  errorOrDestroy: errorOrDestroy
};

/***/ }),

/***/ 6591:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
// Ported from https://github.com/mafintosh/end-of-stream with
// permission from the author, Mathias Buus (@mafintosh).



var ERR_STREAM_PREMATURE_CLOSE = (__webpack_require__(352)/* .codes */ .q).ERR_STREAM_PREMATURE_CLOSE;
function once(callback) {
  var called = false;
  return function () {
    if (called) return;
    called = true;
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }
    callback.apply(this, args);
  };
}
function noop() {}
function isRequest(stream) {
  return stream.setHeader && typeof stream.abort === 'function';
}
function eos(stream, opts, callback) {
  if (typeof opts === 'function') return eos(stream, null, opts);
  if (!opts) opts = {};
  callback = once(callback || noop);
  var readable = opts.readable || opts.readable !== false && stream.readable;
  var writable = opts.writable || opts.writable !== false && stream.writable;
  var onlegacyfinish = function onlegacyfinish() {
    if (!stream.writable) onfinish();
  };
  var writableEnded = stream._writableState && stream._writableState.finished;
  var onfinish = function onfinish() {
    writable = false;
    writableEnded = true;
    if (!readable) callback.call(stream);
  };
  var readableEnded = stream._readableState && stream._readableState.endEmitted;
  var onend = function onend() {
    readable = false;
    readableEnded = true;
    if (!writable) callback.call(stream);
  };
  var onerror = function onerror(err) {
    callback.call(stream, err);
  };
  var onclose = function onclose() {
    var err;
    if (readable && !readableEnded) {
      if (!stream._readableState || !stream._readableState.ended) err = new ERR_STREAM_PREMATURE_CLOSE();
      return callback.call(stream, err);
    }
    if (writable && !writableEnded) {
      if (!stream._writableState || !stream._writableState.ended) err = new ERR_STREAM_PREMATURE_CLOSE();
      return callback.call(stream, err);
    }
  };
  var onrequest = function onrequest() {
    stream.req.on('finish', onfinish);
  };
  if (isRequest(stream)) {
    stream.on('complete', onfinish);
    stream.on('abort', onclose);
    if (stream.req) onrequest();else stream.on('request', onrequest);
  } else if (writable && !stream._writableState) {
    // legacy streams
    stream.on('end', onlegacyfinish);
    stream.on('close', onlegacyfinish);
  }
  stream.on('end', onend);
  stream.on('finish', onfinish);
  if (opts.error !== false) stream.on('error', onerror);
  stream.on('close', onclose);
  return function () {
    stream.removeListener('complete', onfinish);
    stream.removeListener('abort', onclose);
    stream.removeListener('request', onrequest);
    if (stream.req) stream.req.removeListener('finish', onfinish);
    stream.removeListener('end', onlegacyfinish);
    stream.removeListener('close', onlegacyfinish);
    stream.removeListener('finish', onfinish);
    stream.removeListener('end', onend);
    stream.removeListener('error', onerror);
    stream.removeListener('close', onclose);
  };
}
module.exports = eos;

/***/ }),

/***/ 7766:
/***/ ((module) => {

module.exports = function () {
  throw new Error('Readable.from is not available in the browser');
};

/***/ }),

/***/ 5879:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
// Ported from https://github.com/mafintosh/pump with
// permission from the author, Mathias Buus (@mafintosh).



var eos;
function once(callback) {
  var called = false;
  return function () {
    if (called) return;
    called = true;
    callback.apply(void 0, arguments);
  };
}
var _require$codes = (__webpack_require__(352)/* .codes */ .q),
  ERR_MISSING_ARGS = _require$codes.ERR_MISSING_ARGS,
  ERR_STREAM_DESTROYED = _require$codes.ERR_STREAM_DESTROYED;
function noop(err) {
  // Rethrow the error if it exists to avoid swallowing it
  if (err) throw err;
}
function isRequest(stream) {
  return stream.setHeader && typeof stream.abort === 'function';
}
function destroyer(stream, reading, writing, callback) {
  callback = once(callback);
  var closed = false;
  stream.on('close', function () {
    closed = true;
  });
  if (eos === undefined) eos = __webpack_require__(6591);
  eos(stream, {
    readable: reading,
    writable: writing
  }, function (err) {
    if (err) return callback(err);
    closed = true;
    callback();
  });
  var destroyed = false;
  return function (err) {
    if (closed) return;
    if (destroyed) return;
    destroyed = true;

    // request.destroy just do .end - .abort is what we want
    if (isRequest(stream)) return stream.abort();
    if (typeof stream.destroy === 'function') return stream.destroy();
    callback(err || new ERR_STREAM_DESTROYED('pipe'));
  };
}
function call(fn) {
  fn();
}
function pipe(from, to) {
  return from.pipe(to);
}
function popCallback(streams) {
  if (!streams.length) return noop;
  if (typeof streams[streams.length - 1] !== 'function') return noop;
  return streams.pop();
}
function pipeline() {
  for (var _len = arguments.length, streams = new Array(_len), _key = 0; _key < _len; _key++) {
    streams[_key] = arguments[_key];
  }
  var callback = popCallback(streams);
  if (Array.isArray(streams[0])) streams = streams[0];
  if (streams.length < 2) {
    throw new ERR_MISSING_ARGS('streams');
  }
  var error;
  var destroys = streams.map(function (stream, i) {
    var reading = i < streams.length - 1;
    var writing = i > 0;
    return destroyer(stream, reading, writing, function (err) {
      if (!error) error = err;
      if (err) destroys.forEach(call);
      if (reading) return;
      destroys.forEach(call);
      callback(error);
    });
  });
  return streams.reduce(pipe);
}
module.exports = pipeline;

/***/ }),

/***/ 9604:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var ERR_INVALID_OPT_VALUE = (__webpack_require__(352)/* .codes */ .q).ERR_INVALID_OPT_VALUE;
function highWaterMarkFrom(options, isDuplex, duplexKey) {
  return options.highWaterMark != null ? options.highWaterMark : isDuplex ? options[duplexKey] : null;
}
function getHighWaterMark(state, options, duplexKey, isDuplex) {
  var hwm = highWaterMarkFrom(options, isDuplex, duplexKey);
  if (hwm != null) {
    if (!(isFinite(hwm) && Math.floor(hwm) === hwm) || hwm < 0) {
      var name = isDuplex ? duplexKey : 'highWaterMark';
      throw new ERR_INVALID_OPT_VALUE(name, hwm);
    }
    return Math.floor(hwm);
  }

  // Default value
  return state.objectMode ? 16 : 16 * 1024;
}
module.exports = {
  getHighWaterMark: getHighWaterMark
};

/***/ }),

/***/ 1773:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

module.exports = __webpack_require__(1590).EventEmitter;

/***/ }),

/***/ 9970:
/***/ ((module, exports, __webpack_require__) => {

exports = module.exports = __webpack_require__(8817);
exports.Stream = exports;
exports.Readable = exports;
exports.Writable = __webpack_require__(2248);
exports.Duplex = __webpack_require__(3653);
exports.Transform = __webpack_require__(5500);
exports.PassThrough = __webpack_require__(8210);
exports.finished = __webpack_require__(6591);
exports.pipeline = __webpack_require__(5879);

/***/ }),

/***/ 3311:
/***/ ((module, exports, __webpack_require__) => {

/*! safe-buffer. MIT License. Feross Aboukhadijeh <https://feross.org/opensource> */
/* eslint-disable node/no-deprecated-api */
var buffer = __webpack_require__(5851);
var Buffer = buffer.Buffer;

// alternative to using Object.keys for old browsers
function copyProps(src, dst) {
  for (var key in src) {
    dst[key] = src[key];
  }
}
if (Buffer.from && Buffer.alloc && Buffer.allocUnsafe && Buffer.allocUnsafeSlow) {
  module.exports = buffer;
} else {
  // Copy properties from require('buffer')
  copyProps(buffer, exports);
  exports.Buffer = SafeBuffer;
}
function SafeBuffer(arg, encodingOrOffset, length) {
  return Buffer(arg, encodingOrOffset, length);
}
SafeBuffer.prototype = Object.create(Buffer.prototype);

// Copy static methods from Buffer
copyProps(Buffer, SafeBuffer);
SafeBuffer.from = function (arg, encodingOrOffset, length) {
  if (typeof arg === 'number') {
    throw new TypeError('Argument must not be a number');
  }
  return Buffer(arg, encodingOrOffset, length);
};
SafeBuffer.alloc = function (size, fill, encoding) {
  if (typeof size !== 'number') {
    throw new TypeError('Argument must be a number');
  }
  var buf = Buffer(size);
  if (fill !== undefined) {
    if (typeof encoding === 'string') {
      buf.fill(fill, encoding);
    } else {
      buf.fill(fill);
    }
  } else {
    buf.fill(0);
  }
  return buf;
};
SafeBuffer.allocUnsafe = function (size) {
  if (typeof size !== 'number') {
    throw new TypeError('Argument must be a number');
  }
  return Buffer(size);
};
SafeBuffer.allocUnsafeSlow = function (size) {
  if (typeof size !== 'number') {
    throw new TypeError('Argument must be a number');
  }
  return buffer.SlowBuffer(size);
};

/***/ }),

/***/ 3555:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

/* provided dependency */ var Buffer = __webpack_require__(5851)["Buffer"];
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
;
(function (sax) {
  // wrapper for non-node envs
  sax.parser = function (strict, opt) {
    return new SAXParser(strict, opt);
  };
  sax.SAXParser = SAXParser;
  sax.SAXStream = SAXStream;
  sax.createStream = createStream;

  // When we pass the MAX_BUFFER_LENGTH position, start checking for buffer overruns.
  // When we check, schedule the next check for MAX_BUFFER_LENGTH - (max(buffer lengths)),
  // since that's the earliest that a buffer overrun could occur.  This way, checks are
  // as rare as required, but as often as necessary to ensure never crossing this bound.
  // Furthermore, buffers are only tested at most once per write(), so passing a very
  // large string into write() might have undesirable effects, but this is manageable by
  // the caller, so it is assumed to be safe.  Thus, a call to write() may, in the extreme
  // edge case, result in creating at most one complete copy of the string passed in.
  // Set to Infinity to have unlimited buffers.
  sax.MAX_BUFFER_LENGTH = 64 * 1024;
  var buffers = ['comment', 'sgmlDecl', 'textNode', 'tagName', 'doctype', 'procInstName', 'procInstBody', 'entity', 'attribName', 'attribValue', 'cdata', 'script'];
  sax.EVENTS = ['text', 'processinginstruction', 'sgmldeclaration', 'doctype', 'comment', 'opentagstart', 'attribute', 'opentag', 'closetag', 'opencdata', 'cdata', 'closecdata', 'error', 'end', 'ready', 'script', 'opennamespace', 'closenamespace'];
  function SAXParser(strict, opt) {
    if (!(this instanceof SAXParser)) {
      return new SAXParser(strict, opt);
    }
    var parser = this;
    clearBuffers(parser);
    parser.q = parser.c = '';
    parser.bufferCheckPosition = sax.MAX_BUFFER_LENGTH;
    parser.opt = opt || {};
    parser.opt.lowercase = parser.opt.lowercase || parser.opt.lowercasetags;
    parser.looseCase = parser.opt.lowercase ? 'toLowerCase' : 'toUpperCase';
    parser.tags = [];
    parser.closed = parser.closedRoot = parser.sawRoot = false;
    parser.tag = parser.error = null;
    parser.strict = !!strict;
    parser.noscript = !!(strict || parser.opt.noscript);
    parser.state = S.BEGIN;
    parser.strictEntities = parser.opt.strictEntities;
    parser.ENTITIES = parser.strictEntities ? Object.create(sax.XML_ENTITIES) : Object.create(sax.ENTITIES);
    parser.attribList = [];

    // namespaces form a prototype chain.
    // it always points at the current tag,
    // which protos to its parent tag.
    if (parser.opt.xmlns) {
      parser.ns = Object.create(rootNS);
    }

    // mostly just for error reporting
    parser.trackPosition = parser.opt.position !== false;
    if (parser.trackPosition) {
      parser.position = parser.line = parser.column = 0;
    }
    emit(parser, 'onready');
  }
  if (!Object.create) {
    Object.create = function (o) {
      function F() {}
      F.prototype = o;
      var newf = new F();
      return newf;
    };
  }
  if (!Object.keys) {
    Object.keys = function (o) {
      var a = [];
      for (var i in o) if (o.hasOwnProperty(i)) a.push(i);
      return a;
    };
  }
  function checkBufferLength(parser) {
    var maxAllowed = Math.max(sax.MAX_BUFFER_LENGTH, 10);
    var maxActual = 0;
    for (var i = 0, l = buffers.length; i < l; i++) {
      var len = parser[buffers[i]].length;
      if (len > maxAllowed) {
        // Text/cdata nodes can get big, and since they're buffered,
        // we can get here under normal conditions.
        // Avoid issues by emitting the text node now,
        // so at least it won't get any bigger.
        switch (buffers[i]) {
          case 'textNode':
            closeText(parser);
            break;
          case 'cdata':
            emitNode(parser, 'oncdata', parser.cdata);
            parser.cdata = '';
            break;
          case 'script':
            emitNode(parser, 'onscript', parser.script);
            parser.script = '';
            break;
          default:
            error(parser, 'Max buffer length exceeded: ' + buffers[i]);
        }
      }
      maxActual = Math.max(maxActual, len);
    }
    // schedule the next check for the earliest possible buffer overrun.
    var m = sax.MAX_BUFFER_LENGTH - maxActual;
    parser.bufferCheckPosition = m + parser.position;
  }
  function clearBuffers(parser) {
    for (var i = 0, l = buffers.length; i < l; i++) {
      parser[buffers[i]] = '';
    }
  }
  function flushBuffers(parser) {
    closeText(parser);
    if (parser.cdata !== '') {
      emitNode(parser, 'oncdata', parser.cdata);
      parser.cdata = '';
    }
    if (parser.script !== '') {
      emitNode(parser, 'onscript', parser.script);
      parser.script = '';
    }
  }
  SAXParser.prototype = {
    end: function end() {
      _end(this);
    },
    write: write,
    resume: function resume() {
      this.error = null;
      return this;
    },
    close: function close() {
      return this.write(null);
    },
    flush: function flush() {
      flushBuffers(this);
    }
  };
  var Stream;
  try {
    Stream = (__webpack_require__(9788).Stream);
  } catch (ex) {
    Stream = function Stream() {};
  }
  if (!Stream) Stream = function Stream() {};
  var streamWraps = sax.EVENTS.filter(function (ev) {
    return ev !== 'error' && ev !== 'end';
  });
  function createStream(strict, opt) {
    return new SAXStream(strict, opt);
  }
  function SAXStream(strict, opt) {
    if (!(this instanceof SAXStream)) {
      return new SAXStream(strict, opt);
    }
    Stream.apply(this);
    this._parser = new SAXParser(strict, opt);
    this.writable = true;
    this.readable = true;
    var me = this;
    this._parser.onend = function () {
      me.emit('end');
    };
    this._parser.onerror = function (er) {
      me.emit('error', er);

      // if didn't throw, then means error was handled.
      // go ahead and clear error, so we can write again.
      me._parser.error = null;
    };
    this._decoder = null;
    streamWraps.forEach(function (ev) {
      Object.defineProperty(me, 'on' + ev, {
        get: function get() {
          return me._parser['on' + ev];
        },
        set: function set(h) {
          if (!h) {
            me.removeAllListeners(ev);
            me._parser['on' + ev] = h;
            return h;
          }
          me.on(ev, h);
        },
        enumerable: true,
        configurable: false
      });
    });
  }
  SAXStream.prototype = Object.create(Stream.prototype, {
    constructor: {
      value: SAXStream
    }
  });
  SAXStream.prototype.write = function (data) {
    if (typeof Buffer === 'function' && typeof Buffer.isBuffer === 'function' && Buffer.isBuffer(data)) {
      if (!this._decoder) {
        var SD = (__webpack_require__(1907)/* .StringDecoder */ .s);
        this._decoder = new SD('utf8');
      }
      data = this._decoder.write(data);
    }
    this._parser.write(data.toString());
    this.emit('data', data);
    return true;
  };
  SAXStream.prototype.end = function (chunk) {
    if (chunk && chunk.length) {
      this.write(chunk);
    }
    this._parser.end();
    return true;
  };
  SAXStream.prototype.on = function (ev, handler) {
    var me = this;
    if (!me._parser['on' + ev] && streamWraps.indexOf(ev) !== -1) {
      me._parser['on' + ev] = function () {
        var args = arguments.length === 1 ? [arguments[0]] : Array.apply(null, arguments);
        args.splice(0, 0, ev);
        me.emit.apply(me, args);
      };
    }
    return Stream.prototype.on.call(me, ev, handler);
  };

  // this really needs to be replaced with character classes.
  // XML allows all manner of ridiculous numbers and digits.
  var CDATA = '[CDATA[';
  var DOCTYPE = 'DOCTYPE';
  var XML_NAMESPACE = 'http://www.w3.org/XML/1998/namespace';
  var XMLNS_NAMESPACE = 'http://www.w3.org/2000/xmlns/';
  var rootNS = {
    xml: XML_NAMESPACE,
    xmlns: XMLNS_NAMESPACE
  };

  // http://www.w3.org/TR/REC-xml/#NT-NameStartChar
  // This implementation works on strings, a single character at a time
  // as such, it cannot ever support astral-plane characters (10000-EFFFF)
  // without a significant breaking change to either this  parser, or the
  // JavaScript language.  Implementation of an emoji-capable xml parser
  // is left as an exercise for the reader.
  var nameStart = /[:_A-Za-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD]/;
  var nameBody = /[:_A-Za-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\u00B7\u0300-\u036F\u203F-\u2040.\d-]/;
  var entityStart = /[#:_A-Za-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD]/;
  var entityBody = /[#:_A-Za-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\u00B7\u0300-\u036F\u203F-\u2040.\d-]/;
  function isWhitespace(c) {
    return c === ' ' || c === '\n' || c === '\r' || c === '\t';
  }
  function isQuote(c) {
    return c === '"' || c === '\'';
  }
  function isAttribEnd(c) {
    return c === '>' || isWhitespace(c);
  }
  function isMatch(regex, c) {
    return regex.test(c);
  }
  function notMatch(regex, c) {
    return !isMatch(regex, c);
  }
  var S = 0;
  sax.STATE = {
    BEGIN: S++,
    // leading byte order mark or whitespace
    BEGIN_WHITESPACE: S++,
    // leading whitespace
    TEXT: S++,
    // general stuff
    TEXT_ENTITY: S++,
    // &amp and such.
    OPEN_WAKA: S++,
    // <
    SGML_DECL: S++,
    // <!BLARG
    SGML_DECL_QUOTED: S++,
    // <!BLARG foo "bar
    DOCTYPE: S++,
    // <!DOCTYPE
    DOCTYPE_QUOTED: S++,
    // <!DOCTYPE "//blah
    DOCTYPE_DTD: S++,
    // <!DOCTYPE "//blah" [ ...
    DOCTYPE_DTD_QUOTED: S++,
    // <!DOCTYPE "//blah" [ "foo
    COMMENT_STARTING: S++,
    // <!-
    COMMENT: S++,
    // <!--
    COMMENT_ENDING: S++,
    // <!-- blah -
    COMMENT_ENDED: S++,
    // <!-- blah --
    CDATA: S++,
    // <![CDATA[ something
    CDATA_ENDING: S++,
    // ]
    CDATA_ENDING_2: S++,
    // ]]
    PROC_INST: S++,
    // <?hi
    PROC_INST_BODY: S++,
    // <?hi there
    PROC_INST_ENDING: S++,
    // <?hi "there" ?
    OPEN_TAG: S++,
    // <strong
    OPEN_TAG_SLASH: S++,
    // <strong /
    ATTRIB: S++,
    // <a
    ATTRIB_NAME: S++,
    // <a foo
    ATTRIB_NAME_SAW_WHITE: S++,
    // <a foo _
    ATTRIB_VALUE: S++,
    // <a foo=
    ATTRIB_VALUE_QUOTED: S++,
    // <a foo="bar
    ATTRIB_VALUE_CLOSED: S++,
    // <a foo="bar"
    ATTRIB_VALUE_UNQUOTED: S++,
    // <a foo=bar
    ATTRIB_VALUE_ENTITY_Q: S++,
    // <foo bar="&quot;"
    ATTRIB_VALUE_ENTITY_U: S++,
    // <foo bar=&quot
    CLOSE_TAG: S++,
    // </a
    CLOSE_TAG_SAW_WHITE: S++,
    // </a   >
    SCRIPT: S++,
    // <script> ...
    SCRIPT_ENDING: S++ // <script> ... <
  };

  sax.XML_ENTITIES = {
    'amp': '&',
    'gt': '>',
    'lt': '<',
    'quot': '"',
    'apos': "'"
  };
  sax.ENTITIES = {
    'amp': '&',
    'gt': '>',
    'lt': '<',
    'quot': '"',
    'apos': "'",
    'AElig': 198,
    'Aacute': 193,
    'Acirc': 194,
    'Agrave': 192,
    'Aring': 197,
    'Atilde': 195,
    'Auml': 196,
    'Ccedil': 199,
    'ETH': 208,
    'Eacute': 201,
    'Ecirc': 202,
    'Egrave': 200,
    'Euml': 203,
    'Iacute': 205,
    'Icirc': 206,
    'Igrave': 204,
    'Iuml': 207,
    'Ntilde': 209,
    'Oacute': 211,
    'Ocirc': 212,
    'Ograve': 210,
    'Oslash': 216,
    'Otilde': 213,
    'Ouml': 214,
    'THORN': 222,
    'Uacute': 218,
    'Ucirc': 219,
    'Ugrave': 217,
    'Uuml': 220,
    'Yacute': 221,
    'aacute': 225,
    'acirc': 226,
    'aelig': 230,
    'agrave': 224,
    'aring': 229,
    'atilde': 227,
    'auml': 228,
    'ccedil': 231,
    'eacute': 233,
    'ecirc': 234,
    'egrave': 232,
    'eth': 240,
    'euml': 235,
    'iacute': 237,
    'icirc': 238,
    'igrave': 236,
    'iuml': 239,
    'ntilde': 241,
    'oacute': 243,
    'ocirc': 244,
    'ograve': 242,
    'oslash': 248,
    'otilde': 245,
    'ouml': 246,
    'szlig': 223,
    'thorn': 254,
    'uacute': 250,
    'ucirc': 251,
    'ugrave': 249,
    'uuml': 252,
    'yacute': 253,
    'yuml': 255,
    'copy': 169,
    'reg': 174,
    'nbsp': 160,
    'iexcl': 161,
    'cent': 162,
    'pound': 163,
    'curren': 164,
    'yen': 165,
    'brvbar': 166,
    'sect': 167,
    'uml': 168,
    'ordf': 170,
    'laquo': 171,
    'not': 172,
    'shy': 173,
    'macr': 175,
    'deg': 176,
    'plusmn': 177,
    'sup1': 185,
    'sup2': 178,
    'sup3': 179,
    'acute': 180,
    'micro': 181,
    'para': 182,
    'middot': 183,
    'cedil': 184,
    'ordm': 186,
    'raquo': 187,
    'frac14': 188,
    'frac12': 189,
    'frac34': 190,
    'iquest': 191,
    'times': 215,
    'divide': 247,
    'OElig': 338,
    'oelig': 339,
    'Scaron': 352,
    'scaron': 353,
    'Yuml': 376,
    'fnof': 402,
    'circ': 710,
    'tilde': 732,
    'Alpha': 913,
    'Beta': 914,
    'Gamma': 915,
    'Delta': 916,
    'Epsilon': 917,
    'Zeta': 918,
    'Eta': 919,
    'Theta': 920,
    'Iota': 921,
    'Kappa': 922,
    'Lambda': 923,
    'Mu': 924,
    'Nu': 925,
    'Xi': 926,
    'Omicron': 927,
    'Pi': 928,
    'Rho': 929,
    'Sigma': 931,
    'Tau': 932,
    'Upsilon': 933,
    'Phi': 934,
    'Chi': 935,
    'Psi': 936,
    'Omega': 937,
    'alpha': 945,
    'beta': 946,
    'gamma': 947,
    'delta': 948,
    'epsilon': 949,
    'zeta': 950,
    'eta': 951,
    'theta': 952,
    'iota': 953,
    'kappa': 954,
    'lambda': 955,
    'mu': 956,
    'nu': 957,
    'xi': 958,
    'omicron': 959,
    'pi': 960,
    'rho': 961,
    'sigmaf': 962,
    'sigma': 963,
    'tau': 964,
    'upsilon': 965,
    'phi': 966,
    'chi': 967,
    'psi': 968,
    'omega': 969,
    'thetasym': 977,
    'upsih': 978,
    'piv': 982,
    'ensp': 8194,
    'emsp': 8195,
    'thinsp': 8201,
    'zwnj': 8204,
    'zwj': 8205,
    'lrm': 8206,
    'rlm': 8207,
    'ndash': 8211,
    'mdash': 8212,
    'lsquo': 8216,
    'rsquo': 8217,
    'sbquo': 8218,
    'ldquo': 8220,
    'rdquo': 8221,
    'bdquo': 8222,
    'dagger': 8224,
    'Dagger': 8225,
    'bull': 8226,
    'hellip': 8230,
    'permil': 8240,
    'prime': 8242,
    'Prime': 8243,
    'lsaquo': 8249,
    'rsaquo': 8250,
    'oline': 8254,
    'frasl': 8260,
    'euro': 8364,
    'image': 8465,
    'weierp': 8472,
    'real': 8476,
    'trade': 8482,
    'alefsym': 8501,
    'larr': 8592,
    'uarr': 8593,
    'rarr': 8594,
    'darr': 8595,
    'harr': 8596,
    'crarr': 8629,
    'lArr': 8656,
    'uArr': 8657,
    'rArr': 8658,
    'dArr': 8659,
    'hArr': 8660,
    'forall': 8704,
    'part': 8706,
    'exist': 8707,
    'empty': 8709,
    'nabla': 8711,
    'isin': 8712,
    'notin': 8713,
    'ni': 8715,
    'prod': 8719,
    'sum': 8721,
    'minus': 8722,
    'lowast': 8727,
    'radic': 8730,
    'prop': 8733,
    'infin': 8734,
    'ang': 8736,
    'and': 8743,
    'or': 8744,
    'cap': 8745,
    'cup': 8746,
    'int': 8747,
    'there4': 8756,
    'sim': 8764,
    'cong': 8773,
    'asymp': 8776,
    'ne': 8800,
    'equiv': 8801,
    'le': 8804,
    'ge': 8805,
    'sub': 8834,
    'sup': 8835,
    'nsub': 8836,
    'sube': 8838,
    'supe': 8839,
    'oplus': 8853,
    'otimes': 8855,
    'perp': 8869,
    'sdot': 8901,
    'lceil': 8968,
    'rceil': 8969,
    'lfloor': 8970,
    'rfloor': 8971,
    'lang': 9001,
    'rang': 9002,
    'loz': 9674,
    'spades': 9824,
    'clubs': 9827,
    'hearts': 9829,
    'diams': 9830
  };
  Object.keys(sax.ENTITIES).forEach(function (key) {
    var e = sax.ENTITIES[key];
    var s = typeof e === 'number' ? String.fromCharCode(e) : e;
    sax.ENTITIES[key] = s;
  });
  for (var s in sax.STATE) {
    sax.STATE[sax.STATE[s]] = s;
  }

  // shorthand
  S = sax.STATE;
  function emit(parser, event, data) {
    parser[event] && parser[event](data);
  }
  function emitNode(parser, nodeType, data) {
    if (parser.textNode) closeText(parser);
    emit(parser, nodeType, data);
  }
  function closeText(parser) {
    parser.textNode = textopts(parser.opt, parser.textNode);
    if (parser.textNode) emit(parser, 'ontext', parser.textNode);
    parser.textNode = '';
  }
  function textopts(opt, text) {
    if (opt.trim) text = text.trim();
    if (opt.normalize) text = text.replace(/\s+/g, ' ');
    return text;
  }
  function error(parser, er) {
    closeText(parser);
    if (parser.trackPosition) {
      er += '\nLine: ' + parser.line + '\nColumn: ' + parser.column + '\nChar: ' + parser.c;
    }
    er = new Error(er);
    parser.error = er;
    emit(parser, 'onerror', er);
    return parser;
  }
  function _end(parser) {
    if (parser.sawRoot && !parser.closedRoot) strictFail(parser, 'Unclosed root tag');
    if (parser.state !== S.BEGIN && parser.state !== S.BEGIN_WHITESPACE && parser.state !== S.TEXT) {
      error(parser, 'Unexpected end');
    }
    closeText(parser);
    parser.c = '';
    parser.closed = true;
    emit(parser, 'onend');
    SAXParser.call(parser, parser.strict, parser.opt);
    return parser;
  }
  function strictFail(parser, message) {
    if (_typeof(parser) !== 'object' || !(parser instanceof SAXParser)) {
      throw new Error('bad call to strictFail');
    }
    if (parser.strict) {
      error(parser, message);
    }
  }
  function newTag(parser) {
    if (!parser.strict) parser.tagName = parser.tagName[parser.looseCase]();
    var parent = parser.tags[parser.tags.length - 1] || parser;
    var tag = parser.tag = {
      name: parser.tagName,
      attributes: {}
    };

    // will be overridden if tag contails an xmlns="foo" or xmlns:foo="bar"
    if (parser.opt.xmlns) {
      tag.ns = parent.ns;
    }
    parser.attribList.length = 0;
    emitNode(parser, 'onopentagstart', tag);
  }
  function qname(name, attribute) {
    var i = name.indexOf(':');
    var qualName = i < 0 ? ['', name] : name.split(':');
    var prefix = qualName[0];
    var local = qualName[1];

    // <x "xmlns"="http://foo">
    if (attribute && name === 'xmlns') {
      prefix = 'xmlns';
      local = '';
    }
    return {
      prefix: prefix,
      local: local
    };
  }
  function attrib(parser) {
    if (!parser.strict) {
      parser.attribName = parser.attribName[parser.looseCase]();
    }
    if (parser.attribList.indexOf(parser.attribName) !== -1 || parser.tag.attributes.hasOwnProperty(parser.attribName)) {
      parser.attribName = parser.attribValue = '';
      return;
    }
    if (parser.opt.xmlns) {
      var qn = qname(parser.attribName, true);
      var prefix = qn.prefix;
      var local = qn.local;
      if (prefix === 'xmlns') {
        // namespace binding attribute. push the binding into scope
        if (local === 'xml' && parser.attribValue !== XML_NAMESPACE) {
          strictFail(parser, 'xml: prefix must be bound to ' + XML_NAMESPACE + '\n' + 'Actual: ' + parser.attribValue);
        } else if (local === 'xmlns' && parser.attribValue !== XMLNS_NAMESPACE) {
          strictFail(parser, 'xmlns: prefix must be bound to ' + XMLNS_NAMESPACE + '\n' + 'Actual: ' + parser.attribValue);
        } else {
          var tag = parser.tag;
          var parent = parser.tags[parser.tags.length - 1] || parser;
          if (tag.ns === parent.ns) {
            tag.ns = Object.create(parent.ns);
          }
          tag.ns[local] = parser.attribValue;
        }
      }

      // defer onattribute events until all attributes have been seen
      // so any new bindings can take effect. preserve attribute order
      // so deferred events can be emitted in document order
      parser.attribList.push([parser.attribName, parser.attribValue]);
    } else {
      // in non-xmlns mode, we can emit the event right away
      parser.tag.attributes[parser.attribName] = parser.attribValue;
      emitNode(parser, 'onattribute', {
        name: parser.attribName,
        value: parser.attribValue
      });
    }
    parser.attribName = parser.attribValue = '';
  }
  function openTag(parser, selfClosing) {
    if (parser.opt.xmlns) {
      // emit namespace binding events
      var tag = parser.tag;

      // add namespace info to tag
      var qn = qname(parser.tagName);
      tag.prefix = qn.prefix;
      tag.local = qn.local;
      tag.uri = tag.ns[qn.prefix] || '';
      if (tag.prefix && !tag.uri) {
        strictFail(parser, 'Unbound namespace prefix: ' + JSON.stringify(parser.tagName));
        tag.uri = qn.prefix;
      }
      var parent = parser.tags[parser.tags.length - 1] || parser;
      if (tag.ns && parent.ns !== tag.ns) {
        Object.keys(tag.ns).forEach(function (p) {
          emitNode(parser, 'onopennamespace', {
            prefix: p,
            uri: tag.ns[p]
          });
        });
      }

      // handle deferred onattribute events
      // Note: do not apply default ns to attributes:
      //   http://www.w3.org/TR/REC-xml-names/#defaulting
      for (var i = 0, l = parser.attribList.length; i < l; i++) {
        var nv = parser.attribList[i];
        var name = nv[0];
        var value = nv[1];
        var qualName = qname(name, true);
        var prefix = qualName.prefix;
        var local = qualName.local;
        var uri = prefix === '' ? '' : tag.ns[prefix] || '';
        var a = {
          name: name,
          value: value,
          prefix: prefix,
          local: local,
          uri: uri
        };

        // if there's any attributes with an undefined namespace,
        // then fail on them now.
        if (prefix && prefix !== 'xmlns' && !uri) {
          strictFail(parser, 'Unbound namespace prefix: ' + JSON.stringify(prefix));
          a.uri = prefix;
        }
        parser.tag.attributes[name] = a;
        emitNode(parser, 'onattribute', a);
      }
      parser.attribList.length = 0;
    }
    parser.tag.isSelfClosing = !!selfClosing;

    // process the tag
    parser.sawRoot = true;
    parser.tags.push(parser.tag);
    emitNode(parser, 'onopentag', parser.tag);
    if (!selfClosing) {
      // special case for <script> in non-strict mode.
      if (!parser.noscript && parser.tagName.toLowerCase() === 'script') {
        parser.state = S.SCRIPT;
      } else {
        parser.state = S.TEXT;
      }
      parser.tag = null;
      parser.tagName = '';
    }
    parser.attribName = parser.attribValue = '';
    parser.attribList.length = 0;
  }
  function closeTag(parser) {
    if (!parser.tagName) {
      strictFail(parser, 'Weird empty close tag.');
      parser.textNode += '</>';
      parser.state = S.TEXT;
      return;
    }
    if (parser.script) {
      if (parser.tagName !== 'script') {
        parser.script += '</' + parser.tagName + '>';
        parser.tagName = '';
        parser.state = S.SCRIPT;
        return;
      }
      emitNode(parser, 'onscript', parser.script);
      parser.script = '';
    }

    // first make sure that the closing tag actually exists.
    // <a><b></c></b></a> will close everything, otherwise.
    var t = parser.tags.length;
    var tagName = parser.tagName;
    if (!parser.strict) {
      tagName = tagName[parser.looseCase]();
    }
    var closeTo = tagName;
    while (t--) {
      var close = parser.tags[t];
      if (close.name !== closeTo) {
        // fail the first time in strict mode
        strictFail(parser, 'Unexpected close tag');
      } else {
        break;
      }
    }

    // didn't find it.  we already failed for strict, so just abort.
    if (t < 0) {
      strictFail(parser, 'Unmatched closing tag: ' + parser.tagName);
      parser.textNode += '</' + parser.tagName + '>';
      parser.state = S.TEXT;
      return;
    }
    parser.tagName = tagName;
    var s = parser.tags.length;
    while (s-- > t) {
      var tag = parser.tag = parser.tags.pop();
      parser.tagName = parser.tag.name;
      emitNode(parser, 'onclosetag', parser.tagName);
      var x = {};
      for (var i in tag.ns) {
        x[i] = tag.ns[i];
      }
      var parent = parser.tags[parser.tags.length - 1] || parser;
      if (parser.opt.xmlns && tag.ns !== parent.ns) {
        // remove namespace bindings introduced by tag
        Object.keys(tag.ns).forEach(function (p) {
          var n = tag.ns[p];
          emitNode(parser, 'onclosenamespace', {
            prefix: p,
            uri: n
          });
        });
      }
    }
    if (t === 0) parser.closedRoot = true;
    parser.tagName = parser.attribValue = parser.attribName = '';
    parser.attribList.length = 0;
    parser.state = S.TEXT;
  }
  function parseEntity(parser) {
    var entity = parser.entity;
    var entityLC = entity.toLowerCase();
    var num;
    var numStr = '';
    if (parser.ENTITIES[entity]) {
      return parser.ENTITIES[entity];
    }
    if (parser.ENTITIES[entityLC]) {
      return parser.ENTITIES[entityLC];
    }
    entity = entityLC;
    if (entity.charAt(0) === '#') {
      if (entity.charAt(1) === 'x') {
        entity = entity.slice(2);
        num = parseInt(entity, 16);
        numStr = num.toString(16);
      } else {
        entity = entity.slice(1);
        num = parseInt(entity, 10);
        numStr = num.toString(10);
      }
    }
    entity = entity.replace(/^0+/, '');
    if (isNaN(num) || numStr.toLowerCase() !== entity) {
      strictFail(parser, 'Invalid character entity');
      return '&' + parser.entity + ';';
    }
    return String.fromCodePoint(num);
  }
  function beginWhiteSpace(parser, c) {
    if (c === '<') {
      parser.state = S.OPEN_WAKA;
      parser.startTagPosition = parser.position;
    } else if (!isWhitespace(c)) {
      // have to process this as a text node.
      // weird, but happens.
      strictFail(parser, 'Non-whitespace before first tag.');
      parser.textNode = c;
      parser.state = S.TEXT;
    }
  }
  function charAt(chunk, i) {
    var result = '';
    if (i < chunk.length) {
      result = chunk.charAt(i);
    }
    return result;
  }
  function write(chunk) {
    var parser = this;
    if (this.error) {
      throw this.error;
    }
    if (parser.closed) {
      return error(parser, 'Cannot write after close. Assign an onready handler.');
    }
    if (chunk === null) {
      return _end(parser);
    }
    if (_typeof(chunk) === 'object') {
      chunk = chunk.toString();
    }
    var i = 0;
    var c = '';
    while (true) {
      c = charAt(chunk, i++);
      parser.c = c;
      if (!c) {
        break;
      }
      if (parser.trackPosition) {
        parser.position++;
        if (c === '\n') {
          parser.line++;
          parser.column = 0;
        } else {
          parser.column++;
        }
      }
      switch (parser.state) {
        case S.BEGIN:
          parser.state = S.BEGIN_WHITESPACE;
          if (c === "\uFEFF") {
            continue;
          }
          beginWhiteSpace(parser, c);
          continue;
        case S.BEGIN_WHITESPACE:
          beginWhiteSpace(parser, c);
          continue;
        case S.TEXT:
          if (parser.sawRoot && !parser.closedRoot) {
            var starti = i - 1;
            while (c && c !== '<' && c !== '&') {
              c = charAt(chunk, i++);
              if (c && parser.trackPosition) {
                parser.position++;
                if (c === '\n') {
                  parser.line++;
                  parser.column = 0;
                } else {
                  parser.column++;
                }
              }
            }
            parser.textNode += chunk.substring(starti, i - 1);
          }
          if (c === '<' && !(parser.sawRoot && parser.closedRoot && !parser.strict)) {
            parser.state = S.OPEN_WAKA;
            parser.startTagPosition = parser.position;
          } else {
            if (!isWhitespace(c) && (!parser.sawRoot || parser.closedRoot)) {
              strictFail(parser, 'Text data outside of root node.');
            }
            if (c === '&') {
              parser.state = S.TEXT_ENTITY;
            } else {
              parser.textNode += c;
            }
          }
          continue;
        case S.SCRIPT:
          // only non-strict
          if (c === '<') {
            parser.state = S.SCRIPT_ENDING;
          } else {
            parser.script += c;
          }
          continue;
        case S.SCRIPT_ENDING:
          if (c === '/') {
            parser.state = S.CLOSE_TAG;
          } else {
            parser.script += '<' + c;
            parser.state = S.SCRIPT;
          }
          continue;
        case S.OPEN_WAKA:
          // either a /, ?, !, or text is coming next.
          if (c === '!') {
            parser.state = S.SGML_DECL;
            parser.sgmlDecl = '';
          } else if (isWhitespace(c)) {
            // wait for it...
          } else if (isMatch(nameStart, c)) {
            parser.state = S.OPEN_TAG;
            parser.tagName = c;
          } else if (c === '/') {
            parser.state = S.CLOSE_TAG;
            parser.tagName = '';
          } else if (c === '?') {
            parser.state = S.PROC_INST;
            parser.procInstName = parser.procInstBody = '';
          } else {
            strictFail(parser, 'Unencoded <');
            // if there was some whitespace, then add that in.
            if (parser.startTagPosition + 1 < parser.position) {
              var pad = parser.position - parser.startTagPosition;
              c = new Array(pad).join(' ') + c;
            }
            parser.textNode += '<' + c;
            parser.state = S.TEXT;
          }
          continue;
        case S.SGML_DECL:
          if ((parser.sgmlDecl + c).toUpperCase() === CDATA) {
            emitNode(parser, 'onopencdata');
            parser.state = S.CDATA;
            parser.sgmlDecl = '';
            parser.cdata = '';
          } else if (parser.sgmlDecl + c === '--') {
            parser.state = S.COMMENT;
            parser.comment = '';
            parser.sgmlDecl = '';
          } else if ((parser.sgmlDecl + c).toUpperCase() === DOCTYPE) {
            parser.state = S.DOCTYPE;
            if (parser.doctype || parser.sawRoot) {
              strictFail(parser, 'Inappropriately located doctype declaration');
            }
            parser.doctype = '';
            parser.sgmlDecl = '';
          } else if (c === '>') {
            emitNode(parser, 'onsgmldeclaration', parser.sgmlDecl);
            parser.sgmlDecl = '';
            parser.state = S.TEXT;
          } else if (isQuote(c)) {
            parser.state = S.SGML_DECL_QUOTED;
            parser.sgmlDecl += c;
          } else {
            parser.sgmlDecl += c;
          }
          continue;
        case S.SGML_DECL_QUOTED:
          if (c === parser.q) {
            parser.state = S.SGML_DECL;
            parser.q = '';
          }
          parser.sgmlDecl += c;
          continue;
        case S.DOCTYPE:
          if (c === '>') {
            parser.state = S.TEXT;
            emitNode(parser, 'ondoctype', parser.doctype);
            parser.doctype = true; // just remember that we saw it.
          } else {
            parser.doctype += c;
            if (c === '[') {
              parser.state = S.DOCTYPE_DTD;
            } else if (isQuote(c)) {
              parser.state = S.DOCTYPE_QUOTED;
              parser.q = c;
            }
          }
          continue;
        case S.DOCTYPE_QUOTED:
          parser.doctype += c;
          if (c === parser.q) {
            parser.q = '';
            parser.state = S.DOCTYPE;
          }
          continue;
        case S.DOCTYPE_DTD:
          parser.doctype += c;
          if (c === ']') {
            parser.state = S.DOCTYPE;
          } else if (isQuote(c)) {
            parser.state = S.DOCTYPE_DTD_QUOTED;
            parser.q = c;
          }
          continue;
        case S.DOCTYPE_DTD_QUOTED:
          parser.doctype += c;
          if (c === parser.q) {
            parser.state = S.DOCTYPE_DTD;
            parser.q = '';
          }
          continue;
        case S.COMMENT:
          if (c === '-') {
            parser.state = S.COMMENT_ENDING;
          } else {
            parser.comment += c;
          }
          continue;
        case S.COMMENT_ENDING:
          if (c === '-') {
            parser.state = S.COMMENT_ENDED;
            parser.comment = textopts(parser.opt, parser.comment);
            if (parser.comment) {
              emitNode(parser, 'oncomment', parser.comment);
            }
            parser.comment = '';
          } else {
            parser.comment += '-' + c;
            parser.state = S.COMMENT;
          }
          continue;
        case S.COMMENT_ENDED:
          if (c !== '>') {
            strictFail(parser, 'Malformed comment');
            // allow <!-- blah -- bloo --> in non-strict mode,
            // which is a comment of " blah -- bloo "
            parser.comment += '--' + c;
            parser.state = S.COMMENT;
          } else {
            parser.state = S.TEXT;
          }
          continue;
        case S.CDATA:
          if (c === ']') {
            parser.state = S.CDATA_ENDING;
          } else {
            parser.cdata += c;
          }
          continue;
        case S.CDATA_ENDING:
          if (c === ']') {
            parser.state = S.CDATA_ENDING_2;
          } else {
            parser.cdata += ']' + c;
            parser.state = S.CDATA;
          }
          continue;
        case S.CDATA_ENDING_2:
          if (c === '>') {
            if (parser.cdata) {
              emitNode(parser, 'oncdata', parser.cdata);
            }
            emitNode(parser, 'onclosecdata');
            parser.cdata = '';
            parser.state = S.TEXT;
          } else if (c === ']') {
            parser.cdata += ']';
          } else {
            parser.cdata += ']]' + c;
            parser.state = S.CDATA;
          }
          continue;
        case S.PROC_INST:
          if (c === '?') {
            parser.state = S.PROC_INST_ENDING;
          } else if (isWhitespace(c)) {
            parser.state = S.PROC_INST_BODY;
          } else {
            parser.procInstName += c;
          }
          continue;
        case S.PROC_INST_BODY:
          if (!parser.procInstBody && isWhitespace(c)) {
            continue;
          } else if (c === '?') {
            parser.state = S.PROC_INST_ENDING;
          } else {
            parser.procInstBody += c;
          }
          continue;
        case S.PROC_INST_ENDING:
          if (c === '>') {
            emitNode(parser, 'onprocessinginstruction', {
              name: parser.procInstName,
              body: parser.procInstBody
            });
            parser.procInstName = parser.procInstBody = '';
            parser.state = S.TEXT;
          } else {
            parser.procInstBody += '?' + c;
            parser.state = S.PROC_INST_BODY;
          }
          continue;
        case S.OPEN_TAG:
          if (isMatch(nameBody, c)) {
            parser.tagName += c;
          } else {
            newTag(parser);
            if (c === '>') {
              openTag(parser);
            } else if (c === '/') {
              parser.state = S.OPEN_TAG_SLASH;
            } else {
              if (!isWhitespace(c)) {
                strictFail(parser, 'Invalid character in tag name');
              }
              parser.state = S.ATTRIB;
            }
          }
          continue;
        case S.OPEN_TAG_SLASH:
          if (c === '>') {
            openTag(parser, true);
            closeTag(parser);
          } else {
            strictFail(parser, 'Forward-slash in opening tag not followed by >');
            parser.state = S.ATTRIB;
          }
          continue;
        case S.ATTRIB:
          // haven't read the attribute name yet.
          if (isWhitespace(c)) {
            continue;
          } else if (c === '>') {
            openTag(parser);
          } else if (c === '/') {
            parser.state = S.OPEN_TAG_SLASH;
          } else if (isMatch(nameStart, c)) {
            parser.attribName = c;
            parser.attribValue = '';
            parser.state = S.ATTRIB_NAME;
          } else {
            strictFail(parser, 'Invalid attribute name');
          }
          continue;
        case S.ATTRIB_NAME:
          if (c === '=') {
            parser.state = S.ATTRIB_VALUE;
          } else if (c === '>') {
            strictFail(parser, 'Attribute without value');
            parser.attribValue = parser.attribName;
            attrib(parser);
            openTag(parser);
          } else if (isWhitespace(c)) {
            parser.state = S.ATTRIB_NAME_SAW_WHITE;
          } else if (isMatch(nameBody, c)) {
            parser.attribName += c;
          } else {
            strictFail(parser, 'Invalid attribute name');
          }
          continue;
        case S.ATTRIB_NAME_SAW_WHITE:
          if (c === '=') {
            parser.state = S.ATTRIB_VALUE;
          } else if (isWhitespace(c)) {
            continue;
          } else {
            strictFail(parser, 'Attribute without value');
            parser.tag.attributes[parser.attribName] = '';
            parser.attribValue = '';
            emitNode(parser, 'onattribute', {
              name: parser.attribName,
              value: ''
            });
            parser.attribName = '';
            if (c === '>') {
              openTag(parser);
            } else if (isMatch(nameStart, c)) {
              parser.attribName = c;
              parser.state = S.ATTRIB_NAME;
            } else {
              strictFail(parser, 'Invalid attribute name');
              parser.state = S.ATTRIB;
            }
          }
          continue;
        case S.ATTRIB_VALUE:
          if (isWhitespace(c)) {
            continue;
          } else if (isQuote(c)) {
            parser.q = c;
            parser.state = S.ATTRIB_VALUE_QUOTED;
          } else {
            strictFail(parser, 'Unquoted attribute value');
            parser.state = S.ATTRIB_VALUE_UNQUOTED;
            parser.attribValue = c;
          }
          continue;
        case S.ATTRIB_VALUE_QUOTED:
          if (c !== parser.q) {
            if (c === '&') {
              parser.state = S.ATTRIB_VALUE_ENTITY_Q;
            } else {
              parser.attribValue += c;
            }
            continue;
          }
          attrib(parser);
          parser.q = '';
          parser.state = S.ATTRIB_VALUE_CLOSED;
          continue;
        case S.ATTRIB_VALUE_CLOSED:
          if (isWhitespace(c)) {
            parser.state = S.ATTRIB;
          } else if (c === '>') {
            openTag(parser);
          } else if (c === '/') {
            parser.state = S.OPEN_TAG_SLASH;
          } else if (isMatch(nameStart, c)) {
            strictFail(parser, 'No whitespace between attributes');
            parser.attribName = c;
            parser.attribValue = '';
            parser.state = S.ATTRIB_NAME;
          } else {
            strictFail(parser, 'Invalid attribute name');
          }
          continue;
        case S.ATTRIB_VALUE_UNQUOTED:
          if (!isAttribEnd(c)) {
            if (c === '&') {
              parser.state = S.ATTRIB_VALUE_ENTITY_U;
            } else {
              parser.attribValue += c;
            }
            continue;
          }
          attrib(parser);
          if (c === '>') {
            openTag(parser);
          } else {
            parser.state = S.ATTRIB;
          }
          continue;
        case S.CLOSE_TAG:
          if (!parser.tagName) {
            if (isWhitespace(c)) {
              continue;
            } else if (notMatch(nameStart, c)) {
              if (parser.script) {
                parser.script += '</' + c;
                parser.state = S.SCRIPT;
              } else {
                strictFail(parser, 'Invalid tagname in closing tag.');
              }
            } else {
              parser.tagName = c;
            }
          } else if (c === '>') {
            closeTag(parser);
          } else if (isMatch(nameBody, c)) {
            parser.tagName += c;
          } else if (parser.script) {
            parser.script += '</' + parser.tagName;
            parser.tagName = '';
            parser.state = S.SCRIPT;
          } else {
            if (!isWhitespace(c)) {
              strictFail(parser, 'Invalid tagname in closing tag');
            }
            parser.state = S.CLOSE_TAG_SAW_WHITE;
          }
          continue;
        case S.CLOSE_TAG_SAW_WHITE:
          if (isWhitespace(c)) {
            continue;
          }
          if (c === '>') {
            closeTag(parser);
          } else {
            strictFail(parser, 'Invalid characters in closing tag');
          }
          continue;
        case S.TEXT_ENTITY:
        case S.ATTRIB_VALUE_ENTITY_Q:
        case S.ATTRIB_VALUE_ENTITY_U:
          var returnState;
          var buffer;
          switch (parser.state) {
            case S.TEXT_ENTITY:
              returnState = S.TEXT;
              buffer = 'textNode';
              break;
            case S.ATTRIB_VALUE_ENTITY_Q:
              returnState = S.ATTRIB_VALUE_QUOTED;
              buffer = 'attribValue';
              break;
            case S.ATTRIB_VALUE_ENTITY_U:
              returnState = S.ATTRIB_VALUE_UNQUOTED;
              buffer = 'attribValue';
              break;
          }
          if (c === ';') {
            if (parser.opt.unparsedEntities) {
              var parsedEntity = parseEntity(parser);
              parser.entity = '';
              parser.state = returnState;
              parser.write(parsedEntity);
            } else {
              parser[buffer] += parseEntity(parser);
              parser.entity = '';
              parser.state = returnState;
            }
          } else if (isMatch(parser.entity.length ? entityBody : entityStart, c)) {
            parser.entity += c;
          } else {
            strictFail(parser, 'Invalid character in entity name');
            parser[buffer] += '&' + parser.entity + c;
            parser.entity = '';
            parser.state = returnState;
          }
          continue;
        default:
          /* istanbul ignore next */{
            throw new Error(parser, 'Unknown state: ' + parser.state);
          }
      }
    } // while

    if (parser.position >= parser.bufferCheckPosition) {
      checkBufferLength(parser);
    }
    return parser;
  }

  /*! http://mths.be/fromcodepoint v0.1.0 by @mathias */
  /* istanbul ignore next */
  if (!String.fromCodePoint) {
    (function () {
      var stringFromCharCode = String.fromCharCode;
      var floor = Math.floor;
      var fromCodePoint = function fromCodePoint() {
        var MAX_SIZE = 0x4000;
        var codeUnits = [];
        var highSurrogate;
        var lowSurrogate;
        var index = -1;
        var length = arguments.length;
        if (!length) {
          return '';
        }
        var result = '';
        while (++index < length) {
          var codePoint = Number(arguments[index]);
          if (!isFinite(codePoint) ||
          // `NaN`, `+Infinity`, or `-Infinity`
          codePoint < 0 ||
          // not a valid Unicode code point
          codePoint > 0x10FFFF ||
          // not a valid Unicode code point
          floor(codePoint) !== codePoint // not an integer
          ) {
            throw RangeError('Invalid code point: ' + codePoint);
          }
          if (codePoint <= 0xFFFF) {
            // BMP code point
            codeUnits.push(codePoint);
          } else {
            // Astral code point; split in surrogate halves
            // http://mathiasbynens.be/notes/javascript-encoding#surrogate-formulae
            codePoint -= 0x10000;
            highSurrogate = (codePoint >> 10) + 0xD800;
            lowSurrogate = codePoint % 0x400 + 0xDC00;
            codeUnits.push(highSurrogate, lowSurrogate);
          }
          if (index + 1 === length || codeUnits.length > MAX_SIZE) {
            result += stringFromCharCode.apply(null, codeUnits);
            codeUnits.length = 0;
          }
        }
        return result;
      };
      /* istanbul ignore next */
      if (Object.defineProperty) {
        Object.defineProperty(String, 'fromCodePoint', {
          value: fromCodePoint,
          configurable: true,
          writable: true
        });
      } else {
        String.fromCodePoint = fromCodePoint;
      }
    })();
  }
})( false ? 0 : exports);

/***/ }),

/***/ 7012:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var GetIntrinsic = __webpack_require__(3584);
var define = __webpack_require__(1314);
var hasDescriptors = __webpack_require__(4607)();
var gOPD = __webpack_require__(1700);
var $TypeError = GetIntrinsic('%TypeError%');
var $floor = GetIntrinsic('%Math.floor%');
module.exports = function setFunctionLength(fn, length) {
  if (typeof fn !== 'function') {
    throw new $TypeError('`fn` is not a function');
  }
  if (typeof length !== 'number' || length < 0 || length > 0xFFFFFFFF || $floor(length) !== length) {
    throw new $TypeError('`length` must be a positive 32-bit integer');
  }
  var loose = arguments.length > 2 && !!arguments[2];
  var functionLengthIsConfigurable = true;
  var functionLengthIsWritable = true;
  if ('length' in fn && gOPD) {
    var desc = gOPD(fn, 'length');
    if (desc && !desc.configurable) {
      functionLengthIsConfigurable = false;
    }
    if (desc && !desc.writable) {
      functionLengthIsWritable = false;
    }
  }
  if (functionLengthIsConfigurable || functionLengthIsWritable || !loose) {
    if (hasDescriptors) {
      define(fn, 'length', length, true, true);
    } else {
      define(fn, 'length', length);
    }
  }
  return fn;
};

/***/ }),

/***/ 7648:
/***/ (function(__unused_webpack_module, __unused_webpack_exports, __webpack_require__) {

/* provided dependency */ var process = __webpack_require__(2790);
(function (global, undefined) {
  "use strict";

  if (global.setImmediate) {
    return;
  }
  var nextHandle = 1; // Spec says greater than zero
  var tasksByHandle = {};
  var currentlyRunningATask = false;
  var doc = global.document;
  var registerImmediate;
  function setImmediate(callback) {
    // Callback can either be a function or a string
    if (typeof callback !== "function") {
      callback = new Function("" + callback);
    }
    // Copy function arguments
    var args = new Array(arguments.length - 1);
    for (var i = 0; i < args.length; i++) {
      args[i] = arguments[i + 1];
    }
    // Store and register the task
    var task = {
      callback: callback,
      args: args
    };
    tasksByHandle[nextHandle] = task;
    registerImmediate(nextHandle);
    return nextHandle++;
  }
  function clearImmediate(handle) {
    delete tasksByHandle[handle];
  }
  function run(task) {
    var callback = task.callback;
    var args = task.args;
    switch (args.length) {
      case 0:
        callback();
        break;
      case 1:
        callback(args[0]);
        break;
      case 2:
        callback(args[0], args[1]);
        break;
      case 3:
        callback(args[0], args[1], args[2]);
        break;
      default:
        callback.apply(undefined, args);
        break;
    }
  }
  function runIfPresent(handle) {
    // From the spec: "Wait until any invocations of this algorithm started before this one have completed."
    // So if we're currently running a task, we'll need to delay this invocation.
    if (currentlyRunningATask) {
      // Delay by doing a setTimeout. setImmediate was tried instead, but in Firefox 7 it generated a
      // "too much recursion" error.
      setTimeout(runIfPresent, 0, handle);
    } else {
      var task = tasksByHandle[handle];
      if (task) {
        currentlyRunningATask = true;
        try {
          run(task);
        } finally {
          clearImmediate(handle);
          currentlyRunningATask = false;
        }
      }
    }
  }
  function installNextTickImplementation() {
    registerImmediate = function registerImmediate(handle) {
      process.nextTick(function () {
        runIfPresent(handle);
      });
    };
  }
  function canUsePostMessage() {
    // The test against `importScripts` prevents this implementation from being installed inside a web worker,
    // where `global.postMessage` means something completely different and can't be used for this purpose.
    if (global.postMessage && !global.importScripts) {
      var postMessageIsAsynchronous = true;
      var oldOnMessage = global.onmessage;
      global.onmessage = function () {
        postMessageIsAsynchronous = false;
      };
      global.postMessage("", "*");
      global.onmessage = oldOnMessage;
      return postMessageIsAsynchronous;
    }
  }
  function installPostMessageImplementation() {
    // Installs an event handler on `global` for the `message` event: see
    // * https://developer.mozilla.org/en/DOM/window.postMessage
    // * http://www.whatwg.org/specs/web-apps/current-work/multipage/comms.html#crossDocumentMessages

    var messagePrefix = "setImmediate$" + Math.random() + "$";
    var onGlobalMessage = function onGlobalMessage(event) {
      if (event.source === global && typeof event.data === "string" && event.data.indexOf(messagePrefix) === 0) {
        runIfPresent(+event.data.slice(messagePrefix.length));
      }
    };
    if (global.addEventListener) {
      global.addEventListener("message", onGlobalMessage, false);
    } else {
      global.attachEvent("onmessage", onGlobalMessage);
    }
    registerImmediate = function registerImmediate(handle) {
      global.postMessage(messagePrefix + handle, "*");
    };
  }
  function installMessageChannelImplementation() {
    var channel = new MessageChannel();
    channel.port1.onmessage = function (event) {
      var handle = event.data;
      runIfPresent(handle);
    };
    registerImmediate = function registerImmediate(handle) {
      channel.port2.postMessage(handle);
    };
  }
  function installReadyStateChangeImplementation() {
    var html = doc.documentElement;
    registerImmediate = function registerImmediate(handle) {
      // Create a <script> element; its readystatechange event will be fired asynchronously once it is inserted
      // into the document. Do so, thus queuing up the task. Remember to clean up once it's been called.
      var script = doc.createElement("script");
      script.onreadystatechange = function () {
        runIfPresent(handle);
        script.onreadystatechange = null;
        html.removeChild(script);
        script = null;
      };
      html.appendChild(script);
    };
  }
  function installSetTimeoutImplementation() {
    registerImmediate = function registerImmediate(handle) {
      setTimeout(runIfPresent, 0, handle);
    };
  }

  // If supported, we should attach to the prototype of global, since that is where setTimeout et al. live.
  var attachTo = Object.getPrototypeOf && Object.getPrototypeOf(global);
  attachTo = attachTo && attachTo.setTimeout ? attachTo : global;

  // Don't get fooled by e.g. browserify environments.
  if ({}.toString.call(global.process) === "[object process]") {
    // For Node.js before 0.9
    installNextTickImplementation();
  } else if (canUsePostMessage()) {
    // For non-IE10 modern browsers
    installPostMessageImplementation();
  } else if (global.MessageChannel) {
    // For web workers, where supported
    installMessageChannelImplementation();
  } else if (doc && "onreadystatechange" in doc.createElement("script")) {
    // For IE 6–8
    installReadyStateChangeImplementation();
  } else {
    // For older browsers
    installSetTimeoutImplementation();
  }
  attachTo.setImmediate = setImmediate;
  attachTo.clearImmediate = clearImmediate;
})(typeof self === "undefined" ? typeof __webpack_require__.g === "undefined" ? this : __webpack_require__.g : self);

/***/ }),

/***/ 705:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
var GetIntrinsic = __webpack_require__(3584);
var callBound = __webpack_require__(2648);
var inspect = __webpack_require__(8291);
var $TypeError = GetIntrinsic('%TypeError%');
var $WeakMap = GetIntrinsic('%WeakMap%', true);
var $Map = GetIntrinsic('%Map%', true);
var $weakMapGet = callBound('WeakMap.prototype.get', true);
var $weakMapSet = callBound('WeakMap.prototype.set', true);
var $weakMapHas = callBound('WeakMap.prototype.has', true);
var $mapGet = callBound('Map.prototype.get', true);
var $mapSet = callBound('Map.prototype.set', true);
var $mapHas = callBound('Map.prototype.has', true);

/*
 * This function traverses the list returning the node corresponding to the
 * given key.
 *
 * That node is also moved to the head of the list, so that if it's accessed
 * again we don't need to traverse the whole list. By doing so, all the recently
 * used nodes can be accessed relatively quickly.
 */
var listGetNode = function listGetNode(list, key) {
  // eslint-disable-line consistent-return
  for (var prev = list, curr; (curr = prev.next) !== null; prev = curr) {
    if (curr.key === key) {
      prev.next = curr.next;
      curr.next = list.next;
      list.next = curr; // eslint-disable-line no-param-reassign
      return curr;
    }
  }
};
var listGet = function listGet(objects, key) {
  var node = listGetNode(objects, key);
  return node && node.value;
};
var listSet = function listSet(objects, key, value) {
  var node = listGetNode(objects, key);
  if (node) {
    node.value = value;
  } else {
    // Prepend the new node to the beginning of the list
    objects.next = {
      // eslint-disable-line no-param-reassign
      key: key,
      next: objects.next,
      value: value
    };
  }
};
var listHas = function listHas(objects, key) {
  return !!listGetNode(objects, key);
};
module.exports = function getSideChannel() {
  var $wm;
  var $m;
  var $o;
  var channel = {
    assert: function assert(key) {
      if (!channel.has(key)) {
        throw new $TypeError('Side channel does not contain ' + inspect(key));
      }
    },
    get: function get(key) {
      // eslint-disable-line consistent-return
      if ($WeakMap && key && (_typeof(key) === 'object' || typeof key === 'function')) {
        if ($wm) {
          return $weakMapGet($wm, key);
        }
      } else if ($Map) {
        if ($m) {
          return $mapGet($m, key);
        }
      } else {
        if ($o) {
          // eslint-disable-line no-lonely-if
          return listGet($o, key);
        }
      }
    },
    has: function has(key) {
      if ($WeakMap && key && (_typeof(key) === 'object' || typeof key === 'function')) {
        if ($wm) {
          return $weakMapHas($wm, key);
        }
      } else if ($Map) {
        if ($m) {
          return $mapHas($m, key);
        }
      } else {
        if ($o) {
          // eslint-disable-line no-lonely-if
          return listHas($o, key);
        }
      }
      return false;
    },
    set: function set(key, value) {
      if ($WeakMap && key && (_typeof(key) === 'object' || typeof key === 'function')) {
        if (!$wm) {
          $wm = new $WeakMap();
        }
        $weakMapSet($wm, key, value);
      } else if ($Map) {
        if (!$m) {
          $m = new $Map();
        }
        $mapSet($m, key, value);
      } else {
        if (!$o) {
          /*
           * Initialize the linked list as an empty node, so that we don't have
           * to special-case handling of the first node: we can always refer to
           * it as (previous node).next, instead of something like (list).head
           */
          $o = {
            key: {},
            next: null
          };
        }
        listSet($o, key, value);
      }
    }
  };
  return channel;
};

/***/ }),

/***/ 9788:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

module.exports = Stream;
var EE = (__webpack_require__(1590).EventEmitter);
var inherits = __webpack_require__(5153);
inherits(Stream, EE);
Stream.Readable = __webpack_require__(8817);
Stream.Writable = __webpack_require__(2248);
Stream.Duplex = __webpack_require__(3653);
Stream.Transform = __webpack_require__(5500);
Stream.PassThrough = __webpack_require__(8210);
Stream.finished = __webpack_require__(6591);
Stream.pipeline = __webpack_require__(5879);

// Backwards-compat with node 0.4.x
Stream.Stream = Stream;

// old-style streams.  Note that the pipe method (the only relevant
// part of this class) is overridden in the Readable class.

function Stream() {
  EE.call(this);
}
Stream.prototype.pipe = function (dest, options) {
  var source = this;
  function ondata(chunk) {
    if (dest.writable) {
      if (false === dest.write(chunk) && source.pause) {
        source.pause();
      }
    }
  }
  source.on('data', ondata);
  function ondrain() {
    if (source.readable && source.resume) {
      source.resume();
    }
  }
  dest.on('drain', ondrain);

  // If the 'end' option is not supplied, dest.end() will be called when
  // source gets the 'end' or 'close' events.  Only dest.end() once.
  if (!dest._isStdio && (!options || options.end !== false)) {
    source.on('end', onend);
    source.on('close', onclose);
  }
  var didOnEnd = false;
  function onend() {
    if (didOnEnd) return;
    didOnEnd = true;
    dest.end();
  }
  function onclose() {
    if (didOnEnd) return;
    didOnEnd = true;
    if (typeof dest.destroy === 'function') dest.destroy();
  }

  // don't leave dangling pipes when there are errors.
  function onerror(er) {
    cleanup();
    if (EE.listenerCount(this, 'error') === 0) {
      throw er; // Unhandled stream error in pipe.
    }
  }

  source.on('error', onerror);
  dest.on('error', onerror);

  // remove all the event listeners that were added.
  function cleanup() {
    source.removeListener('data', ondata);
    dest.removeListener('drain', ondrain);
    source.removeListener('end', onend);
    source.removeListener('close', onclose);
    source.removeListener('error', onerror);
    dest.removeListener('error', onerror);
    source.removeListener('end', cleanup);
    source.removeListener('close', cleanup);
    dest.removeListener('close', cleanup);
  }
  source.on('end', cleanup);
  source.on('close', cleanup);
  dest.on('close', cleanup);
  dest.emit('pipe', source);

  // Allow for unix-like usage: A.pipe(B).pipe(C)
  return dest;
};

/***/ }),

/***/ 1907:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.



/*<replacement>*/
var Buffer = (__webpack_require__(3311).Buffer);
/*</replacement>*/

var isEncoding = Buffer.isEncoding || function (encoding) {
  encoding = '' + encoding;
  switch (encoding && encoding.toLowerCase()) {
    case 'hex':
    case 'utf8':
    case 'utf-8':
    case 'ascii':
    case 'binary':
    case 'base64':
    case 'ucs2':
    case 'ucs-2':
    case 'utf16le':
    case 'utf-16le':
    case 'raw':
      return true;
    default:
      return false;
  }
};
function _normalizeEncoding(enc) {
  if (!enc) return 'utf8';
  var retried;
  while (true) {
    switch (enc) {
      case 'utf8':
      case 'utf-8':
        return 'utf8';
      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return 'utf16le';
      case 'latin1':
      case 'binary':
        return 'latin1';
      case 'base64':
      case 'ascii':
      case 'hex':
        return enc;
      default:
        if (retried) return; // undefined
        enc = ('' + enc).toLowerCase();
        retried = true;
    }
  }
}
;

// Do not cache `Buffer.isEncoding` when checking encoding names as some
// modules monkey-patch it to support additional encodings
function normalizeEncoding(enc) {
  var nenc = _normalizeEncoding(enc);
  if (typeof nenc !== 'string' && (Buffer.isEncoding === isEncoding || !isEncoding(enc))) throw new Error('Unknown encoding: ' + enc);
  return nenc || enc;
}

// StringDecoder provides an interface for efficiently splitting a series of
// buffers into a series of JS strings without breaking apart multi-byte
// characters.
exports.s = StringDecoder;
function StringDecoder(encoding) {
  this.encoding = normalizeEncoding(encoding);
  var nb;
  switch (this.encoding) {
    case 'utf16le':
      this.text = utf16Text;
      this.end = utf16End;
      nb = 4;
      break;
    case 'utf8':
      this.fillLast = utf8FillLast;
      nb = 4;
      break;
    case 'base64':
      this.text = base64Text;
      this.end = base64End;
      nb = 3;
      break;
    default:
      this.write = simpleWrite;
      this.end = simpleEnd;
      return;
  }
  this.lastNeed = 0;
  this.lastTotal = 0;
  this.lastChar = Buffer.allocUnsafe(nb);
}
StringDecoder.prototype.write = function (buf) {
  if (buf.length === 0) return '';
  var r;
  var i;
  if (this.lastNeed) {
    r = this.fillLast(buf);
    if (r === undefined) return '';
    i = this.lastNeed;
    this.lastNeed = 0;
  } else {
    i = 0;
  }
  if (i < buf.length) return r ? r + this.text(buf, i) : this.text(buf, i);
  return r || '';
};
StringDecoder.prototype.end = utf8End;

// Returns only complete characters in a Buffer
StringDecoder.prototype.text = utf8Text;

// Attempts to complete a partial non-UTF-8 character using bytes from a Buffer
StringDecoder.prototype.fillLast = function (buf) {
  if (this.lastNeed <= buf.length) {
    buf.copy(this.lastChar, this.lastTotal - this.lastNeed, 0, this.lastNeed);
    return this.lastChar.toString(this.encoding, 0, this.lastTotal);
  }
  buf.copy(this.lastChar, this.lastTotal - this.lastNeed, 0, buf.length);
  this.lastNeed -= buf.length;
};

// Checks the type of a UTF-8 byte, whether it's ASCII, a leading byte, or a
// continuation byte. If an invalid byte is detected, -2 is returned.
function utf8CheckByte(_byte) {
  if (_byte <= 0x7F) return 0;else if (_byte >> 5 === 0x06) return 2;else if (_byte >> 4 === 0x0E) return 3;else if (_byte >> 3 === 0x1E) return 4;
  return _byte >> 6 === 0x02 ? -1 : -2;
}

// Checks at most 3 bytes at the end of a Buffer in order to detect an
// incomplete multi-byte UTF-8 character. The total number of bytes (2, 3, or 4)
// needed to complete the UTF-8 character (if applicable) are returned.
function utf8CheckIncomplete(self, buf, i) {
  var j = buf.length - 1;
  if (j < i) return 0;
  var nb = utf8CheckByte(buf[j]);
  if (nb >= 0) {
    if (nb > 0) self.lastNeed = nb - 1;
    return nb;
  }
  if (--j < i || nb === -2) return 0;
  nb = utf8CheckByte(buf[j]);
  if (nb >= 0) {
    if (nb > 0) self.lastNeed = nb - 2;
    return nb;
  }
  if (--j < i || nb === -2) return 0;
  nb = utf8CheckByte(buf[j]);
  if (nb >= 0) {
    if (nb > 0) {
      if (nb === 2) nb = 0;else self.lastNeed = nb - 3;
    }
    return nb;
  }
  return 0;
}

// Validates as many continuation bytes for a multi-byte UTF-8 character as
// needed or are available. If we see a non-continuation byte where we expect
// one, we "replace" the validated continuation bytes we've seen so far with
// a single UTF-8 replacement character ('\ufffd'), to match v8's UTF-8 decoding
// behavior. The continuation byte check is included three times in the case
// where all of the continuation bytes for a character exist in the same buffer.
// It is also done this way as a slight performance increase instead of using a
// loop.
function utf8CheckExtraBytes(self, buf, p) {
  if ((buf[0] & 0xC0) !== 0x80) {
    self.lastNeed = 0;
    return "\uFFFD";
  }
  if (self.lastNeed > 1 && buf.length > 1) {
    if ((buf[1] & 0xC0) !== 0x80) {
      self.lastNeed = 1;
      return "\uFFFD";
    }
    if (self.lastNeed > 2 && buf.length > 2) {
      if ((buf[2] & 0xC0) !== 0x80) {
        self.lastNeed = 2;
        return "\uFFFD";
      }
    }
  }
}

// Attempts to complete a multi-byte UTF-8 character using bytes from a Buffer.
function utf8FillLast(buf) {
  var p = this.lastTotal - this.lastNeed;
  var r = utf8CheckExtraBytes(this, buf, p);
  if (r !== undefined) return r;
  if (this.lastNeed <= buf.length) {
    buf.copy(this.lastChar, p, 0, this.lastNeed);
    return this.lastChar.toString(this.encoding, 0, this.lastTotal);
  }
  buf.copy(this.lastChar, p, 0, buf.length);
  this.lastNeed -= buf.length;
}

// Returns all complete UTF-8 characters in a Buffer. If the Buffer ended on a
// partial character, the character's bytes are buffered until the required
// number of bytes are available.
function utf8Text(buf, i) {
  var total = utf8CheckIncomplete(this, buf, i);
  if (!this.lastNeed) return buf.toString('utf8', i);
  this.lastTotal = total;
  var end = buf.length - (total - this.lastNeed);
  buf.copy(this.lastChar, 0, end);
  return buf.toString('utf8', i, end);
}

// For UTF-8, a replacement character is added when ending on a partial
// character.
function utf8End(buf) {
  var r = buf && buf.length ? this.write(buf) : '';
  if (this.lastNeed) return r + "\uFFFD";
  return r;
}

// UTF-16LE typically needs two bytes per character, but even if we have an even
// number of bytes available, we need to check if we end on a leading/high
// surrogate. In that case, we need to wait for the next two bytes in order to
// decode the last character properly.
function utf16Text(buf, i) {
  if ((buf.length - i) % 2 === 0) {
    var r = buf.toString('utf16le', i);
    if (r) {
      var c = r.charCodeAt(r.length - 1);
      if (c >= 0xD800 && c <= 0xDBFF) {
        this.lastNeed = 2;
        this.lastTotal = 4;
        this.lastChar[0] = buf[buf.length - 2];
        this.lastChar[1] = buf[buf.length - 1];
        return r.slice(0, -1);
      }
    }
    return r;
  }
  this.lastNeed = 1;
  this.lastTotal = 2;
  this.lastChar[0] = buf[buf.length - 1];
  return buf.toString('utf16le', i, buf.length - 1);
}

// For UTF-16LE we do not explicitly append special replacement characters if we
// end on a partial character, we simply let v8 handle that.
function utf16End(buf) {
  var r = buf && buf.length ? this.write(buf) : '';
  if (this.lastNeed) {
    var end = this.lastTotal - this.lastNeed;
    return r + this.lastChar.toString('utf16le', 0, end);
  }
  return r;
}
function base64Text(buf, i) {
  var n = (buf.length - i) % 3;
  if (n === 0) return buf.toString('base64', i);
  this.lastNeed = 3 - n;
  this.lastTotal = 3;
  if (n === 1) {
    this.lastChar[0] = buf[buf.length - 1];
  } else {
    this.lastChar[0] = buf[buf.length - 2];
    this.lastChar[1] = buf[buf.length - 1];
  }
  return buf.toString('base64', i, buf.length - n);
}
function base64End(buf) {
  var r = buf && buf.length ? this.write(buf) : '';
  if (this.lastNeed) return r + this.lastChar.toString('base64', 0, 3 - this.lastNeed);
  return r;
}

// Pass bytes on through for single-byte encodings (e.g. ascii, latin1, hex)
function simpleWrite(buf) {
  return buf.toString(this.encoding);
}
function simpleEnd(buf) {
  return buf && buf.length ? this.write(buf) : '';
}

/***/ }),

/***/ 8865:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

var scope = typeof __webpack_require__.g !== "undefined" && __webpack_require__.g || typeof self !== "undefined" && self || window;
var apply = Function.prototype.apply;

// DOM APIs, for completeness

exports.setTimeout = function () {
  return new Timeout(apply.call(setTimeout, scope, arguments), clearTimeout);
};
exports.setInterval = function () {
  return new Timeout(apply.call(setInterval, scope, arguments), clearInterval);
};
exports.clearTimeout = exports.clearInterval = function (timeout) {
  if (timeout) {
    timeout.close();
  }
};
function Timeout(id, clearFn) {
  this._id = id;
  this._clearFn = clearFn;
}
Timeout.prototype.unref = Timeout.prototype.ref = function () {};
Timeout.prototype.close = function () {
  this._clearFn.call(scope, this._id);
};

// Does not start the time, just sets up the members needed.
exports.enroll = function (item, msecs) {
  clearTimeout(item._idleTimeoutId);
  item._idleTimeout = msecs;
};
exports.unenroll = function (item) {
  clearTimeout(item._idleTimeoutId);
  item._idleTimeout = -1;
};
exports._unrefActive = exports.active = function (item) {
  clearTimeout(item._idleTimeoutId);
  var msecs = item._idleTimeout;
  if (msecs >= 0) {
    item._idleTimeoutId = setTimeout(function onTimeout() {
      if (item._onTimeout) item._onTimeout();
    }, msecs);
  }
};

// setimmediate attaches itself to the global object
__webpack_require__(7648);
// On some exotic environments, it's not clear which object `setimmediate` was
// able to install onto.  Search each possibility in the same order as the
// `setimmediate` library.
exports.setImmediate = typeof self !== "undefined" && self.setImmediate || typeof __webpack_require__.g !== "undefined" && __webpack_require__.g.setImmediate || this && this.setImmediate;
exports.clearImmediate = typeof self !== "undefined" && self.clearImmediate || typeof __webpack_require__.g !== "undefined" && __webpack_require__.g.clearImmediate || this && this.clearImmediate;

/***/ }),

/***/ 1749:
/***/ (function(module, exports, __webpack_require__) {

/* module decorator */ module = __webpack_require__.nmd(module);
var __WEBPACK_AMD_DEFINE_RESULT__;function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
/*! https://mths.be/punycode v1.4.1 by @mathias */
;
(function (root) {
  /** Detect free variables */
  var freeExports = ( false ? 0 : _typeof(exports)) == 'object' && exports && !exports.nodeType && exports;
  var freeModule = ( false ? 0 : _typeof(module)) == 'object' && module && !module.nodeType && module;
  var freeGlobal = (typeof __webpack_require__.g === "undefined" ? "undefined" : _typeof(__webpack_require__.g)) == 'object' && __webpack_require__.g;
  if (freeGlobal.global === freeGlobal || freeGlobal.window === freeGlobal || freeGlobal.self === freeGlobal) {
    root = freeGlobal;
  }

  /**
   * The `punycode` object.
   * @name punycode
   * @type Object
   */
  var punycode,
    /** Highest positive signed 32-bit float value */
    maxInt = 2147483647,
    // aka. 0x7FFFFFFF or 2^31-1

    /** Bootstring parameters */
    base = 36,
    tMin = 1,
    tMax = 26,
    skew = 38,
    damp = 700,
    initialBias = 72,
    initialN = 128,
    // 0x80
    delimiter = '-',
    // '\x2D'

    /** Regular expressions */
    regexPunycode = /^xn--/,
    regexNonASCII = /[^\x20-\x7E]/,
    // unprintable ASCII chars + non-ASCII chars
    regexSeparators = /[\x2E\u3002\uFF0E\uFF61]/g,
    // RFC 3490 separators

    /** Error messages */
    errors = {
      'overflow': 'Overflow: input needs wider integers to process',
      'not-basic': 'Illegal input >= 0x80 (not a basic code point)',
      'invalid-input': 'Invalid input'
    },
    /** Convenience shortcuts */
    baseMinusTMin = base - tMin,
    floor = Math.floor,
    stringFromCharCode = String.fromCharCode,
    /** Temporary variable */
    key;

  /*--------------------------------------------------------------------------*/

  /**
   * A generic error utility function.
   * @private
   * @param {String} type The error type.
   * @returns {Error} Throws a `RangeError` with the applicable error message.
   */
  function error(type) {
    throw new RangeError(errors[type]);
  }

  /**
   * A generic `Array#map` utility function.
   * @private
   * @param {Array} array The array to iterate over.
   * @param {Function} callback The function that gets called for every array
   * item.
   * @returns {Array} A new array of values returned by the callback function.
   */
  function map(array, fn) {
    var length = array.length;
    var result = [];
    while (length--) {
      result[length] = fn(array[length]);
    }
    return result;
  }

  /**
   * A simple `Array#map`-like wrapper to work with domain name strings or email
   * addresses.
   * @private
   * @param {String} domain The domain name or email address.
   * @param {Function} callback The function that gets called for every
   * character.
   * @returns {Array} A new string of characters returned by the callback
   * function.
   */
  function mapDomain(string, fn) {
    var parts = string.split('@');
    var result = '';
    if (parts.length > 1) {
      // In email addresses, only the domain name should be punycoded. Leave
      // the local part (i.e. everything up to `@`) intact.
      result = parts[0] + '@';
      string = parts[1];
    }
    // Avoid `split(regex)` for IE8 compatibility. See #17.
    string = string.replace(regexSeparators, '\x2E');
    var labels = string.split('.');
    var encoded = map(labels, fn).join('.');
    return result + encoded;
  }

  /**
   * Creates an array containing the numeric code points of each Unicode
   * character in the string. While JavaScript uses UCS-2 internally,
   * this function will convert a pair of surrogate halves (each of which
   * UCS-2 exposes as separate characters) into a single code point,
   * matching UTF-16.
   * @see `punycode.ucs2.encode`
   * @see <https://mathiasbynens.be/notes/javascript-encoding>
   * @memberOf punycode.ucs2
   * @name decode
   * @param {String} string The Unicode input string (UCS-2).
   * @returns {Array} The new array of code points.
   */
  function ucs2decode(string) {
    var output = [],
      counter = 0,
      length = string.length,
      value,
      extra;
    while (counter < length) {
      value = string.charCodeAt(counter++);
      if (value >= 0xD800 && value <= 0xDBFF && counter < length) {
        // high surrogate, and there is a next character
        extra = string.charCodeAt(counter++);
        if ((extra & 0xFC00) == 0xDC00) {
          // low surrogate
          output.push(((value & 0x3FF) << 10) + (extra & 0x3FF) + 0x10000);
        } else {
          // unmatched surrogate; only append this code unit, in case the next
          // code unit is the high surrogate of a surrogate pair
          output.push(value);
          counter--;
        }
      } else {
        output.push(value);
      }
    }
    return output;
  }

  /**
   * Creates a string based on an array of numeric code points.
   * @see `punycode.ucs2.decode`
   * @memberOf punycode.ucs2
   * @name encode
   * @param {Array} codePoints The array of numeric code points.
   * @returns {String} The new Unicode string (UCS-2).
   */
  function ucs2encode(array) {
    return map(array, function (value) {
      var output = '';
      if (value > 0xFFFF) {
        value -= 0x10000;
        output += stringFromCharCode(value >>> 10 & 0x3FF | 0xD800);
        value = 0xDC00 | value & 0x3FF;
      }
      output += stringFromCharCode(value);
      return output;
    }).join('');
  }

  /**
   * Converts a basic code point into a digit/integer.
   * @see `digitToBasic()`
   * @private
   * @param {Number} codePoint The basic numeric code point value.
   * @returns {Number} The numeric value of a basic code point (for use in
   * representing integers) in the range `0` to `base - 1`, or `base` if
   * the code point does not represent a value.
   */
  function basicToDigit(codePoint) {
    if (codePoint - 48 < 10) {
      return codePoint - 22;
    }
    if (codePoint - 65 < 26) {
      return codePoint - 65;
    }
    if (codePoint - 97 < 26) {
      return codePoint - 97;
    }
    return base;
  }

  /**
   * Converts a digit/integer into a basic code point.
   * @see `basicToDigit()`
   * @private
   * @param {Number} digit The numeric value of a basic code point.
   * @returns {Number} The basic code point whose value (when used for
   * representing integers) is `digit`, which needs to be in the range
   * `0` to `base - 1`. If `flag` is non-zero, the uppercase form is
   * used; else, the lowercase form is used. The behavior is undefined
   * if `flag` is non-zero and `digit` has no uppercase form.
   */
  function digitToBasic(digit, flag) {
    //  0..25 map to ASCII a..z or A..Z
    // 26..35 map to ASCII 0..9
    return digit + 22 + 75 * (digit < 26) - ((flag != 0) << 5);
  }

  /**
   * Bias adaptation function as per section 3.4 of RFC 3492.
   * https://tools.ietf.org/html/rfc3492#section-3.4
   * @private
   */
  function adapt(delta, numPoints, firstTime) {
    var k = 0;
    delta = firstTime ? floor(delta / damp) : delta >> 1;
    delta += floor(delta / numPoints);
    for /* no initialization */
    (; delta > baseMinusTMin * tMax >> 1; k += base) {
      delta = floor(delta / baseMinusTMin);
    }
    return floor(k + (baseMinusTMin + 1) * delta / (delta + skew));
  }

  /**
   * Converts a Punycode string of ASCII-only symbols to a string of Unicode
   * symbols.
   * @memberOf punycode
   * @param {String} input The Punycode string of ASCII-only symbols.
   * @returns {String} The resulting string of Unicode symbols.
   */
  function decode(input) {
    // Don't use UCS-2
    var output = [],
      inputLength = input.length,
      out,
      i = 0,
      n = initialN,
      bias = initialBias,
      basic,
      j,
      index,
      oldi,
      w,
      k,
      digit,
      t,
      /** Cached calculation results */
      baseMinusT;

    // Handle the basic code points: let `basic` be the number of input code
    // points before the last delimiter, or `0` if there is none, then copy
    // the first basic code points to the output.

    basic = input.lastIndexOf(delimiter);
    if (basic < 0) {
      basic = 0;
    }
    for (j = 0; j < basic; ++j) {
      // if it's not a basic code point
      if (input.charCodeAt(j) >= 0x80) {
        error('not-basic');
      }
      output.push(input.charCodeAt(j));
    }

    // Main decoding loop: start just after the last delimiter if any basic code
    // points were copied; start at the beginning otherwise.

    for /* no final expression */
    (index = basic > 0 ? basic + 1 : 0; index < inputLength;) {
      // `index` is the index of the next character to be consumed.
      // Decode a generalized variable-length integer into `delta`,
      // which gets added to `i`. The overflow checking is easier
      // if we increase `i` as we go, then subtract off its starting
      // value at the end to obtain `delta`.
      for /* no condition */
      (oldi = i, w = 1, k = base;; k += base) {
        if (index >= inputLength) {
          error('invalid-input');
        }
        digit = basicToDigit(input.charCodeAt(index++));
        if (digit >= base || digit > floor((maxInt - i) / w)) {
          error('overflow');
        }
        i += digit * w;
        t = k <= bias ? tMin : k >= bias + tMax ? tMax : k - bias;
        if (digit < t) {
          break;
        }
        baseMinusT = base - t;
        if (w > floor(maxInt / baseMinusT)) {
          error('overflow');
        }
        w *= baseMinusT;
      }
      out = output.length + 1;
      bias = adapt(i - oldi, out, oldi == 0);

      // `i` was supposed to wrap around from `out` to `0`,
      // incrementing `n` each time, so we'll fix that now:
      if (floor(i / out) > maxInt - n) {
        error('overflow');
      }
      n += floor(i / out);
      i %= out;

      // Insert `n` at position `i` of the output
      output.splice(i++, 0, n);
    }
    return ucs2encode(output);
  }

  /**
   * Converts a string of Unicode symbols (e.g. a domain name label) to a
   * Punycode string of ASCII-only symbols.
   * @memberOf punycode
   * @param {String} input The string of Unicode symbols.
   * @returns {String} The resulting Punycode string of ASCII-only symbols.
   */
  function encode(input) {
    var n,
      delta,
      handledCPCount,
      basicLength,
      bias,
      j,
      m,
      q,
      k,
      t,
      currentValue,
      output = [],
      /** `inputLength` will hold the number of code points in `input`. */
      inputLength,
      /** Cached calculation results */
      handledCPCountPlusOne,
      baseMinusT,
      qMinusT;

    // Convert the input in UCS-2 to Unicode
    input = ucs2decode(input);

    // Cache the length
    inputLength = input.length;

    // Initialize the state
    n = initialN;
    delta = 0;
    bias = initialBias;

    // Handle the basic code points
    for (j = 0; j < inputLength; ++j) {
      currentValue = input[j];
      if (currentValue < 0x80) {
        output.push(stringFromCharCode(currentValue));
      }
    }
    handledCPCount = basicLength = output.length;

    // `handledCPCount` is the number of code points that have been handled;
    // `basicLength` is the number of basic code points.

    // Finish the basic string - if it is not empty - with a delimiter
    if (basicLength) {
      output.push(delimiter);
    }

    // Main encoding loop:
    while (handledCPCount < inputLength) {
      // All non-basic code points < n have been handled already. Find the next
      // larger one:
      for (m = maxInt, j = 0; j < inputLength; ++j) {
        currentValue = input[j];
        if (currentValue >= n && currentValue < m) {
          m = currentValue;
        }
      }

      // Increase `delta` enough to advance the decoder's <n,i> state to <m,0>,
      // but guard against overflow
      handledCPCountPlusOne = handledCPCount + 1;
      if (m - n > floor((maxInt - delta) / handledCPCountPlusOne)) {
        error('overflow');
      }
      delta += (m - n) * handledCPCountPlusOne;
      n = m;
      for (j = 0; j < inputLength; ++j) {
        currentValue = input[j];
        if (currentValue < n && ++delta > maxInt) {
          error('overflow');
        }
        if (currentValue == n) {
          // Represent delta as a generalized variable-length integer
          for /* no condition */
          (q = delta, k = base;; k += base) {
            t = k <= bias ? tMin : k >= bias + tMax ? tMax : k - bias;
            if (q < t) {
              break;
            }
            qMinusT = q - t;
            baseMinusT = base - t;
            output.push(stringFromCharCode(digitToBasic(t + qMinusT % baseMinusT, 0)));
            q = floor(qMinusT / baseMinusT);
          }
          output.push(stringFromCharCode(digitToBasic(q, 0)));
          bias = adapt(delta, handledCPCountPlusOne, handledCPCount == basicLength);
          delta = 0;
          ++handledCPCount;
        }
      }
      ++delta;
      ++n;
    }
    return output.join('');
  }

  /**
   * Converts a Punycode string representing a domain name or an email address
   * to Unicode. Only the Punycoded parts of the input will be converted, i.e.
   * it doesn't matter if you call it on a string that has already been
   * converted to Unicode.
   * @memberOf punycode
   * @param {String} input The Punycoded domain name or email address to
   * convert to Unicode.
   * @returns {String} The Unicode representation of the given Punycode
   * string.
   */
  function toUnicode(input) {
    return mapDomain(input, function (string) {
      return regexPunycode.test(string) ? decode(string.slice(4).toLowerCase()) : string;
    });
  }

  /**
   * Converts a Unicode string representing a domain name or an email address to
   * Punycode. Only the non-ASCII parts of the domain name will be converted,
   * i.e. it doesn't matter if you call it with a domain that's already in
   * ASCII.
   * @memberOf punycode
   * @param {String} input The domain name or email address to convert, as a
   * Unicode string.
   * @returns {String} The Punycode representation of the given domain name or
   * email address.
   */
  function toASCII(input) {
    return mapDomain(input, function (string) {
      return regexNonASCII.test(string) ? 'xn--' + encode(string) : string;
    });
  }

  /*--------------------------------------------------------------------------*/

  /** Define the public API */
  punycode = {
    /**
     * A string representing the current Punycode.js version number.
     * @memberOf punycode
     * @type String
     */
    'version': '1.4.1',
    /**
     * An object of methods to convert from JavaScript's internal character
     * representation (UCS-2) to Unicode code points, and back.
     * @see <https://mathiasbynens.be/notes/javascript-encoding>
     * @memberOf punycode
     * @type Object
     */
    'ucs2': {
      'decode': ucs2decode,
      'encode': ucs2encode
    },
    'decode': decode,
    'encode': encode,
    'toASCII': toASCII,
    'toUnicode': toUnicode
  };

  /** Expose `punycode` */
  // Some AMD build optimizers, like r.js, check for specific condition patterns
  // like the following:
  if ( true && _typeof(__webpack_require__.amdO) == 'object' && __webpack_require__.amdO) {
    !(__WEBPACK_AMD_DEFINE_RESULT__ = (function () {
      return punycode;
    }).call(exports, __webpack_require__, exports, module),
		__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
  } else if (freeExports && freeModule) {
    if (module.exports == freeExports) {
      // in Node.js, io.js, or RingoJS v0.8.0+
      freeModule.exports = punycode;
    } else {
      // in Narwhal or RingoJS v0.7.0-
      for (key in punycode) {
        punycode.hasOwnProperty(key) && (freeExports[key] = punycode[key]);
      }
    }
  } else {
    // in Rhino or a web browser
    root.punycode = punycode;
  }
})(this);

/***/ }),

/***/ 3149:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";
/*
 * Copyright Joyent, Inc. and other Node contributors.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a
 * copy of this software and associated documentation files (the
 * "Software"), to deal in the Software without restriction, including
 * without limitation the rights to use, copy, modify, merge, publish,
 * distribute, sublicense, and/or sell copies of the Software, and to permit
 * persons to whom the Software is furnished to do so, subject to the
 * following conditions:
 *
 * The above copyright notice and this permission notice shall be included
 * in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
 * OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
 * MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
 * NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
 * DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
 * OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
 * USE OR OTHER DEALINGS IN THE SOFTWARE.
 */



function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
var punycode = __webpack_require__(1749);
function Url() {
  this.protocol = null;
  this.slashes = null;
  this.auth = null;
  this.host = null;
  this.port = null;
  this.hostname = null;
  this.hash = null;
  this.search = null;
  this.query = null;
  this.pathname = null;
  this.path = null;
  this.href = null;
}

// Reference: RFC 3986, RFC 1808, RFC 2396

/*
 * define these here so at least they only have to be
 * compiled once on the first module load.
 */
var protocolPattern = /^([a-z0-9.+-]+:)/i,
  portPattern = /:[0-9]*$/,
  // Special case for a simple path URL
  simplePathPattern = /^(\/\/?(?!\/)[^?\s]*)(\?[^\s]*)?$/,
  /*
   * RFC 2396: characters reserved for delimiting URLs.
   * We actually just auto-escape these.
   */
  delims = ['<', '>', '"', '`', ' ', '\r', '\n', '\t'],
  // RFC 2396: characters not allowed for various reasons.
  unwise = ['{', '}', '|', '\\', '^', '`'].concat(delims),
  // Allowed by RFCs, but cause of XSS attacks.  Always escape these.
  autoEscape = ['\''].concat(unwise),
  /*
   * Characters that are never ever allowed in a hostname.
   * Note that any invalid chars are also handled, but these
   * are the ones that are *expected* to be seen, so we fast-path
   * them.
   */
  nonHostChars = ['%', '/', '?', ';', '#'].concat(autoEscape),
  hostEndingChars = ['/', '?', '#'],
  hostnameMaxLen = 255,
  hostnamePartPattern = /^[+a-z0-9A-Z_-]{0,63}$/,
  hostnamePartStart = /^([+a-z0-9A-Z_-]{0,63})(.*)$/,
  // protocols that can allow "unsafe" and "unwise" chars.
  unsafeProtocol = {
    javascript: true,
    'javascript:': true
  },
  // protocols that never have a hostname.
  hostlessProtocol = {
    javascript: true,
    'javascript:': true
  },
  // protocols that always contain a // bit.
  slashedProtocol = {
    http: true,
    https: true,
    ftp: true,
    gopher: true,
    file: true,
    'http:': true,
    'https:': true,
    'ftp:': true,
    'gopher:': true,
    'file:': true
  },
  querystring = __webpack_require__(520);
function urlParse(url, parseQueryString, slashesDenoteHost) {
  if (url && _typeof(url) === 'object' && url instanceof Url) {
    return url;
  }
  var u = new Url();
  u.parse(url, parseQueryString, slashesDenoteHost);
  return u;
}
Url.prototype.parse = function (url, parseQueryString, slashesDenoteHost) {
  if (typeof url !== 'string') {
    throw new TypeError("Parameter 'url' must be a string, not " + _typeof(url));
  }

  /*
   * Copy chrome, IE, opera backslash-handling behavior.
   * Back slashes before the query string get converted to forward slashes
   * See: https://code.google.com/p/chromium/issues/detail?id=25916
   */
  var queryIndex = url.indexOf('?'),
    splitter = queryIndex !== -1 && queryIndex < url.indexOf('#') ? '?' : '#',
    uSplit = url.split(splitter),
    slashRegex = /\\/g;
  uSplit[0] = uSplit[0].replace(slashRegex, '/');
  url = uSplit.join(splitter);
  var rest = url;

  /*
   * trim before proceeding.
   * This is to support parse stuff like "  http://foo.com  \n"
   */
  rest = rest.trim();
  if (!slashesDenoteHost && url.split('#').length === 1) {
    // Try fast path regexp
    var simplePath = simplePathPattern.exec(rest);
    if (simplePath) {
      this.path = rest;
      this.href = rest;
      this.pathname = simplePath[1];
      if (simplePath[2]) {
        this.search = simplePath[2];
        if (parseQueryString) {
          this.query = querystring.parse(this.search.substr(1));
        } else {
          this.query = this.search.substr(1);
        }
      } else if (parseQueryString) {
        this.search = '';
        this.query = {};
      }
      return this;
    }
  }
  var proto = protocolPattern.exec(rest);
  if (proto) {
    proto = proto[0];
    var lowerProto = proto.toLowerCase();
    this.protocol = lowerProto;
    rest = rest.substr(proto.length);
  }

  /*
   * figure out if it's got a host
   * user@server is *always* interpreted as a hostname, and url
   * resolution will treat //foo/bar as host=foo,path=bar because that's
   * how the browser resolves relative URLs.
   */
  if (slashesDenoteHost || proto || rest.match(/^\/\/[^@/]+@[^@/]+/)) {
    var slashes = rest.substr(0, 2) === '//';
    if (slashes && !(proto && hostlessProtocol[proto])) {
      rest = rest.substr(2);
      this.slashes = true;
    }
  }
  if (!hostlessProtocol[proto] && (slashes || proto && !slashedProtocol[proto])) {
    /*
     * there's a hostname.
     * the first instance of /, ?, ;, or # ends the host.
     *
     * If there is an @ in the hostname, then non-host chars *are* allowed
     * to the left of the last @ sign, unless some host-ending character
     * comes *before* the @-sign.
     * URLs are obnoxious.
     *
     * ex:
     * http://a@b@c/ => user:a@b host:c
     * http://a@b?@c => user:a host:c path:/?@c
     */

    /*
     * v0.12 TODO(isaacs): This is not quite how Chrome does things.
     * Review our test case against browsers more comprehensively.
     */

    // find the first instance of any hostEndingChars
    var hostEnd = -1;
    for (var i = 0; i < hostEndingChars.length; i++) {
      var hec = rest.indexOf(hostEndingChars[i]);
      if (hec !== -1 && (hostEnd === -1 || hec < hostEnd)) {
        hostEnd = hec;
      }
    }

    /*
     * at this point, either we have an explicit point where the
     * auth portion cannot go past, or the last @ char is the decider.
     */
    var auth, atSign;
    if (hostEnd === -1) {
      // atSign can be anywhere.
      atSign = rest.lastIndexOf('@');
    } else {
      /*
       * atSign must be in auth portion.
       * http://a@b/c@d => host:b auth:a path:/c@d
       */
      atSign = rest.lastIndexOf('@', hostEnd);
    }

    /*
     * Now we have a portion which is definitely the auth.
     * Pull that off.
     */
    if (atSign !== -1) {
      auth = rest.slice(0, atSign);
      rest = rest.slice(atSign + 1);
      this.auth = decodeURIComponent(auth);
    }

    // the host is the remaining to the left of the first non-host char
    hostEnd = -1;
    for (var i = 0; i < nonHostChars.length; i++) {
      var hec = rest.indexOf(nonHostChars[i]);
      if (hec !== -1 && (hostEnd === -1 || hec < hostEnd)) {
        hostEnd = hec;
      }
    }
    // if we still have not hit it, then the entire thing is a host.
    if (hostEnd === -1) {
      hostEnd = rest.length;
    }
    this.host = rest.slice(0, hostEnd);
    rest = rest.slice(hostEnd);

    // pull out port.
    this.parseHost();

    /*
     * we've indicated that there is a hostname,
     * so even if it's empty, it has to be present.
     */
    this.hostname = this.hostname || '';

    /*
     * if hostname begins with [ and ends with ]
     * assume that it's an IPv6 address.
     */
    var ipv6Hostname = this.hostname[0] === '[' && this.hostname[this.hostname.length - 1] === ']';

    // validate a little.
    if (!ipv6Hostname) {
      var hostparts = this.hostname.split(/\./);
      for (var i = 0, l = hostparts.length; i < l; i++) {
        var part = hostparts[i];
        if (!part) {
          continue;
        }
        if (!part.match(hostnamePartPattern)) {
          var newpart = '';
          for (var j = 0, k = part.length; j < k; j++) {
            if (part.charCodeAt(j) > 127) {
              /*
               * we replace non-ASCII char with a temporary placeholder
               * we need this to make sure size of hostname is not
               * broken by replacing non-ASCII by nothing
               */
              newpart += 'x';
            } else {
              newpart += part[j];
            }
          }
          // we test again with ASCII char only
          if (!newpart.match(hostnamePartPattern)) {
            var validParts = hostparts.slice(0, i);
            var notHost = hostparts.slice(i + 1);
            var bit = part.match(hostnamePartStart);
            if (bit) {
              validParts.push(bit[1]);
              notHost.unshift(bit[2]);
            }
            if (notHost.length) {
              rest = '/' + notHost.join('.') + rest;
            }
            this.hostname = validParts.join('.');
            break;
          }
        }
      }
    }
    if (this.hostname.length > hostnameMaxLen) {
      this.hostname = '';
    } else {
      // hostnames are always lower case.
      this.hostname = this.hostname.toLowerCase();
    }
    if (!ipv6Hostname) {
      /*
       * IDNA Support: Returns a punycoded representation of "domain".
       * It only converts parts of the domain name that
       * have non-ASCII characters, i.e. it doesn't matter if
       * you call it with a domain that already is ASCII-only.
       */
      this.hostname = punycode.toASCII(this.hostname);
    }
    var p = this.port ? ':' + this.port : '';
    var h = this.hostname || '';
    this.host = h + p;
    this.href += this.host;

    /*
     * strip [ and ] from the hostname
     * the host field still retains them, though
     */
    if (ipv6Hostname) {
      this.hostname = this.hostname.substr(1, this.hostname.length - 2);
      if (rest[0] !== '/') {
        rest = '/' + rest;
      }
    }
  }

  /*
   * now rest is set to the post-host stuff.
   * chop off any delim chars.
   */
  if (!unsafeProtocol[lowerProto]) {
    /*
     * First, make 100% sure that any "autoEscape" chars get
     * escaped, even if encodeURIComponent doesn't think they
     * need to be.
     */
    for (var i = 0, l = autoEscape.length; i < l; i++) {
      var ae = autoEscape[i];
      if (rest.indexOf(ae) === -1) {
        continue;
      }
      var esc = encodeURIComponent(ae);
      if (esc === ae) {
        esc = escape(ae);
      }
      rest = rest.split(ae).join(esc);
    }
  }

  // chop off from the tail first.
  var hash = rest.indexOf('#');
  if (hash !== -1) {
    // got a fragment string.
    this.hash = rest.substr(hash);
    rest = rest.slice(0, hash);
  }
  var qm = rest.indexOf('?');
  if (qm !== -1) {
    this.search = rest.substr(qm);
    this.query = rest.substr(qm + 1);
    if (parseQueryString) {
      this.query = querystring.parse(this.query);
    }
    rest = rest.slice(0, qm);
  } else if (parseQueryString) {
    // no query string, but parseQueryString still requested
    this.search = '';
    this.query = {};
  }
  if (rest) {
    this.pathname = rest;
  }
  if (slashedProtocol[lowerProto] && this.hostname && !this.pathname) {
    this.pathname = '/';
  }

  // to support http.request
  if (this.pathname || this.search) {
    var p = this.pathname || '';
    var s = this.search || '';
    this.path = p + s;
  }

  // finally, reconstruct the href based on what has been validated.
  this.href = this.format();
  return this;
};

// format a parsed object into a url string
function urlFormat(obj) {
  /*
   * ensure it's an object, and not a string url.
   * If it's an obj, this is a no-op.
   * this way, you can call url_format() on strings
   * to clean up potentially wonky urls.
   */
  if (typeof obj === 'string') {
    obj = urlParse(obj);
  }
  if (!(obj instanceof Url)) {
    return Url.prototype.format.call(obj);
  }
  return obj.format();
}
Url.prototype.format = function () {
  var auth = this.auth || '';
  if (auth) {
    auth = encodeURIComponent(auth);
    auth = auth.replace(/%3A/i, ':');
    auth += '@';
  }
  var protocol = this.protocol || '',
    pathname = this.pathname || '',
    hash = this.hash || '',
    host = false,
    query = '';
  if (this.host) {
    host = auth + this.host;
  } else if (this.hostname) {
    host = auth + (this.hostname.indexOf(':') === -1 ? this.hostname : '[' + this.hostname + ']');
    if (this.port) {
      host += ':' + this.port;
    }
  }
  if (this.query && _typeof(this.query) === 'object' && Object.keys(this.query).length) {
    query = querystring.stringify(this.query, {
      arrayFormat: 'repeat',
      addQueryPrefix: false
    });
  }
  var search = this.search || query && '?' + query || '';
  if (protocol && protocol.substr(-1) !== ':') {
    protocol += ':';
  }

  /*
   * only the slashedProtocols get the //.  Not mailto:, xmpp:, etc.
   * unless they had them to begin with.
   */
  if (this.slashes || (!protocol || slashedProtocol[protocol]) && host !== false) {
    host = '//' + (host || '');
    if (pathname && pathname.charAt(0) !== '/') {
      pathname = '/' + pathname;
    }
  } else if (!host) {
    host = '';
  }
  if (hash && hash.charAt(0) !== '#') {
    hash = '#' + hash;
  }
  if (search && search.charAt(0) !== '?') {
    search = '?' + search;
  }
  pathname = pathname.replace(/[?#]/g, function (match) {
    return encodeURIComponent(match);
  });
  search = search.replace('#', '%23');
  return protocol + host + pathname + search + hash;
};
function urlResolve(source, relative) {
  return urlParse(source, false, true).resolve(relative);
}
Url.prototype.resolve = function (relative) {
  return this.resolveObject(urlParse(relative, false, true)).format();
};
function urlResolveObject(source, relative) {
  if (!source) {
    return relative;
  }
  return urlParse(source, false, true).resolveObject(relative);
}
Url.prototype.resolveObject = function (relative) {
  if (typeof relative === 'string') {
    var rel = new Url();
    rel.parse(relative, false, true);
    relative = rel;
  }
  var result = new Url();
  var tkeys = Object.keys(this);
  for (var tk = 0; tk < tkeys.length; tk++) {
    var tkey = tkeys[tk];
    result[tkey] = this[tkey];
  }

  /*
   * hash is always overridden, no matter what.
   * even href="" will remove it.
   */
  result.hash = relative.hash;

  // if the relative url is empty, then there's nothing left to do here.
  if (relative.href === '') {
    result.href = result.format();
    return result;
  }

  // hrefs like //foo/bar always cut to the protocol.
  if (relative.slashes && !relative.protocol) {
    // take everything except the protocol from relative
    var rkeys = Object.keys(relative);
    for (var rk = 0; rk < rkeys.length; rk++) {
      var rkey = rkeys[rk];
      if (rkey !== 'protocol') {
        result[rkey] = relative[rkey];
      }
    }

    // urlParse appends trailing / to urls like http://www.example.com
    if (slashedProtocol[result.protocol] && result.hostname && !result.pathname) {
      result.pathname = '/';
      result.path = result.pathname;
    }
    result.href = result.format();
    return result;
  }
  if (relative.protocol && relative.protocol !== result.protocol) {
    /*
     * if it's a known url protocol, then changing
     * the protocol does weird things
     * first, if it's not file:, then we MUST have a host,
     * and if there was a path
     * to begin with, then we MUST have a path.
     * if it is file:, then the host is dropped,
     * because that's known to be hostless.
     * anything else is assumed to be absolute.
     */
    if (!slashedProtocol[relative.protocol]) {
      var keys = Object.keys(relative);
      for (var v = 0; v < keys.length; v++) {
        var k = keys[v];
        result[k] = relative[k];
      }
      result.href = result.format();
      return result;
    }
    result.protocol = relative.protocol;
    if (!relative.host && !hostlessProtocol[relative.protocol]) {
      var relPath = (relative.pathname || '').split('/');
      while (relPath.length && !(relative.host = relPath.shift())) {}
      if (!relative.host) {
        relative.host = '';
      }
      if (!relative.hostname) {
        relative.hostname = '';
      }
      if (relPath[0] !== '') {
        relPath.unshift('');
      }
      if (relPath.length < 2) {
        relPath.unshift('');
      }
      result.pathname = relPath.join('/');
    } else {
      result.pathname = relative.pathname;
    }
    result.search = relative.search;
    result.query = relative.query;
    result.host = relative.host || '';
    result.auth = relative.auth;
    result.hostname = relative.hostname || relative.host;
    result.port = relative.port;
    // to support http.request
    if (result.pathname || result.search) {
      var p = result.pathname || '';
      var s = result.search || '';
      result.path = p + s;
    }
    result.slashes = result.slashes || relative.slashes;
    result.href = result.format();
    return result;
  }
  var isSourceAbs = result.pathname && result.pathname.charAt(0) === '/',
    isRelAbs = relative.host || relative.pathname && relative.pathname.charAt(0) === '/',
    mustEndAbs = isRelAbs || isSourceAbs || result.host && relative.pathname,
    removeAllDots = mustEndAbs,
    srcPath = result.pathname && result.pathname.split('/') || [],
    relPath = relative.pathname && relative.pathname.split('/') || [],
    psychotic = result.protocol && !slashedProtocol[result.protocol];

  /*
   * if the url is a non-slashed url, then relative
   * links like ../.. should be able
   * to crawl up to the hostname, as well.  This is strange.
   * result.protocol has already been set by now.
   * Later on, put the first path part into the host field.
   */
  if (psychotic) {
    result.hostname = '';
    result.port = null;
    if (result.host) {
      if (srcPath[0] === '') {
        srcPath[0] = result.host;
      } else {
        srcPath.unshift(result.host);
      }
    }
    result.host = '';
    if (relative.protocol) {
      relative.hostname = null;
      relative.port = null;
      if (relative.host) {
        if (relPath[0] === '') {
          relPath[0] = relative.host;
        } else {
          relPath.unshift(relative.host);
        }
      }
      relative.host = null;
    }
    mustEndAbs = mustEndAbs && (relPath[0] === '' || srcPath[0] === '');
  }
  if (isRelAbs) {
    // it's absolute.
    result.host = relative.host || relative.host === '' ? relative.host : result.host;
    result.hostname = relative.hostname || relative.hostname === '' ? relative.hostname : result.hostname;
    result.search = relative.search;
    result.query = relative.query;
    srcPath = relPath;
    // fall through to the dot-handling below.
  } else if (relPath.length) {
    /*
     * it's relative
     * throw away the existing file, and take the new path instead.
     */
    if (!srcPath) {
      srcPath = [];
    }
    srcPath.pop();
    srcPath = srcPath.concat(relPath);
    result.search = relative.search;
    result.query = relative.query;
  } else if (relative.search != null) {
    /*
     * just pull out the search.
     * like href='?foo'.
     * Put this after the other two cases because it simplifies the booleans
     */
    if (psychotic) {
      result.host = srcPath.shift();
      result.hostname = result.host;
      /*
       * occationaly the auth can get stuck only in host
       * this especially happens in cases like
       * url.resolveObject('mailto:local1@domain1', 'local2@domain2')
       */
      var authInHost = result.host && result.host.indexOf('@') > 0 ? result.host.split('@') : false;
      if (authInHost) {
        result.auth = authInHost.shift();
        result.hostname = authInHost.shift();
        result.host = result.hostname;
      }
    }
    result.search = relative.search;
    result.query = relative.query;
    // to support http.request
    if (result.pathname !== null || result.search !== null) {
      result.path = (result.pathname ? result.pathname : '') + (result.search ? result.search : '');
    }
    result.href = result.format();
    return result;
  }
  if (!srcPath.length) {
    /*
     * no path at all.  easy.
     * we've already handled the other stuff above.
     */
    result.pathname = null;
    // to support http.request
    if (result.search) {
      result.path = '/' + result.search;
    } else {
      result.path = null;
    }
    result.href = result.format();
    return result;
  }

  /*
   * if a url ENDs in . or .., then it must get a trailing slash.
   * however, if it ends in anything else non-slashy,
   * then it must NOT get a trailing slash.
   */
  var last = srcPath.slice(-1)[0];
  var hasTrailingSlash = (result.host || relative.host || srcPath.length > 1) && (last === '.' || last === '..') || last === '';

  /*
   * strip single dots, resolve double dots to parent dir
   * if the path tries to go above the root, `up` ends up > 0
   */
  var up = 0;
  for (var i = srcPath.length; i >= 0; i--) {
    last = srcPath[i];
    if (last === '.') {
      srcPath.splice(i, 1);
    } else if (last === '..') {
      srcPath.splice(i, 1);
      up++;
    } else if (up) {
      srcPath.splice(i, 1);
      up--;
    }
  }

  // if the path is allowed to go above the root, restore leading ..s
  if (!mustEndAbs && !removeAllDots) {
    for (; up--; up) {
      srcPath.unshift('..');
    }
  }
  if (mustEndAbs && srcPath[0] !== '' && (!srcPath[0] || srcPath[0].charAt(0) !== '/')) {
    srcPath.unshift('');
  }
  if (hasTrailingSlash && srcPath.join('/').substr(-1) !== '/') {
    srcPath.push('');
  }
  var isAbsolute = srcPath[0] === '' || srcPath[0] && srcPath[0].charAt(0) === '/';

  // put the host back
  if (psychotic) {
    result.hostname = isAbsolute ? '' : srcPath.length ? srcPath.shift() : '';
    result.host = result.hostname;
    /*
     * occationaly the auth can get stuck only in host
     * this especially happens in cases like
     * url.resolveObject('mailto:local1@domain1', 'local2@domain2')
     */
    var authInHost = result.host && result.host.indexOf('@') > 0 ? result.host.split('@') : false;
    if (authInHost) {
      result.auth = authInHost.shift();
      result.hostname = authInHost.shift();
      result.host = result.hostname;
    }
  }
  mustEndAbs = mustEndAbs || result.host && srcPath.length;
  if (mustEndAbs && !isAbsolute) {
    srcPath.unshift('');
  }
  if (srcPath.length > 0) {
    result.pathname = srcPath.join('/');
  } else {
    result.pathname = null;
    result.path = null;
  }

  // to support request.http
  if (result.pathname !== null || result.search !== null) {
    result.path = (result.pathname ? result.pathname : '') + (result.search ? result.search : '');
  }
  result.auth = relative.auth || result.auth;
  result.slashes = result.slashes || relative.slashes;
  result.href = result.format();
  return result;
};
Url.prototype.parseHost = function () {
  var host = this.host;
  var port = portPattern.exec(host);
  if (port) {
    port = port[0];
    if (port !== ':') {
      this.port = port.substr(1);
    }
    host = host.substr(0, host.length - port.length);
  }
  if (host) {
    this.hostname = host;
  }
};
exports.parse = urlParse;
exports.resolve = urlResolve;
exports.resolveObject = urlResolveObject;
exports.format = urlFormat;
exports.Url = Url;

/***/ }),

/***/ 6276:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

/**
 * Module exports.
 */

module.exports = deprecate;

/**
 * Mark that a method should not be used.
 * Returns a modified function which warns once by default.
 *
 * If `localStorage.noDeprecation = true` is set, then it is a no-op.
 *
 * If `localStorage.throwDeprecation = true` is set, then deprecated functions
 * will throw an Error when invoked.
 *
 * If `localStorage.traceDeprecation = true` is set, then deprecated functions
 * will invoke `console.trace()` instead of `console.error()`.
 *
 * @param {Function} fn - the function to deprecate
 * @param {String} msg - the string to print to the console when `fn` is invoked
 * @returns {Function} a new "deprecated" version of `fn`
 * @api public
 */

function deprecate(fn, msg) {
  if (config('noDeprecation')) {
    return fn;
  }
  var warned = false;
  function deprecated() {
    if (!warned) {
      if (config('throwDeprecation')) {
        throw new Error(msg);
      } else if (config('traceDeprecation')) {
        console.trace(msg);
      } else {
        console.warn(msg);
      }
      warned = true;
    }
    return fn.apply(this, arguments);
  }
  return deprecated;
}

/**
 * Checks `localStorage` for boolean values for the given `name`.
 *
 * @param {String} name
 * @returns {Boolean}
 * @api private
 */

function config(name) {
  // accessing global.localStorage can trigger a DOMException in sandboxed iframes
  try {
    if (!__webpack_require__.g.localStorage) return false;
  } catch (_) {
    return false;
  }
  var val = __webpack_require__.g.localStorage[name];
  if (null == val) return false;
  return String(val).toLowerCase() === 'true';
}

/***/ }),

/***/ 2786:
/***/ ((module) => {

module.exports = extend;
var hasOwnProperty = Object.prototype.hasOwnProperty;
function extend() {
  var target = {};
  for (var i = 0; i < arguments.length; i++) {
    var source = arguments[i];
    for (var key in source) {
      if (hasOwnProperty.call(source, key)) {
        target[key] = source[key];
      }
    }
  }
  return target;
}

/***/ }),

/***/ 1902:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return _typeof(key) === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (_typeof(input) !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (_typeof(res) !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
function _get() { if (typeof Reflect !== "undefined" && Reflect.get) { _get = Reflect.get.bind(); } else { _get = function _get(target, property, receiver) { var base = _superPropBase(target, property); if (!base) return; var desc = Object.getOwnPropertyDescriptor(base, property); if (desc.get) { return desc.get.call(arguments.length < 3 ? target : receiver); } return desc.value; }; } return _get.apply(this, arguments); }
function _superPropBase(object, property) { while (!Object.prototype.hasOwnProperty.call(object, property)) { object = _getPrototypeOf(object); if (object === null) break; } return object; }
function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); Object.defineProperty(subClass, "prototype", { writable: false }); if (superClass) _setPrototypeOf(subClass, superClass); }
function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }
function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } else if (call !== void 0) { throw new TypeError("Derived constructors may only return object or undefined"); } return _assertThisInitialized(self); }
function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }
function _wrapNativeSuper(Class) { var _cache = typeof Map === "function" ? new Map() : undefined; _wrapNativeSuper = function _wrapNativeSuper(Class) { if (Class === null || !_isNativeFunction(Class)) return Class; if (typeof Class !== "function") { throw new TypeError("Super expression must either be null or a function"); } if (typeof _cache !== "undefined") { if (_cache.has(Class)) return _cache.get(Class); _cache.set(Class, Wrapper); } function Wrapper() { return _construct(Class, arguments, _getPrototypeOf(this).constructor); } Wrapper.prototype = Object.create(Class.prototype, { constructor: { value: Wrapper, enumerable: false, writable: true, configurable: true } }); return _setPrototypeOf(Wrapper, Class); }; return _wrapNativeSuper(Class); }
function _construct(Parent, args, Class) { if (_isNativeReflectConstruct()) { _construct = Reflect.construct.bind(); } else { _construct = function _construct(Parent, args, Class) { var a = [null]; a.push.apply(a, args); var Constructor = Function.bind.apply(Parent, a); var instance = new Constructor(); if (Class) _setPrototypeOf(instance, Class.prototype); return instance; }; } return _construct.apply(null, arguments); }
function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }
function _isNativeFunction(fn) { try { return Function.toString.call(fn).indexOf("[native code]") !== -1; } catch (e) { return typeof fn === "function"; } }
function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }
function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }
var _require = __webpack_require__(8865),
  setTimeout = _require.setTimeout;

// A cache that expires.
module.exports = /*#__PURE__*/function (_Map) {
  _inherits(Cache, _Map);
  var _super = _createSuper(Cache);
  function Cache() {
    var _this;
    var timeout = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1000;
    _classCallCheck(this, Cache);
    _this = _super.call(this);
    _this.timeout = timeout;
    return _this;
  }
  _createClass(Cache, [{
    key: "set",
    value: function set(key, value) {
      if (this.has(key)) {
        clearTimeout(_get(_getPrototypeOf(Cache.prototype), "get", this).call(this, key).tid);
      }
      _get(_getPrototypeOf(Cache.prototype), "set", this).call(this, key, {
        tid: setTimeout(this["delete"].bind(this, key), this.timeout).unref(),
        value: value
      });
    }
  }, {
    key: "get",
    value: function get(key) {
      var entry = _get(_getPrototypeOf(Cache.prototype), "get", this).call(this, key);
      if (entry) {
        return entry.value;
      }
      return null;
    }
  }, {
    key: "getOrSet",
    value: function getOrSet(key, fn) {
      var _this2 = this;
      if (this.has(key)) {
        return this.get(key);
      } else {
        var value = fn();
        this.set(key, value);
        (async function () {
          try {
            await value;
          } catch (err) {
            _this2["delete"](key);
          }
        })();
        return value;
      }
    }
  }, {
    key: "delete",
    value: function _delete(key) {
      var entry = _get(_getPrototypeOf(Cache.prototype), "get", this).call(this, key);
      if (entry) {
        clearTimeout(entry.tid);
        _get(_getPrototypeOf(Cache.prototype), "delete", this).call(this, key);
      }
    }
  }, {
    key: "clear",
    value: function clear() {
      var _iterator = _createForOfIteratorHelper(this.values()),
        _step;
      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var entry = _step.value;
          clearTimeout(entry.tid);
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }
      _get(_getPrototypeOf(Cache.prototype), "clear", this).call(this);
    }
  }]);
  return Cache;
}( /*#__PURE__*/_wrapNativeSuper(Map));

/***/ }),

/***/ 3642:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
var utils = __webpack_require__(6062);
var FORMATS = __webpack_require__(4485);

// Use these to help sort formats, higher index is better.
var audioEncodingRanks = ['mp4a', 'mp3', 'vorbis', 'aac', 'opus', 'flac'];
var videoEncodingRanks = ['mp4v', 'avc1', 'Sorenson H.283', 'MPEG-4 Visual', 'VP8', 'VP9', 'H.264'];
var getVideoBitrate = function getVideoBitrate(format) {
  return format.bitrate || 0;
};
var getVideoEncodingRank = function getVideoEncodingRank(format) {
  return videoEncodingRanks.findIndex(function (enc) {
    return format.codecs && format.codecs.includes(enc);
  });
};
var getAudioBitrate = function getAudioBitrate(format) {
  return format.audioBitrate || 0;
};
var getAudioEncodingRank = function getAudioEncodingRank(format) {
  return audioEncodingRanks.findIndex(function (enc) {
    return format.codecs && format.codecs.includes(enc);
  });
};

/**
 * Sort formats by a list of functions.
 *
 * @param {Object} a
 * @param {Object} b
 * @param {Array.<Function>} sortBy
 * @returns {number}
 */
var sortFormatsBy = function sortFormatsBy(a, b, sortBy) {
  var res = 0;
  var _iterator = _createForOfIteratorHelper(sortBy),
    _step;
  try {
    for (_iterator.s(); !(_step = _iterator.n()).done;) {
      var fn = _step.value;
      res = fn(b) - fn(a);
      if (res !== 0) {
        break;
      }
    }
  } catch (err) {
    _iterator.e(err);
  } finally {
    _iterator.f();
  }
  return res;
};
var sortFormatsByVideo = function sortFormatsByVideo(a, b) {
  return sortFormatsBy(a, b, [function (format) {
    return parseInt(format.qualityLabel);
  }, getVideoBitrate, getVideoEncodingRank]);
};
var sortFormatsByAudio = function sortFormatsByAudio(a, b) {
  return sortFormatsBy(a, b, [getAudioBitrate, getAudioEncodingRank]);
};

/**
 * Sort formats from highest quality to lowest.
 *
 * @param {Object} a
 * @param {Object} b
 * @returns {number}
 */
exports.sortFormats = function (a, b) {
  return sortFormatsBy(a, b, [
  // Formats with both video and audio are ranked highest.
  function (format) {
    return +!!format.isHLS;
  }, function (format) {
    return +!!format.isDashMPD;
  }, function (format) {
    return +(format.contentLength > 0);
  }, function (format) {
    return +(format.hasVideo && format.hasAudio);
  }, function (format) {
    return +format.hasVideo;
  }, function (format) {
    return parseInt(format.qualityLabel) || 0;
  }, getVideoBitrate, getAudioBitrate, getVideoEncodingRank, getAudioEncodingRank]);
};

/**
 * Choose a format depending on the given options.
 *
 * @param {Array.<Object>} formats
 * @param {Object} options
 * @returns {Object}
 * @throws {Error} when no format matches the filter/format rules
 */
exports.chooseFormat = function (formats, options) {
  if (_typeof(options.format) === 'object') {
    if (!options.format.url) {
      throw Error('Invalid format given, did you use `ytdl.getInfo()`?');
    }
    return options.format;
  }
  if (options.filter) {
    formats = exports.filterFormats(formats, options.filter);
  }

  // We currently only support HLS-Formats for livestreams
  // So we (now) remove all non-HLS streams
  if (formats.some(function (fmt) {
    return fmt.isHLS;
  })) {
    formats = formats.filter(function (fmt) {
      return fmt.isHLS || !fmt.isLive;
    });
  }
  var format;
  var quality = options.quality || 'highest';
  switch (quality) {
    case 'highest':
      format = formats[0];
      break;
    case 'lowest':
      format = formats[formats.length - 1];
      break;
    case 'highestaudio':
      {
        formats = exports.filterFormats(formats, 'audio');
        formats.sort(sortFormatsByAudio);
        // Filter for only the best audio format
        var bestAudioFormat = formats[0];
        formats = formats.filter(function (f) {
          return sortFormatsByAudio(bestAudioFormat, f) === 0;
        });
        // Check for the worst video quality for the best audio quality and pick according
        // This does not loose default sorting of video encoding and bitrate
        var worstVideoQuality = formats.map(function (f) {
          return parseInt(f.qualityLabel) || 0;
        }).sort(function (a, b) {
          return a - b;
        })[0];
        format = formats.find(function (f) {
          return (parseInt(f.qualityLabel) || 0) === worstVideoQuality;
        });
        break;
      }
    case 'lowestaudio':
      formats = exports.filterFormats(formats, 'audio');
      formats.sort(sortFormatsByAudio);
      format = formats[formats.length - 1];
      break;
    case 'highestvideo':
      {
        formats = exports.filterFormats(formats, 'video');
        formats.sort(sortFormatsByVideo);
        // Filter for only the best video format
        var bestVideoFormat = formats[0];
        formats = formats.filter(function (f) {
          return sortFormatsByVideo(bestVideoFormat, f) === 0;
        });
        // Check for the worst audio quality for the best video quality and pick according
        // This does not loose default sorting of audio encoding and bitrate
        var worstAudioQuality = formats.map(function (f) {
          return f.audioBitrate || 0;
        }).sort(function (a, b) {
          return a - b;
        })[0];
        format = formats.find(function (f) {
          return (f.audioBitrate || 0) === worstAudioQuality;
        });
        break;
      }
    case 'lowestvideo':
      formats = exports.filterFormats(formats, 'video');
      formats.sort(sortFormatsByVideo);
      format = formats[formats.length - 1];
      break;
    default:
      format = getFormatByQuality(quality, formats);
      break;
  }
  if (!format) {
    throw Error("No such format found: ".concat(quality));
  }
  return format;
};

/**
 * Gets a format based on quality or array of quality's
 *
 * @param {string|[string]} quality
 * @param {[Object]} formats
 * @returns {Object}
 */
var getFormatByQuality = function getFormatByQuality(quality, formats) {
  var getFormat = function getFormat(itag) {
    return formats.find(function (format) {
      return "".concat(format.itag) === "".concat(itag);
    });
  };
  if (Array.isArray(quality)) {
    return getFormat(quality.find(function (q) {
      return getFormat(q);
    }));
  } else {
    return getFormat(quality);
  }
};

/**
 * @param {Array.<Object>} formats
 * @param {Function} filter
 * @returns {Array.<Object>}
 */
exports.filterFormats = function (formats, filter) {
  var fn;
  switch (filter) {
    case 'videoandaudio':
    case 'audioandvideo':
      fn = function fn(format) {
        return format.hasVideo && format.hasAudio;
      };
      break;
    case 'video':
      fn = function fn(format) {
        return format.hasVideo;
      };
      break;
    case 'videoonly':
      fn = function fn(format) {
        return format.hasVideo && !format.hasAudio;
      };
      break;
    case 'audio':
      fn = function fn(format) {
        return format.hasAudio;
      };
      break;
    case 'audioonly':
      fn = function fn(format) {
        return !format.hasVideo && format.hasAudio;
      };
      break;
    default:
      if (typeof filter === 'function') {
        fn = filter;
      } else {
        throw TypeError("Given filter (".concat(filter, ") is not supported"));
      }
  }
  return formats.filter(function (format) {
    return !!format.url && fn(format);
  });
};

/**
 * @param {Object} format
 * @returns {Object}
 */
exports.addFormatMeta = function (format) {
  format = Object.assign({}, FORMATS[format.itag], format);
  format.hasVideo = !!format.qualityLabel;
  format.hasAudio = !!format.audioBitrate;
  format.container = format.mimeType ? format.mimeType.split(';')[0].split('/')[1] : null;
  format.codecs = format.mimeType ? utils.between(format.mimeType, 'codecs="', '"') : null;
  format.videoCodec = format.hasVideo && format.codecs ? format.codecs.split(', ')[0] : null;
  format.audioCodec = format.hasAudio && format.codecs ? format.codecs.split(', ').slice(-1)[0] : null;
  format.isLive = /\bsource[/=]yt_live_broadcast\b/.test(format.url);
  format.isHLS = /\/manifest\/hls_(variant|playlist)\//.test(format.url);
  format.isDashMPD = /\/manifest\/dash\//.test(format.url);
  return format;
};

/***/ }),

/***/ 4485:
/***/ ((module) => {

/**
 * http://en.wikipedia.org/wiki/YouTube#Quality_and_formats
 */
module.exports = {
  5: {
    mimeType: 'video/flv; codecs="Sorenson H.283, mp3"',
    qualityLabel: '240p',
    bitrate: 250000,
    audioBitrate: 64
  },
  6: {
    mimeType: 'video/flv; codecs="Sorenson H.263, mp3"',
    qualityLabel: '270p',
    bitrate: 800000,
    audioBitrate: 64
  },
  13: {
    mimeType: 'video/3gp; codecs="MPEG-4 Visual, aac"',
    qualityLabel: null,
    bitrate: 500000,
    audioBitrate: null
  },
  17: {
    mimeType: 'video/3gp; codecs="MPEG-4 Visual, aac"',
    qualityLabel: '144p',
    bitrate: 50000,
    audioBitrate: 24
  },
  18: {
    mimeType: 'video/mp4; codecs="H.264, aac"',
    qualityLabel: '360p',
    bitrate: 500000,
    audioBitrate: 96
  },
  22: {
    mimeType: 'video/mp4; codecs="H.264, aac"',
    qualityLabel: '720p',
    bitrate: 2000000,
    audioBitrate: 192
  },
  34: {
    mimeType: 'video/flv; codecs="H.264, aac"',
    qualityLabel: '360p',
    bitrate: 500000,
    audioBitrate: 128
  },
  35: {
    mimeType: 'video/flv; codecs="H.264, aac"',
    qualityLabel: '480p',
    bitrate: 800000,
    audioBitrate: 128
  },
  36: {
    mimeType: 'video/3gp; codecs="MPEG-4 Visual, aac"',
    qualityLabel: '240p',
    bitrate: 175000,
    audioBitrate: 32
  },
  37: {
    mimeType: 'video/mp4; codecs="H.264, aac"',
    qualityLabel: '1080p',
    bitrate: 3000000,
    audioBitrate: 192
  },
  38: {
    mimeType: 'video/mp4; codecs="H.264, aac"',
    qualityLabel: '3072p',
    bitrate: 3500000,
    audioBitrate: 192
  },
  43: {
    mimeType: 'video/webm; codecs="VP8, vorbis"',
    qualityLabel: '360p',
    bitrate: 500000,
    audioBitrate: 128
  },
  44: {
    mimeType: 'video/webm; codecs="VP8, vorbis"',
    qualityLabel: '480p',
    bitrate: 1000000,
    audioBitrate: 128
  },
  45: {
    mimeType: 'video/webm; codecs="VP8, vorbis"',
    qualityLabel: '720p',
    bitrate: 2000000,
    audioBitrate: 192
  },
  46: {
    mimeType: 'audio/webm; codecs="vp8, vorbis"',
    qualityLabel: '1080p',
    bitrate: null,
    audioBitrate: 192
  },
  82: {
    mimeType: 'video/mp4; codecs="H.264, aac"',
    qualityLabel: '360p',
    bitrate: 500000,
    audioBitrate: 96
  },
  83: {
    mimeType: 'video/mp4; codecs="H.264, aac"',
    qualityLabel: '240p',
    bitrate: 500000,
    audioBitrate: 96
  },
  84: {
    mimeType: 'video/mp4; codecs="H.264, aac"',
    qualityLabel: '720p',
    bitrate: 2000000,
    audioBitrate: 192
  },
  85: {
    mimeType: 'video/mp4; codecs="H.264, aac"',
    qualityLabel: '1080p',
    bitrate: 3000000,
    audioBitrate: 192
  },
  91: {
    mimeType: 'video/ts; codecs="H.264, aac"',
    qualityLabel: '144p',
    bitrate: 100000,
    audioBitrate: 48
  },
  92: {
    mimeType: 'video/ts; codecs="H.264, aac"',
    qualityLabel: '240p',
    bitrate: 150000,
    audioBitrate: 48
  },
  93: {
    mimeType: 'video/ts; codecs="H.264, aac"',
    qualityLabel: '360p',
    bitrate: 500000,
    audioBitrate: 128
  },
  94: {
    mimeType: 'video/ts; codecs="H.264, aac"',
    qualityLabel: '480p',
    bitrate: 800000,
    audioBitrate: 128
  },
  95: {
    mimeType: 'video/ts; codecs="H.264, aac"',
    qualityLabel: '720p',
    bitrate: 1500000,
    audioBitrate: 256
  },
  96: {
    mimeType: 'video/ts; codecs="H.264, aac"',
    qualityLabel: '1080p',
    bitrate: 2500000,
    audioBitrate: 256
  },
  100: {
    mimeType: 'audio/webm; codecs="VP8, vorbis"',
    qualityLabel: '360p',
    bitrate: null,
    audioBitrate: 128
  },
  101: {
    mimeType: 'audio/webm; codecs="VP8, vorbis"',
    qualityLabel: '360p',
    bitrate: null,
    audioBitrate: 192
  },
  102: {
    mimeType: 'audio/webm; codecs="VP8, vorbis"',
    qualityLabel: '720p',
    bitrate: null,
    audioBitrate: 192
  },
  120: {
    mimeType: 'video/flv; codecs="H.264, aac"',
    qualityLabel: '720p',
    bitrate: 2000000,
    audioBitrate: 128
  },
  127: {
    mimeType: 'audio/ts; codecs="aac"',
    qualityLabel: null,
    bitrate: null,
    audioBitrate: 96
  },
  128: {
    mimeType: 'audio/ts; codecs="aac"',
    qualityLabel: null,
    bitrate: null,
    audioBitrate: 96
  },
  132: {
    mimeType: 'video/ts; codecs="H.264, aac"',
    qualityLabel: '240p',
    bitrate: 150000,
    audioBitrate: 48
  },
  133: {
    mimeType: 'video/mp4; codecs="H.264"',
    qualityLabel: '240p',
    bitrate: 200000,
    audioBitrate: null
  },
  134: {
    mimeType: 'video/mp4; codecs="H.264"',
    qualityLabel: '360p',
    bitrate: 300000,
    audioBitrate: null
  },
  135: {
    mimeType: 'video/mp4; codecs="H.264"',
    qualityLabel: '480p',
    bitrate: 500000,
    audioBitrate: null
  },
  136: {
    mimeType: 'video/mp4; codecs="H.264"',
    qualityLabel: '720p',
    bitrate: 1000000,
    audioBitrate: null
  },
  137: {
    mimeType: 'video/mp4; codecs="H.264"',
    qualityLabel: '1080p',
    bitrate: 2500000,
    audioBitrate: null
  },
  138: {
    mimeType: 'video/mp4; codecs="H.264"',
    qualityLabel: '4320p',
    bitrate: 13500000,
    audioBitrate: null
  },
  139: {
    mimeType: 'audio/mp4; codecs="aac"',
    qualityLabel: null,
    bitrate: null,
    audioBitrate: 48
  },
  140: {
    mimeType: 'audio/m4a; codecs="aac"',
    qualityLabel: null,
    bitrate: null,
    audioBitrate: 128
  },
  141: {
    mimeType: 'audio/mp4; codecs="aac"',
    qualityLabel: null,
    bitrate: null,
    audioBitrate: 256
  },
  151: {
    mimeType: 'video/ts; codecs="H.264, aac"',
    qualityLabel: '720p',
    bitrate: 50000,
    audioBitrate: 24
  },
  160: {
    mimeType: 'video/mp4; codecs="H.264"',
    qualityLabel: '144p',
    bitrate: 100000,
    audioBitrate: null
  },
  171: {
    mimeType: 'audio/webm; codecs="vorbis"',
    qualityLabel: null,
    bitrate: null,
    audioBitrate: 128
  },
  172: {
    mimeType: 'audio/webm; codecs="vorbis"',
    qualityLabel: null,
    bitrate: null,
    audioBitrate: 192
  },
  242: {
    mimeType: 'video/webm; codecs="VP9"',
    qualityLabel: '240p',
    bitrate: 100000,
    audioBitrate: null
  },
  243: {
    mimeType: 'video/webm; codecs="VP9"',
    qualityLabel: '360p',
    bitrate: 250000,
    audioBitrate: null
  },
  244: {
    mimeType: 'video/webm; codecs="VP9"',
    qualityLabel: '480p',
    bitrate: 500000,
    audioBitrate: null
  },
  247: {
    mimeType: 'video/webm; codecs="VP9"',
    qualityLabel: '720p',
    bitrate: 700000,
    audioBitrate: null
  },
  248: {
    mimeType: 'video/webm; codecs="VP9"',
    qualityLabel: '1080p',
    bitrate: 1500000,
    audioBitrate: null
  },
  249: {
    mimeType: 'audio/webm; codecs="opus"',
    qualityLabel: null,
    bitrate: null,
    audioBitrate: 48
  },
  250: {
    mimeType: 'audio/webm; codecs="opus"',
    qualityLabel: null,
    bitrate: null,
    audioBitrate: 64
  },
  251: {
    mimeType: 'audio/webm; codecs="opus"',
    qualityLabel: null,
    bitrate: null,
    audioBitrate: 160
  },
  264: {
    mimeType: 'video/mp4; codecs="H.264"',
    qualityLabel: '1440p',
    bitrate: 4000000,
    audioBitrate: null
  },
  266: {
    mimeType: 'video/mp4; codecs="H.264"',
    qualityLabel: '2160p',
    bitrate: 12500000,
    audioBitrate: null
  },
  271: {
    mimeType: 'video/webm; codecs="VP9"',
    qualityLabel: '1440p',
    bitrate: 9000000,
    audioBitrate: null
  },
  272: {
    mimeType: 'video/webm; codecs="VP9"',
    qualityLabel: '4320p',
    bitrate: 20000000,
    audioBitrate: null
  },
  278: {
    mimeType: 'video/webm; codecs="VP9"',
    qualityLabel: '144p 30fps',
    bitrate: 80000,
    audioBitrate: null
  },
  298: {
    mimeType: 'video/mp4; codecs="H.264"',
    qualityLabel: '720p',
    bitrate: 3000000,
    audioBitrate: null
  },
  299: {
    mimeType: 'video/mp4; codecs="H.264"',
    qualityLabel: '1080p',
    bitrate: 5500000,
    audioBitrate: null
  },
  300: {
    mimeType: 'video/ts; codecs="H.264, aac"',
    qualityLabel: '720p',
    bitrate: 1318000,
    audioBitrate: 48
  },
  302: {
    mimeType: 'video/webm; codecs="VP9"',
    qualityLabel: '720p HFR',
    bitrate: 2500000,
    audioBitrate: null
  },
  303: {
    mimeType: 'video/webm; codecs="VP9"',
    qualityLabel: '1080p HFR',
    bitrate: 5000000,
    audioBitrate: null
  },
  308: {
    mimeType: 'video/webm; codecs="VP9"',
    qualityLabel: '1440p HFR',
    bitrate: 10000000,
    audioBitrate: null
  },
  313: {
    mimeType: 'video/webm; codecs="VP9"',
    qualityLabel: '2160p',
    bitrate: 13000000,
    audioBitrate: null
  },
  315: {
    mimeType: 'video/webm; codecs="VP9"',
    qualityLabel: '2160p HFR',
    bitrate: 20000000,
    audioBitrate: null
  },
  330: {
    mimeType: 'video/webm; codecs="VP9"',
    qualityLabel: '144p HDR, HFR',
    bitrate: 80000,
    audioBitrate: null
  },
  331: {
    mimeType: 'video/webm; codecs="VP9"',
    qualityLabel: '240p HDR, HFR',
    bitrate: 100000,
    audioBitrate: null
  },
  332: {
    mimeType: 'video/webm; codecs="VP9"',
    qualityLabel: '360p HDR, HFR',
    bitrate: 250000,
    audioBitrate: null
  },
  333: {
    mimeType: 'video/webm; codecs="VP9"',
    qualityLabel: '240p HDR, HFR',
    bitrate: 500000,
    audioBitrate: null
  },
  334: {
    mimeType: 'video/webm; codecs="VP9"',
    qualityLabel: '720p HDR, HFR',
    bitrate: 1000000,
    audioBitrate: null
  },
  335: {
    mimeType: 'video/webm; codecs="VP9"',
    qualityLabel: '1080p HDR, HFR',
    bitrate: 1500000,
    audioBitrate: null
  },
  336: {
    mimeType: 'video/webm; codecs="VP9"',
    qualityLabel: '1440p HDR, HFR',
    bitrate: 5000000,
    audioBitrate: null
  },
  337: {
    mimeType: 'video/webm; codecs="VP9"',
    qualityLabel: '2160p HDR, HFR',
    bitrate: 12000000,
    audioBitrate: null
  }
};

/***/ }),

/***/ 9115:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var PassThrough = (__webpack_require__(9788).PassThrough);
var getInfo = __webpack_require__(6065);
var utils = __webpack_require__(6062);
var formatUtils = __webpack_require__(3642);
var urlUtils = __webpack_require__(3919);
var sig = __webpack_require__(1717);
var miniget = __webpack_require__(6206);
var m3u8stream = __webpack_require__(1808);
var _require = __webpack_require__(1808),
  parseTimestamp = _require.parseTimestamp;

/**
 * @param {string} link
 * @param {!Object} options
 * @returns {ReadableStream}
 */
var ytdl = function ytdl(link, options) {
  var stream = createStream(options);
  ytdl.getInfo(link, options).then(function (info) {
    downloadFromInfoCallback(stream, info, options);
  }, stream.emit.bind(stream, 'error'));
  return stream;
};
module.exports = ytdl;
ytdl.getBasicInfo = getInfo.getBasicInfo;
ytdl.getInfo = getInfo.getInfo;
ytdl.chooseFormat = formatUtils.chooseFormat;
ytdl.filterFormats = formatUtils.filterFormats;
ytdl.validateID = urlUtils.validateID;
ytdl.validateURL = urlUtils.validateURL;
ytdl.getURLVideoID = urlUtils.getURLVideoID;
ytdl.getVideoID = urlUtils.getVideoID;
ytdl.cache = {
  sig: sig.cache,
  info: getInfo.cache,
  watch: getInfo.watchPageCache,
  cookie: getInfo.cookieCache
};
ytdl.version = (__webpack_require__(2206).version);
var createStream = function createStream(options) {
  var stream = new PassThrough({
    highWaterMark: options && options.highWaterMark || 1024 * 512
  });
  stream._destroy = function () {
    stream.destroyed = true;
  };
  return stream;
};
var pipeAndSetEvents = function pipeAndSetEvents(req, stream, end) {
  // Forward events from the request to the stream.
  ['abort', 'request', 'response', 'error', 'redirect', 'retry', 'reconnect'].forEach(function (event) {
    req.prependListener(event, stream.emit.bind(stream, event));
  });
  req.pipe(stream, {
    end: end
  });
};

/**
 * Chooses a format to download.
 *
 * @param {stream.Readable} stream
 * @param {Object} info
 * @param {Object} options
 */
var downloadFromInfoCallback = function downloadFromInfoCallback(stream, info, options) {
  options = options || {};
  var err = utils.playError(info.player_response, ['UNPLAYABLE', 'LIVE_STREAM_OFFLINE', 'LOGIN_REQUIRED']);
  if (err) {
    stream.emit('error', err);
    return;
  }
  if (!info.formats.length) {
    stream.emit('error', Error('This video is unavailable'));
    return;
  }
  var format;
  try {
    format = formatUtils.chooseFormat(info.formats, options);
  } catch (e) {
    stream.emit('error', e);
    return;
  }
  stream.emit('info', info, format);
  if (stream.destroyed) {
    return;
  }
  var contentLength,
    downloaded = 0;
  var ondata = function ondata(chunk) {
    downloaded += chunk.length;
    stream.emit('progress', chunk.length, downloaded, contentLength);
  };
  if (options.IPv6Block) {
    options.requestOptions = Object.assign({}, options.requestOptions, {
      family: 6,
      localAddress: utils.getRandomIPv6(options.IPv6Block)
    });
  }

  // Download the file in chunks, in this case the default is 10MB,
  // anything over this will cause youtube to throttle the download
  var dlChunkSize = options.dlChunkSize || 1024 * 1024 * 10;
  var req;
  var shouldEnd = true;
  if (format.isHLS || format.isDashMPD) {
    req = m3u8stream(format.url, {
      chunkReadahead: +info.live_chunk_readahead,
      begin: options.begin || format.isLive && Date.now(),
      liveBuffer: options.liveBuffer,
      requestOptions: options.requestOptions,
      parser: format.isDashMPD ? 'dash-mpd' : 'm3u8',
      id: format.itag
    });
    req.on('progress', function (segment, totalSegments) {
      stream.emit('progress', segment.size, segment.num, totalSegments);
    });
    pipeAndSetEvents(req, stream, shouldEnd);
  } else {
    var requestOptions = Object.assign({}, options.requestOptions, {
      maxReconnects: 6,
      maxRetries: 3,
      backoff: {
        inc: 500,
        max: 10000
      }
    });
    var shouldBeChunked = dlChunkSize !== 0 && (!format.hasAudio || !format.hasVideo);
    if (shouldBeChunked) {
      var start = options.range && options.range.start || 0;
      var end = start + dlChunkSize;
      var rangeEnd = options.range && options.range.end;
      contentLength = options.range ? (rangeEnd ? rangeEnd + 1 : parseInt(format.contentLength)) - start : parseInt(format.contentLength);
      var getNextChunk = function getNextChunk() {
        if (!rangeEnd && end >= contentLength) end = 0;
        if (rangeEnd && end > rangeEnd) end = rangeEnd;
        shouldEnd = !end || end === rangeEnd;
        requestOptions.headers = Object.assign({}, requestOptions.headers, {
          Range: "bytes=".concat(start, "-").concat(end || '')
        });
        req = miniget(format.url, requestOptions);
        req.on('data', ondata);
        req.on('end', function () {
          if (stream.destroyed) {
            return;
          }
          if (end && end !== rangeEnd) {
            start = end + 1;
            end += dlChunkSize;
            getNextChunk();
          }
        });
        pipeAndSetEvents(req, stream, shouldEnd);
      };
      getNextChunk();
    } else {
      // Audio only and video only formats don't support begin
      if (options.begin) {
        format.url += "&begin=".concat(parseTimestamp(options.begin));
      }
      if (options.range && (options.range.start || options.range.end)) {
        requestOptions.headers = Object.assign({}, requestOptions.headers, {
          Range: "bytes=".concat(options.range.start || '0', "-").concat(options.range.end || '')
        });
      }
      req = miniget(format.url, requestOptions);
      req.on('response', function (res) {
        if (stream.destroyed) {
          return;
        }
        contentLength = contentLength || parseInt(res.headers['content-length']);
      });
      req.on('data', ondata);
      pipeAndSetEvents(req, stream, shouldEnd);
    }
  }
  stream._destroy = function () {
    stream.destroyed = true;
    req.destroy();
    req.end();
  };
};

/**
 * Can be used to download video after its `info` is gotten through
 * `ytdl.getInfo()`. In case the user might want to look at the
 * `info` object before deciding to download.
 *
 * @param {Object} info
 * @param {!Object} options
 * @returns {ReadableStream}
 */
ytdl.downloadFromInfo = function (info, options) {
  var stream = createStream(options);
  if (!info.full) {
    throw Error('Cannot use `ytdl.downloadFromInfo()` when called ' + 'with info from `ytdl.getBasicInfo()`');
  }
  setImmediate(function () {
    downloadFromInfoCallback(stream, info, options);
  });
  return stream;
};

/***/ }),

/***/ 4138:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return _typeof(key) === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (_typeof(input) !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (_typeof(res) !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
var utils = __webpack_require__(6062);
var qs = __webpack_require__(9774);
var _require = __webpack_require__(1808),
  parseTimestamp = _require.parseTimestamp;
var BASE_URL = 'https://www.youtube.com/watch?v=';
var TITLE_TO_CATEGORY = {
  song: {
    name: 'Music',
    url: 'https://music.youtube.com/'
  }
};
var getText = function getText(obj) {
  return obj ? obj.runs ? obj.runs[0].text : obj.simpleText : null;
};

/**
 * Get video media.
 *
 * @param {Object} info
 * @returns {Object}
 */
exports.getMedia = function (info) {
  var media = {};
  var results = [];
  try {
    results = info.response.contents.twoColumnWatchNextResults.results.results.contents;
  } catch (err) {
    // Do nothing
  }
  var result = results.find(function (v) {
    return v.videoSecondaryInfoRenderer;
  });
  if (!result) {
    return {};
  }
  try {
    var metadataRows = (result.metadataRowContainer || result.videoSecondaryInfoRenderer.metadataRowContainer).metadataRowContainerRenderer.rows;
    var _iterator = _createForOfIteratorHelper(metadataRows),
      _step;
    try {
      for (_iterator.s(); !(_step = _iterator.n()).done;) {
        var row = _step.value;
        if (row.metadataRowRenderer) {
          var title = getText(row.metadataRowRenderer.title).toLowerCase();
          var contents = row.metadataRowRenderer.contents[0];
          media[title] = getText(contents);
          var runs = contents.runs;
          if (runs && runs[0].navigationEndpoint) {
            media["".concat(title, "_url")] = new URL(runs[0].navigationEndpoint.commandMetadata.webCommandMetadata.url, BASE_URL).toString();
          }
          if (title in TITLE_TO_CATEGORY) {
            media.category = TITLE_TO_CATEGORY[title].name;
            media.category_url = TITLE_TO_CATEGORY[title].url;
          }
        } else if (row.richMetadataRowRenderer) {
          var _contents = row.richMetadataRowRenderer.contents;
          var boxArt = _contents.filter(function (meta) {
            return meta.richMetadataRenderer.style === 'RICH_METADATA_RENDERER_STYLE_BOX_ART';
          });
          var _iterator2 = _createForOfIteratorHelper(boxArt),
            _step2;
          try {
            for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
              var richMetadataRenderer = _step2.value.richMetadataRenderer;
              var meta = richMetadataRenderer;
              media.year = getText(meta.subtitle);
              var type = getText(meta.callToAction).split(' ')[1];
              media[type] = getText(meta.title);
              media["".concat(type, "_url")] = new URL(meta.endpoint.commandMetadata.webCommandMetadata.url, BASE_URL).toString();
              media.thumbnails = meta.thumbnail.thumbnails;
            }
          } catch (err) {
            _iterator2.e(err);
          } finally {
            _iterator2.f();
          }
          var topic = _contents.filter(function (meta) {
            return meta.richMetadataRenderer.style === 'RICH_METADATA_RENDERER_STYLE_TOPIC';
          });
          var _iterator3 = _createForOfIteratorHelper(topic),
            _step3;
          try {
            for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
              var _richMetadataRenderer = _step3.value.richMetadataRenderer;
              var _meta = _richMetadataRenderer;
              media.category = getText(_meta.title);
              media.category_url = new URL(_meta.endpoint.commandMetadata.webCommandMetadata.url, BASE_URL).toString();
            }
          } catch (err) {
            _iterator3.e(err);
          } finally {
            _iterator3.f();
          }
        }
      }
    } catch (err) {
      _iterator.e(err);
    } finally {
      _iterator.f();
    }
  } catch (err) {
    // Do nothing.
  }
  return media;
};
var isVerified = function isVerified(badges) {
  return !!(badges && badges.find(function (b) {
    return b.metadataBadgeRenderer.tooltip === 'Verified';
  }));
};

/**
 * Get video author.
 *
 * @param {Object} info
 * @returns {Object}
 */
exports.getAuthor = function (info) {
  var channelId,
    thumbnails = [],
    subscriberCount,
    verified = false;
  try {
    var results = info.response.contents.twoColumnWatchNextResults.results.results.contents;
    var v = results.find(function (v2) {
      return v2.videoSecondaryInfoRenderer && v2.videoSecondaryInfoRenderer.owner && v2.videoSecondaryInfoRenderer.owner.videoOwnerRenderer;
    });
    var videoOwnerRenderer = v.videoSecondaryInfoRenderer.owner.videoOwnerRenderer;
    channelId = videoOwnerRenderer.navigationEndpoint.browseEndpoint.browseId;
    thumbnails = videoOwnerRenderer.thumbnail.thumbnails.map(function (thumbnail) {
      thumbnail.url = new URL(thumbnail.url, BASE_URL).toString();
      return thumbnail;
    });
    subscriberCount = utils.parseAbbreviatedNumber(getText(videoOwnerRenderer.subscriberCountText));
    verified = isVerified(videoOwnerRenderer.badges);
  } catch (err) {
    // Do nothing.
  }
  try {
    var videoDetails = info.player_response.microformat && info.player_response.microformat.playerMicroformatRenderer;
    var id = videoDetails && videoDetails.channelId || channelId || info.player_response.videoDetails.channelId;
    var author = {
      id: id,
      name: videoDetails ? videoDetails.ownerChannelName : info.player_response.videoDetails.author,
      user: videoDetails ? videoDetails.ownerProfileUrl.split('/').slice(-1)[0] : null,
      channel_url: "https://www.youtube.com/channel/".concat(id),
      external_channel_url: videoDetails ? "https://www.youtube.com/channel/".concat(videoDetails.externalChannelId) : '',
      user_url: videoDetails ? new URL(videoDetails.ownerProfileUrl, BASE_URL).toString() : '',
      thumbnails: thumbnails,
      verified: verified,
      subscriber_count: subscriberCount
    };
    if (thumbnails.length) {
      utils.deprecate(author, 'avatar', author.thumbnails[0].url, 'author.avatar', 'author.thumbnails[0].url');
    }
    return author;
  } catch (err) {
    return {};
  }
};
var parseRelatedVideo = function parseRelatedVideo(details, rvsParams) {
  if (!details) return;
  try {
    var viewCount = getText(details.viewCountText);
    var shortViewCount = getText(details.shortViewCountText);
    var rvsDetails = rvsParams.find(function (elem) {
      return elem.id === details.videoId;
    });
    if (!/^\d/.test(shortViewCount)) {
      shortViewCount = rvsDetails && rvsDetails.short_view_count_text || '';
    }
    viewCount = (/^\d/.test(viewCount) ? viewCount : shortViewCount).split(' ')[0];
    var browseEndpoint = details.shortBylineText.runs[0].navigationEndpoint.browseEndpoint;
    var channelId = browseEndpoint.browseId;
    var name = getText(details.shortBylineText);
    var user = (browseEndpoint.canonicalBaseUrl || '').split('/').slice(-1)[0];
    var video = {
      id: details.videoId,
      title: getText(details.title),
      published: getText(details.publishedTimeText),
      author: _defineProperty({
        id: channelId,
        name: name,
        user: user,
        channel_url: "https://www.youtube.com/channel/".concat(channelId),
        user_url: "https://www.youtube.com/user/".concat(user),
        thumbnails: details.channelThumbnail.thumbnails.map(function (thumbnail) {
          thumbnail.url = new URL(thumbnail.url, BASE_URL).toString();
          return thumbnail;
        }),
        verified: isVerified(details.ownerBadges)
      }, Symbol.toPrimitive, function () {
        console.warn("`relatedVideo.author` will be removed in a near future release, " + "use `relatedVideo.author.name` instead.");
        return video.author.name;
      }),
      short_view_count_text: shortViewCount.split(' ')[0],
      view_count: viewCount.replace(/,/g, ''),
      length_seconds: details.lengthText ? Math.floor(parseTimestamp(getText(details.lengthText)) / 1000) : rvsParams && "".concat(rvsParams.length_seconds),
      thumbnails: details.thumbnail.thumbnails,
      richThumbnails: details.richThumbnail ? details.richThumbnail.movingThumbnailRenderer.movingThumbnailDetails.thumbnails : [],
      isLive: !!(details.badges && details.badges.find(function (b) {
        return b.metadataBadgeRenderer.label === 'LIVE NOW';
      }))
    };
    utils.deprecate(video, 'author_thumbnail', video.author.thumbnails[0].url, 'relatedVideo.author_thumbnail', 'relatedVideo.author.thumbnails[0].url');
    utils.deprecate(video, 'ucid', video.author.id, 'relatedVideo.ucid', 'relatedVideo.author.id');
    utils.deprecate(video, 'video_thumbnail', video.thumbnails[0].url, 'relatedVideo.video_thumbnail', 'relatedVideo.thumbnails[0].url');
    return video;
  } catch (err) {
    // Skip.
  }
};

/**
 * Get related videos.
 *
 * @param {Object} info
 * @returns {Array.<Object>}
 */
exports.getRelatedVideos = function (info) {
  var rvsParams = [],
    secondaryResults = [];
  try {
    rvsParams = info.response.webWatchNextResponseExtensionData.relatedVideoArgs.split(',').map(function (e) {
      return qs.parse(e);
    });
  } catch (err) {
    // Do nothing.
  }
  try {
    secondaryResults = info.response.contents.twoColumnWatchNextResults.secondaryResults.secondaryResults.results;
  } catch (err) {
    return [];
  }
  var videos = [];
  var _iterator4 = _createForOfIteratorHelper(secondaryResults || []),
    _step4;
  try {
    for (_iterator4.s(); !(_step4 = _iterator4.n()).done;) {
      var result = _step4.value;
      var details = result.compactVideoRenderer;
      if (details) {
        var video = parseRelatedVideo(details, rvsParams);
        if (video) videos.push(video);
      } else {
        var autoplay = result.compactAutoplayRenderer || result.itemSectionRenderer;
        if (!autoplay || !Array.isArray(autoplay.contents)) continue;
        var _iterator5 = _createForOfIteratorHelper(autoplay.contents),
          _step5;
        try {
          for (_iterator5.s(); !(_step5 = _iterator5.n()).done;) {
            var content = _step5.value;
            var _video = parseRelatedVideo(content.compactVideoRenderer, rvsParams);
            if (_video) videos.push(_video);
          }
        } catch (err) {
          _iterator5.e(err);
        } finally {
          _iterator5.f();
        }
      }
    }
  } catch (err) {
    _iterator4.e(err);
  } finally {
    _iterator4.f();
  }
  return videos;
};

/**
 * Get like count.
 *
 * @param {Object} info
 * @returns {number}
 */
exports.getLikes = function (info) {
  try {
    var contents = info.response.contents.twoColumnWatchNextResults.results.results.contents;
    var video = contents.find(function (r) {
      return r.videoPrimaryInfoRenderer;
    });
    var buttons = video.videoPrimaryInfoRenderer.videoActions.menuRenderer.topLevelButtons;
    var like = buttons.find(function (b) {
      return b.toggleButtonRenderer && b.toggleButtonRenderer.defaultIcon.iconType === 'LIKE';
    });
    return parseInt(like.toggleButtonRenderer.defaultText.accessibility.accessibilityData.label.replace(/\D+/g, ''));
  } catch (err) {
    return null;
  }
};

/**
 * Get dislike count.
 *
 * @param {Object} info
 * @returns {number}
 */
exports.getDislikes = function (info) {
  try {
    var contents = info.response.contents.twoColumnWatchNextResults.results.results.contents;
    var video = contents.find(function (r) {
      return r.videoPrimaryInfoRenderer;
    });
    var buttons = video.videoPrimaryInfoRenderer.videoActions.menuRenderer.topLevelButtons;
    var dislike = buttons.find(function (b) {
      return b.toggleButtonRenderer && b.toggleButtonRenderer.defaultIcon.iconType === 'DISLIKE';
    });
    return parseInt(dislike.toggleButtonRenderer.defaultText.accessibility.accessibilityData.label.replace(/\D+/g, ''));
  } catch (err) {
    return null;
  }
};

/**
 * Cleans up a few fields on `videoDetails`.
 *
 * @param {Object} videoDetails
 * @param {Object} info
 * @returns {Object}
 */
exports.cleanVideoDetails = function (videoDetails, info) {
  videoDetails.thumbnails = videoDetails.thumbnail.thumbnails;
  delete videoDetails.thumbnail;
  utils.deprecate(videoDetails, 'thumbnail', {
    thumbnails: videoDetails.thumbnails
  }, 'videoDetails.thumbnail.thumbnails', 'videoDetails.thumbnails');
  videoDetails.description = videoDetails.shortDescription || getText(videoDetails.description);
  delete videoDetails.shortDescription;
  utils.deprecate(videoDetails, 'shortDescription', videoDetails.description, 'videoDetails.shortDescription', 'videoDetails.description');

  // Use more reliable `lengthSeconds` from `playerMicroformatRenderer`.
  videoDetails.lengthSeconds = info.player_response.microformat && info.player_response.microformat.playerMicroformatRenderer.lengthSeconds || info.player_response.videoDetails.lengthSeconds;
  return videoDetails;
};

/**
 * Get storyboards info.
 *
 * @param {Object} info
 * @returns {Array.<Object>}
 */
exports.getStoryboards = function (info) {
  var parts = info.player_response.storyboards && info.player_response.storyboards.playerStoryboardSpecRenderer && info.player_response.storyboards.playerStoryboardSpecRenderer.spec && info.player_response.storyboards.playerStoryboardSpecRenderer.spec.split('|');
  if (!parts) return [];
  var url = new URL(parts.shift());
  return parts.map(function (part, i) {
    var _part$split = part.split('#'),
      _part$split2 = _slicedToArray(_part$split, 8),
      thumbnailWidth = _part$split2[0],
      thumbnailHeight = _part$split2[1],
      thumbnailCount = _part$split2[2],
      columns = _part$split2[3],
      rows = _part$split2[4],
      interval = _part$split2[5],
      nameReplacement = _part$split2[6],
      sigh = _part$split2[7];
    url.searchParams.set('sigh', sigh);
    thumbnailCount = parseInt(thumbnailCount, 10);
    columns = parseInt(columns, 10);
    rows = parseInt(rows, 10);
    var storyboardCount = Math.ceil(thumbnailCount / (columns * rows));
    return {
      templateUrl: url.toString().replace('$L', i).replace('$N', nameReplacement),
      thumbnailWidth: parseInt(thumbnailWidth, 10),
      thumbnailHeight: parseInt(thumbnailHeight, 10),
      thumbnailCount: thumbnailCount,
      interval: parseInt(interval, 10),
      columns: columns,
      rows: rows,
      storyboardCount: storyboardCount
    };
  });
};

/**
 * Get chapters info.
 *
 * @param {Object} info
 * @returns {Array.<Object>}
 */
exports.getChapters = function (info) {
  var playerOverlayRenderer = info.response && info.response.playerOverlays && info.response.playerOverlays.playerOverlayRenderer;
  var playerBar = playerOverlayRenderer && playerOverlayRenderer.decoratedPlayerBarRenderer && playerOverlayRenderer.decoratedPlayerBarRenderer.decoratedPlayerBarRenderer && playerOverlayRenderer.decoratedPlayerBarRenderer.decoratedPlayerBarRenderer.playerBar;
  var markersMap = playerBar && playerBar.multiMarkersPlayerBarRenderer && playerBar.multiMarkersPlayerBarRenderer.markersMap;
  var marker = Array.isArray(markersMap) && markersMap.find(function (m) {
    return m.value && Array.isArray(m.value.chapters);
  });
  if (!marker) return [];
  var chapters = marker.value.chapters;
  return chapters.map(function (chapter) {
    return {
      title: getText(chapter.chapterRenderer.title),
      start_time: chapter.chapterRenderer.timeRangeStartMillis / 1000
    };
  });
};

/***/ }),

/***/ 6065:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }
function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }
function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }
function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return _typeof(key) === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (_typeof(input) !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (_typeof(res) !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); Object.defineProperty(subClass, "prototype", { writable: false }); if (superClass) _setPrototypeOf(subClass, superClass); }
function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }
function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } else if (call !== void 0) { throw new TypeError("Derived constructors may only return object or undefined"); } return _assertThisInitialized(self); }
function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }
function _wrapNativeSuper(Class) { var _cache = typeof Map === "function" ? new Map() : undefined; _wrapNativeSuper = function _wrapNativeSuper(Class) { if (Class === null || !_isNativeFunction(Class)) return Class; if (typeof Class !== "function") { throw new TypeError("Super expression must either be null or a function"); } if (typeof _cache !== "undefined") { if (_cache.has(Class)) return _cache.get(Class); _cache.set(Class, Wrapper); } function Wrapper() { return _construct(Class, arguments, _getPrototypeOf(this).constructor); } Wrapper.prototype = Object.create(Class.prototype, { constructor: { value: Wrapper, enumerable: false, writable: true, configurable: true } }); return _setPrototypeOf(Wrapper, Class); }; return _wrapNativeSuper(Class); }
function _construct(Parent, args, Class) { if (_isNativeReflectConstruct()) { _construct = Reflect.construct.bind(); } else { _construct = function _construct(Parent, args, Class) { var a = [null]; a.push.apply(a, args); var Constructor = Function.bind.apply(Parent, a); var instance = new Constructor(); if (Class) _setPrototypeOf(instance, Class.prototype); return instance; }; } return _construct.apply(null, arguments); }
function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }
function _isNativeFunction(fn) { try { return Function.toString.call(fn).indexOf("[native code]") !== -1; } catch (e) { return typeof fn === "function"; } }
function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }
function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }
var querystring = __webpack_require__(9774);
var sax = __webpack_require__(3555);
var miniget = __webpack_require__(6206);
var utils = __webpack_require__(6062);
// Forces Node JS version of setTimeout for Electron based applications
var _require = __webpack_require__(8865),
  setTimeout = _require.setTimeout;
var formatUtils = __webpack_require__(3642);
var urlUtils = __webpack_require__(3919);
var extras = __webpack_require__(4138);
var sig = __webpack_require__(1717);
var Cache = __webpack_require__(1902);
var BASE_URL = 'https://www.youtube.com/watch?v=';

// Cached for storing basic/full info.
exports.cache = new Cache();
exports.cookieCache = new Cache(1000 * 60 * 60 * 24);
exports.watchPageCache = new Cache();
// Cache for cver used in getVideoInfoPage
var cver = '2.20210622.10.00';

// Special error class used to determine if an error is unrecoverable,
// as in, ytdl-core should not try again to fetch the video metadata.
// In this case, the video is usually unavailable in some way.
var UnrecoverableError = /*#__PURE__*/function (_Error) {
  _inherits(UnrecoverableError, _Error);
  var _super = _createSuper(UnrecoverableError);
  function UnrecoverableError() {
    _classCallCheck(this, UnrecoverableError);
    return _super.apply(this, arguments);
  }
  return _createClass(UnrecoverableError);
}( /*#__PURE__*/_wrapNativeSuper(Error)); // List of URLs that show up in `notice_url` for age restricted videos.
var AGE_RESTRICTED_URLS = ['support.google.com/youtube/?p=age_restrictions', 'youtube.com/t/community_guidelines'];

/**
 * Gets info from a video without getting additional formats.
 *
 * @param {string} id
 * @param {Object} options
 * @returns {Promise<Object>}
*/
exports.getBasicInfo = async function (id, options) {
  if (options.IPv6Block) {
    options.requestOptions = Object.assign({}, options.requestOptions, {
      family: 6,
      localAddress: utils.getRandomIPv6(options.IPv6Block)
    });
  }
  var retryOptions = Object.assign({}, miniget.defaultOptions, options.requestOptions);
  options.requestOptions = Object.assign({}, options.requestOptions, {});
  options.requestOptions.headers = Object.assign({}, {
    // eslint-disable-next-line max-len
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.101 Safari/537.36'
  }, options.requestOptions.headers);
  var validate = function validate(info) {
    var playErr = utils.playError(info.player_response, ['ERROR'], UnrecoverableError);
    var privateErr = privateVideoError(info.player_response);
    if (playErr || privateErr) {
      throw playErr || privateErr;
    }
    return info && info.player_response && (info.player_response.streamingData || isRental(info.player_response) || isNotYetBroadcasted(info.player_response));
  };
  var info = await pipeline([id, options], validate, retryOptions, [getWatchHTMLPage, getWatchJSONPage, getVideoInfoPage]);
  Object.assign(info, {
    formats: parseFormats(info.player_response),
    related_videos: extras.getRelatedVideos(info)
  });

  // Add additional properties to info.
  var media = extras.getMedia(info);
  var additional = {
    author: extras.getAuthor(info),
    media: media,
    likes: extras.getLikes(info),
    dislikes: extras.getDislikes(info),
    age_restricted: !!(media && AGE_RESTRICTED_URLS.some(function (url) {
      return Object.values(media).some(function (v) {
        return typeof v === 'string' && v.includes(url);
      });
    })),
    // Give the standard link to the video.
    video_url: BASE_URL + id,
    storyboards: extras.getStoryboards(info),
    chapters: extras.getChapters(info)
  };
  info.videoDetails = extras.cleanVideoDetails(Object.assign({}, info.player_response && info.player_response.microformat && info.player_response.microformat.playerMicroformatRenderer, info.player_response && info.player_response.videoDetails, additional), info);
  return info;
};
var privateVideoError = function privateVideoError(player_response) {
  var playability = player_response && player_response.playabilityStatus;
  if (playability && playability.status === 'LOGIN_REQUIRED' && playability.messages && playability.messages.filter(function (m) {
    return /This is a private video/.test(m);
  }).length) {
    return new UnrecoverableError(playability.reason || playability.messages && playability.messages[0]);
  } else {
    return null;
  }
};
var isRental = function isRental(player_response) {
  var playability = player_response.playabilityStatus;
  return playability && playability.status === 'UNPLAYABLE' && playability.errorScreen && playability.errorScreen.playerLegacyDesktopYpcOfferRenderer;
};
var isNotYetBroadcasted = function isNotYetBroadcasted(player_response) {
  var playability = player_response.playabilityStatus;
  return playability && playability.status === 'LIVE_STREAM_OFFLINE';
};
var getWatchHTMLURL = function getWatchHTMLURL(id, options) {
  return "".concat(BASE_URL + id, "&hl=").concat(options.lang || 'en');
};
var getWatchHTMLPageBody = function getWatchHTMLPageBody(id, options) {
  var url = getWatchHTMLURL(id, options);
  return exports.watchPageCache.getOrSet(url, function () {
    return utils.exposedMiniget(url, options).text();
  });
};
var EMBED_URL = 'https://www.youtube.com/embed/';
var getEmbedPageBody = function getEmbedPageBody(id, options) {
  var embedUrl = "".concat(EMBED_URL + id, "?hl=").concat(options.lang || 'en');
  return utils.exposedMiniget(embedUrl, options).text();
};
var getHTML5player = function getHTML5player(body) {
  var html5playerRes = /<script\s+src="([^"]+)"(?:\s+type="text\/javascript")?\s+name="player_ias\/base"\s*>|"jsUrl":"([^"]+)"/.exec(body);
  return html5playerRes ? html5playerRes[1] || html5playerRes[2] : null;
};
var getIdentityToken = function getIdentityToken(id, options, key, throwIfNotFound) {
  return exports.cookieCache.getOrSet(key, async function () {
    var page = await getWatchHTMLPageBody(id, options);
    var match = page.match(/(["'])ID_TOKEN\1[:,]\s?"([^"]+)"/);
    if (!match && throwIfNotFound) {
      throw new UnrecoverableError('Cookie header used in request, but unable to find YouTube identity token');
    }
    return match && match[2];
  });
};

/**
 * Goes through each endpoint in the pipeline, retrying on failure if the error is recoverable.
 * If unable to succeed with one endpoint, moves onto the next one.
 *
 * @param {Array.<Object>} args
 * @param {Function} validate
 * @param {Object} retryOptions
 * @param {Array.<Function>} endpoints
 * @returns {[Object, Object, Object]}
 */
var pipeline = async function pipeline(args, validate, retryOptions, endpoints) {
  var info;
  var _iterator = _createForOfIteratorHelper(endpoints),
    _step;
  try {
    for (_iterator.s(); !(_step = _iterator.n()).done;) {
      var func = _step.value;
      try {
        var newInfo = await retryFunc(func, args.concat([info]), retryOptions);
        if (newInfo.player_response) {
          newInfo.player_response.videoDetails = assign(info && info.player_response && info.player_response.videoDetails, newInfo.player_response.videoDetails);
          newInfo.player_response = assign(info && info.player_response, newInfo.player_response);
        }
        info = assign(info, newInfo);
        if (validate(info, false)) {
          break;
        }
      } catch (err) {
        if (err instanceof UnrecoverableError || func === endpoints[endpoints.length - 1]) {
          throw err;
        }
        // Unable to find video metadata... so try next endpoint.
      }
    }
  } catch (err) {
    _iterator.e(err);
  } finally {
    _iterator.f();
  }
  return info;
};

/**
 * Like Object.assign(), but ignores `null` and `undefined` from `source`.
 *
 * @param {Object} target
 * @param {Object} source
 * @returns {Object}
 */
var assign = function assign(target, source) {
  if (!target || !source) {
    return target || source;
  }
  for (var _i = 0, _Object$entries = Object.entries(source); _i < _Object$entries.length; _i++) {
    var _Object$entries$_i = _slicedToArray(_Object$entries[_i], 2),
      key = _Object$entries$_i[0],
      value = _Object$entries$_i[1];
    if (value !== null && value !== undefined) {
      target[key] = value;
    }
  }
  return target;
};

/**
 * Given a function, calls it with `args` until it's successful,
 * or until it encounters an unrecoverable error.
 * Currently, any error from miniget is considered unrecoverable. Errors such as
 * too many redirects, invalid URL, status code 404, status code 502.
 *
 * @param {Function} func
 * @param {Array.<Object>} args
 * @param {Object} options
 * @param {number} options.maxRetries
 * @param {Object} options.backoff
 * @param {number} options.backoff.inc
 */
var retryFunc = async function retryFunc(func, args, options) {
  var currentTry = 0,
    result;
  var _loop = async function _loop() {
    try {
      result = await func.apply(void 0, _toConsumableArray(args));
      return 1; // break
    } catch (err) {
      if (err instanceof UnrecoverableError || err instanceof miniget.MinigetError && err.statusCode < 500 || currentTry >= options.maxRetries) {
        throw err;
      }
      var wait = Math.min(++currentTry * options.backoff.inc, options.backoff.max);
      await new Promise(function (resolve) {
        return setTimeout(resolve, wait);
      });
    }
  };
  while (currentTry <= options.maxRetries) {
    if (await _loop()) break;
  }
  return result;
};
var jsonClosingChars = /^[)\]}'\s]+/;
var parseJSON = function parseJSON(source, varName, json) {
  if (!json || _typeof(json) === 'object') {
    return json;
  } else {
    try {
      json = json.replace(jsonClosingChars, '');
      return JSON.parse(json);
    } catch (err) {
      throw Error("Error parsing ".concat(varName, " in ").concat(source, ": ").concat(err.message));
    }
  }
};
var findJSON = function findJSON(source, varName, body, left, right, prependJSON) {
  var jsonStr = utils.between(body, left, right);
  if (!jsonStr) {
    throw Error("Could not find ".concat(varName, " in ").concat(source));
  }
  return parseJSON(source, varName, utils.cutAfterJS("".concat(prependJSON).concat(jsonStr)));
};
var findPlayerResponse = function findPlayerResponse(source, info) {
  var player_response = info && (info.args && info.args.player_response || info.player_response || info.playerResponse || info.embedded_player_response);
  return parseJSON(source, 'player_response', player_response);
};
var getWatchJSONURL = function getWatchJSONURL(id, options) {
  return "".concat(getWatchHTMLURL(id, options), "&pbj=1");
};
var getWatchJSONPage = async function getWatchJSONPage(id, options) {
  var reqOptions = Object.assign({
    headers: {}
  }, options.requestOptions);
  var cookie = reqOptions.headers.Cookie || reqOptions.headers.cookie;
  reqOptions.headers = Object.assign({
    'x-youtube-client-name': '1',
    'x-youtube-client-version': cver,
    'x-youtube-identity-token': exports.cookieCache.get(cookie || 'browser') || ''
  }, reqOptions.headers);
  var setIdentityToken = async function setIdentityToken(key, throwIfNotFound) {
    if (reqOptions.headers['x-youtube-identity-token']) {
      return;
    }
    reqOptions.headers['x-youtube-identity-token'] = await getIdentityToken(id, options, key, throwIfNotFound);
  };
  if (cookie) {
    await setIdentityToken(cookie, true);
  }
  var jsonUrl = getWatchJSONURL(id, options);
  var body = await utils.exposedMiniget(jsonUrl, options, reqOptions).text();
  var parsedBody = parseJSON('watch.json', 'body', body);
  if (parsedBody.reload === 'now') {
    await setIdentityToken('browser', false);
  }
  if (parsedBody.reload === 'now' || !Array.isArray(parsedBody)) {
    throw Error('Unable to retrieve video metadata in watch.json');
  }
  var info = parsedBody.reduce(function (part, curr) {
    return Object.assign(curr, part);
  }, {});
  info.player_response = findPlayerResponse('watch.json', info);
  info.html5player = info.player && info.player.assets && info.player.assets.js;
  return info;
};
var getWatchHTMLPage = async function getWatchHTMLPage(id, options) {
  var body = await getWatchHTMLPageBody(id, options);
  var info = {
    page: 'watch'
  };
  try {
    cver = utils.between(body, '{"key":"cver","value":"', '"}');
    info.player_response = findJSON('watch.html', 'player_response', body, /\bytInitialPlayerResponse\s*=\s*\{/i, '</script>', '{');
  } catch (err) {
    var args = findJSON('watch.html', 'player_response', body, /\bytplayer\.config\s*=\s*{/, '</script>', '{');
    info.player_response = findPlayerResponse('watch.html', args);
  }
  info.response = findJSON('watch.html', 'response', body, /\bytInitialData("\])?\s*=\s*\{/i, '</script>', '{');
  info.html5player = getHTML5player(body);
  return info;
};
var INFO_HOST = 'www.youtube.com';
var INFO_PATH = '/get_video_info';
var VIDEO_EURL = 'https://youtube.googleapis.com/v/';
var getVideoInfoPage = async function getVideoInfoPage(id, options) {
  var url = new URL("https://".concat(INFO_HOST).concat(INFO_PATH));
  url.searchParams.set('video_id', id);
  url.searchParams.set('c', 'TVHTML5');
  url.searchParams.set('cver', "7".concat(cver.substr(1)));
  url.searchParams.set('eurl', VIDEO_EURL + id);
  url.searchParams.set('ps', 'default');
  url.searchParams.set('gl', 'US');
  url.searchParams.set('hl', options.lang || 'en');
  url.searchParams.set('html5', '1');
  var body = await utils.exposedMiniget(url.toString(), options).text();
  var info = querystring.parse(body);
  info.player_response = findPlayerResponse('get_video_info', info);
  return info;
};

/**
 * @param {Object} player_response
 * @returns {Array.<Object>}
 */
var parseFormats = function parseFormats(player_response) {
  var formats = [];
  if (player_response && player_response.streamingData) {
    formats = formats.concat(player_response.streamingData.formats || []).concat(player_response.streamingData.adaptiveFormats || []);
  }
  return formats;
};

/**
 * Gets info from a video additional formats and deciphered URLs.
 *
 * @param {string} id
 * @param {Object} options
 * @returns {Promise<Object>}
 */
exports.getInfo = async function (id, options) {
  var info = await exports.getBasicInfo(id, options);
  var hasManifest = info.player_response && info.player_response.streamingData && (info.player_response.streamingData.dashManifestUrl || info.player_response.streamingData.hlsManifestUrl);
  var funcs = [];
  if (info.formats.length) {
    info.html5player = info.html5player || getHTML5player(await getWatchHTMLPageBody(id, options)) || getHTML5player(await getEmbedPageBody(id, options));
    if (!info.html5player) {
      throw Error('Unable to find html5player file');
    }
    var html5player = new URL(info.html5player, BASE_URL).toString();
    funcs.push(sig.decipherFormats(info.formats, html5player, options));
  }
  if (hasManifest && info.player_response.streamingData.dashManifestUrl) {
    var url = info.player_response.streamingData.dashManifestUrl;
    funcs.push(getDashManifest(url, options));
  }
  if (hasManifest && info.player_response.streamingData.hlsManifestUrl) {
    var _url = info.player_response.streamingData.hlsManifestUrl;
    funcs.push(getM3U8(_url, options));
  }
  var results = await Promise.all(funcs);
  info.formats = Object.values(Object.assign.apply(Object, [{}].concat(_toConsumableArray(results))));
  info.formats = info.formats.map(formatUtils.addFormatMeta);
  info.formats.sort(formatUtils.sortFormats);
  info.full = true;
  return info;
};

/**
 * Gets additional DASH formats.
 *
 * @param {string} url
 * @param {Object} options
 * @returns {Promise<Array.<Object>>}
 */
var getDashManifest = function getDashManifest(url, options) {
  return new Promise(function (resolve, reject) {
    var formats = {};
    var parser = sax.parser(false);
    parser.onerror = reject;
    var adaptationSet;
    parser.onopentag = function (node) {
      if (node.name === 'ADAPTATIONSET') {
        adaptationSet = node.attributes;
      } else if (node.name === 'REPRESENTATION') {
        var itag = parseInt(node.attributes.ID);
        if (!isNaN(itag)) {
          formats[url] = Object.assign({
            itag: itag,
            url: url,
            bitrate: parseInt(node.attributes.BANDWIDTH),
            mimeType: "".concat(adaptationSet.MIMETYPE, "; codecs=\"").concat(node.attributes.CODECS, "\"")
          }, node.attributes.HEIGHT ? {
            width: parseInt(node.attributes.WIDTH),
            height: parseInt(node.attributes.HEIGHT),
            fps: parseInt(node.attributes.FRAMERATE)
          } : {
            audioSampleRate: node.attributes.AUDIOSAMPLINGRATE
          });
        }
      }
    };
    parser.onend = function () {
      resolve(formats);
    };
    var req = utils.exposedMiniget(new URL(url, BASE_URL).toString(), options);
    req.setEncoding('utf8');
    req.on('error', reject);
    req.on('data', function (chunk) {
      parser.write(chunk);
    });
    req.on('end', parser.close.bind(parser));
  });
};

/**
 * Gets additional formats.
 *
 * @param {string} url
 * @param {Object} options
 * @returns {Promise<Array.<Object>>}
 */
var getM3U8 = async function getM3U8(url, options) {
  url = new URL(url, BASE_URL);
  var body = await utils.exposedMiniget(url.toString(), options).text();
  var formats = {};
  body.split('\n').filter(function (line) {
    return /^https?:\/\//.test(line);
  }).forEach(function (line) {
    var itag = parseInt(line.match(/\/itag\/(\d+)\//)[1]);
    formats[line] = {
      itag: itag,
      url: line
    };
  });
  return formats;
};

// Cache get info functions.
// In case a user wants to get a video's info before downloading.
var _loop2 = function _loop2() {
  var funcName = _arr[_i2];
  /**
   * @param {string} link
   * @param {Object} options
   * @returns {Promise<Object>}
   */
  var func = exports[funcName];
  exports[funcName] = async function (link) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    utils.checkForUpdates();
    var id = await urlUtils.getVideoID(link);
    var key = [funcName, id, options.lang].join('-');
    return exports.cache.getOrSet(key, function () {
      return func(id, options);
    });
  };
};
for (var _i2 = 0, _arr = ['getBasicInfo', 'getInfo']; _i2 < _arr.length; _i2++) {
  _loop2();
}

// Export a few helpers.
exports.validateID = urlUtils.validateID;
exports.validateURL = urlUtils.validateURL;
exports.getURLVideoID = urlUtils.getURLVideoID;
exports.getVideoID = urlUtils.getVideoID;

/***/ }),

/***/ 1717:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

var querystring = __webpack_require__(9774);
var Cache = __webpack_require__(1902);
var utils = __webpack_require__(6062);
var vm = __webpack_require__(9084);

// A shared cache to keep track of html5player js functions.
exports.cache = new Cache();

/**
 * Extract signature deciphering and n parameter transform functions from html5player file.
 *
 * @param {string} html5playerfile
 * @param {Object} options
 * @returns {Promise<Array.<string>>}
 */
exports.getFunctions = function (html5playerfile, options) {
  return exports.cache.getOrSet(html5playerfile, async function () {
    var body = await utils.exposedMiniget(html5playerfile, options).text();
    var functions = exports.extractFunctions(body);
    if (!functions || !functions.length) {
      throw Error('Could not extract functions');
    }
    exports.cache.set(html5playerfile, functions);
    return functions;
  });
};

/**
 * Extracts the actions that should be taken to decipher a signature
 * and tranform the n parameter
 *
 * @param {string} body
 * @returns {Array.<string>}
 */
exports.extractFunctions = function (body) {
  var functions = [];
  var extractManipulations = function extractManipulations(caller) {
    var functionName = utils.between(caller, "a=a.split(\"\");", ".");
    if (!functionName) return '';
    var functionStart = "var ".concat(functionName, "={");
    var ndx = body.indexOf(functionStart);
    if (ndx < 0) return '';
    var subBody = body.slice(ndx + functionStart.length - 1);
    return "var ".concat(functionName, "=").concat(utils.cutAfterJS(subBody));
  };
  var extractDecipher = function extractDecipher() {
    var functionName = utils.between(body, "a.set(\"alr\",\"yes\");c&&(c=", "(decodeURIC");
    if (functionName && functionName.length) {
      var functionStart = "".concat(functionName, "=function(a)");
      var ndx = body.indexOf(functionStart);
      if (ndx >= 0) {
        var subBody = body.slice(ndx + functionStart.length);
        var functionBody = "var ".concat(functionStart).concat(utils.cutAfterJS(subBody));
        functionBody = "".concat(extractManipulations(functionBody), ";").concat(functionBody, ";").concat(functionName, "(sig);");
        functions.push(functionBody);
      }
    }
  };
  var extractNCode = function extractNCode() {
    var functionName = utils.between(body, "&&(b=a.get(\"n\"))&&(b=", "(b)");
    if (functionName.includes('[')) functionName = utils.between(body, "var ".concat(functionName.split('[')[0], "=["), "]");
    if (functionName && functionName.length) {
      var functionStart = "".concat(functionName, "=function(a)");
      var ndx = body.indexOf(functionStart);
      if (ndx >= 0) {
        var subBody = body.slice(ndx + functionStart.length);
        var functionBody = "var ".concat(functionStart).concat(utils.cutAfterJS(subBody), ";").concat(functionName, "(ncode);");
        functions.push(functionBody);
      }
    }
  };
  extractDecipher();
  extractNCode();
  return functions;
};

/**
 * Apply decipher and n-transform to individual format
 *
 * @param {Object} format
 * @param {vm.Script} decipherScript
 * @param {vm.Script} nTransformScript
 */
exports.setDownloadURL = function (format, decipherScript, nTransformScript) {
  var decipher = function decipher(url) {
    var args = querystring.parse(url);
    if (!args.s || !decipherScript) return args.url;
    var components = new URL(decodeURIComponent(args.url));
    components.searchParams.set(args.sp ? args.sp : 'signature', decipherScript.runInNewContext({
      sig: decodeURIComponent(args.s)
    }));
    return components.toString();
  };
  var ncode = function ncode(url) {
    var components = new URL(decodeURIComponent(url));
    var n = components.searchParams.get('n');
    if (!n || !nTransformScript) return url;
    components.searchParams.set('n', nTransformScript.runInNewContext({
      ncode: n
    }));
    return components.toString();
  };
  var cipher = !format.url;
  var url = format.url || format.signatureCipher || format.cipher;
  format.url = cipher ? ncode(decipher(url)) : ncode(url);
  delete format.signatureCipher;
  delete format.cipher;
};

/**
 * Applies decipher and n parameter transforms to all format URL's.
 *
 * @param {Array.<Object>} formats
 * @param {string} html5player
 * @param {Object} options
 */
exports.decipherFormats = async function (formats, html5player, options) {
  var decipheredFormats = {};
  var functions = await exports.getFunctions(html5player, options);
  var decipherScript = functions.length ? new vm.Script(functions[0]) : null;
  var nTransformScript = functions.length > 1 ? new vm.Script(functions[1]) : null;
  formats.forEach(function (format) {
    exports.setDownloadURL(format, decipherScript, nTransformScript);
    decipheredFormats[format.url] = format;
  });
  return decipheredFormats;
};

/***/ }),

/***/ 3919:
/***/ ((__unused_webpack_module, exports) => {

/**
 * Get video ID.
 *
 * There are a few type of video URL formats.
 *  - https://www.youtube.com/watch?v=VIDEO_ID
 *  - https://m.youtube.com/watch?v=VIDEO_ID
 *  - https://youtu.be/VIDEO_ID
 *  - https://www.youtube.com/v/VIDEO_ID
 *  - https://www.youtube.com/embed/VIDEO_ID
 *  - https://music.youtube.com/watch?v=VIDEO_ID
 *  - https://gaming.youtube.com/watch?v=VIDEO_ID
 *
 * @param {string} link
 * @return {string}
 * @throws {Error} If unable to find a id
 * @throws {TypeError} If videoid doesn't match specs
 */
var validQueryDomains = new Set(['youtube.com', 'www.youtube.com', 'm.youtube.com', 'music.youtube.com', 'gaming.youtube.com']);
var validPathDomains = /^https?:\/\/(youtu\.be\/|(www\.)?youtube\.com\/(embed|v|shorts)\/)/;
exports.getURLVideoID = function (link) {
  var parsed = new URL(link.trim());
  var id = parsed.searchParams.get('v');
  if (validPathDomains.test(link.trim()) && !id) {
    var paths = parsed.pathname.split('/');
    id = parsed.host === 'youtu.be' ? paths[1] : paths[2];
  } else if (parsed.hostname && !validQueryDomains.has(parsed.hostname)) {
    throw Error('Not a YouTube domain');
  }
  if (!id) {
    throw Error("No video id found: \"".concat(link, "\""));
  }
  id = id.substring(0, 11);
  if (!exports.validateID(id)) {
    throw TypeError("Video id (".concat(id, ") does not match expected ") + "format (".concat(idRegex.toString(), ")"));
  }
  return id;
};

/**
 * Gets video ID either from a url or by checking if the given string
 * matches the video ID format.
 *
 * @param {string} str
 * @returns {string}
 * @throws {Error} If unable to find a id
 * @throws {TypeError} If videoid doesn't match specs
 */
var urlRegex = /^https?:\/\//;
exports.getVideoID = function (str) {
  if (exports.validateID(str)) {
    return str;
  } else if (urlRegex.test(str.trim())) {
    return exports.getURLVideoID(str);
  } else {
    throw Error("No video id found: ".concat(str));
  }
};

/**
 * Returns true if given id satifies YouTube's id format.
 *
 * @param {string} id
 * @return {boolean}
 */
var idRegex = /^[a-zA-Z0-9-_]{11}$/;
exports.validateID = function (id) {
  return idRegex.test(id.trim());
};

/**
 * Checks wether the input string includes a valid id.
 *
 * @param {string} string
 * @returns {boolean}
 */
exports.validateURL = function (string) {
  try {
    exports.getURLVideoID(string);
    return true;
  } catch (e) {
    return false;
  }
};

/***/ }),

/***/ 6062:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

/* provided dependency */ var process = __webpack_require__(2790);
function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }
var miniget = __webpack_require__(6206);

/**
 * Extract string inbetween another.
 *
 * @param {string} haystack
 * @param {string} left
 * @param {string} right
 * @returns {string}
 */
exports.between = function (haystack, left, right) {
  var pos;
  if (left instanceof RegExp) {
    var match = haystack.match(left);
    if (!match) {
      return '';
    }
    pos = match.index + match[0].length;
  } else {
    pos = haystack.indexOf(left);
    if (pos === -1) {
      return '';
    }
    pos += left.length;
  }
  haystack = haystack.slice(pos);
  pos = haystack.indexOf(right);
  if (pos === -1) {
    return '';
  }
  haystack = haystack.slice(0, pos);
  return haystack;
};

/**
 * Get a number from an abbreviated number string.
 *
 * @param {string} string
 * @returns {number}
 */
exports.parseAbbreviatedNumber = function (string) {
  var match = string.replace(',', '.').replace(' ', '').match(/([\d,.]+)([MK]?)/);
  if (match) {
    var _match = _slicedToArray(match, 3),
      num = _match[1],
      multi = _match[2];
    num = parseFloat(num);
    return Math.round(multi === 'M' ? num * 1000000 : multi === 'K' ? num * 1000 : num);
  }
  return null;
};

/**
 * Escape sequences for cutAfterJS
 * @param {string} start the character string the escape sequence
 * @param {string} end the character string to stop the escape seequence
 * @param {undefined|Regex} startPrefix a regex to check against the preceding 10 characters
 */
var ESCAPING_SEQUENZES = [
// Strings
{
  start: '"',
  end: '"'
}, {
  start: "'",
  end: "'"
}, {
  start: '`',
  end: '`'
},
// RegeEx
{
  start: '/',
  end: '/',
  startPrefix: /(^|[[{:;,/])\s?$/
}];

/**
 * Match begin and end braces of input JS, return only JS
 *
 * @param {string} mixedJson
 * @returns {string}
*/
exports.cutAfterJS = function (mixedJson) {
  // Define the general open and closing tag
  var open, close;
  if (mixedJson[0] === '[') {
    open = '[';
    close = ']';
  } else if (mixedJson[0] === '{') {
    open = '{';
    close = '}';
  }
  if (!open) {
    throw new Error("Can't cut unsupported JSON (need to begin with [ or { ) but got: ".concat(mixedJson[0]));
  }

  // States if the loop is currently inside an escaped js object
  var isEscapedObject = null;

  // States if the current character is treated as escaped or not
  var isEscaped = false;

  // Current open brackets to be closed
  var counter = 0;
  var i;
  // Go through all characters from the start
  for (i = 0; i < mixedJson.length; i++) {
    // End of current escaped object
    if (!isEscaped && isEscapedObject !== null && mixedJson[i] === isEscapedObject.end) {
      isEscapedObject = null;
      continue;
      // Might be the start of a new escaped object
    } else if (!isEscaped && isEscapedObject === null) {
      for (var _i = 0, _ESCAPING_SEQUENZES = ESCAPING_SEQUENZES; _i < _ESCAPING_SEQUENZES.length; _i++) {
        var escaped = _ESCAPING_SEQUENZES[_i];
        if (mixedJson[i] !== escaped.start) continue;
        // Test startPrefix against last 10 characters
        if (!escaped.startPrefix || mixedJson.substring(i - 10, i).match(escaped.startPrefix)) {
          isEscapedObject = escaped;
          break;
        }
      }
      // Continue if we found a new escaped object
      if (isEscapedObject !== null) {
        continue;
      }
    }

    // Toggle the isEscaped boolean for every backslash
    // Reset for every regular character
    isEscaped = mixedJson[i] === '\\' && !isEscaped;
    if (isEscapedObject !== null) continue;
    if (mixedJson[i] === open) {
      counter++;
    } else if (mixedJson[i] === close) {
      counter--;
    }

    // All brackets have been closed, thus end of JSON is reached
    if (counter === 0) {
      // Return the cut JSON
      return mixedJson.substring(0, i + 1);
    }
  }

  // We ran through the whole string and ended up with an unclosed bracket
  throw Error("Can't cut unsupported JSON (no matching closing bracket found)");
};

/**
 * Checks if there is a playability error.
 *
 * @param {Object} player_response
 * @param {Array.<string>} statuses
 * @param {Error} ErrorType
 * @returns {!Error}
 */
exports.playError = function (player_response, statuses) {
  var ErrorType = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : Error;
  var playability = player_response && player_response.playabilityStatus;
  if (playability && statuses.includes(playability.status)) {
    return new ErrorType(playability.reason || playability.messages && playability.messages[0]);
  }
  return null;
};

/**
 * Does a miniget request and calls options.requestCallback if present
 *
 * @param {string} url the request url
 * @param {Object} options an object with optional requestOptions and requestCallback parameters
 * @param {Object} requestOptionsOverwrite overwrite of options.requestOptions
 * @returns {miniget.Stream}
 */
exports.exposedMiniget = function (url) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var requestOptionsOverwrite = arguments.length > 2 ? arguments[2] : undefined;
  var req = miniget(url, requestOptionsOverwrite || options.requestOptions);
  if (typeof options.requestCallback === 'function') options.requestCallback(req);
  return req;
};

/**
 * Temporary helper to help deprecating a few properties.
 *
 * @param {Object} obj
 * @param {string} prop
 * @param {Object} value
 * @param {string} oldPath
 * @param {string} newPath
 */
exports.deprecate = function (obj, prop, value, oldPath, newPath) {
  Object.defineProperty(obj, prop, {
    get: function get() {
      console.warn("`".concat(oldPath, "` will be removed in a near future release, ") + "use `".concat(newPath, "` instead."));
      return value;
    }
  });
};

// Check for updates.
var pkg = __webpack_require__(2206);
var UPDATE_INTERVAL = 1000 * 60 * 60 * 12;
exports.lastUpdateCheck = 0;
exports.checkForUpdates = function () {
  if (!process.env.YTDL_NO_UPDATE && !pkg.version.startsWith('0.0.0-') && Date.now() - exports.lastUpdateCheck >= UPDATE_INTERVAL) {
    exports.lastUpdateCheck = Date.now();
    return miniget('https://api.github.com/repos/fent/node-ytdl-core/releases/latest', {
      headers: {
        'User-Agent': 'ytdl-core'
      }
    }).text().then(function (response) {
      if (JSON.parse(response).tag_name !== "v".concat(pkg.version)) {
        console.warn('\x1b[33mWARNING:\x1B[0m ytdl-core is out of date! Update with "npm install ytdl-core@latest".');
      }
    }, function (err) {
      console.warn('Error checking for updates:', err.message);
      console.warn('You can disable this check by setting the `YTDL_NO_UPDATE` env variable.');
    });
  }
  return null;
};

/**
 * Gets random IPv6 Address from a block
 *
 * @param {string} ip the IPv6 block in CIDR-Notation
 * @returns {string}
 */
exports.getRandomIPv6 = function (ip) {
  // Start with a fast Regex-Check
  if (!isIPv6(ip)) throw Error('Invalid IPv6 format');
  // Start by splitting and normalizing addr and mask
  var _ip$split = ip.split('/'),
    _ip$split2 = _slicedToArray(_ip$split, 2),
    rawAddr = _ip$split2[0],
    rawMask = _ip$split2[1];
  var base10Mask = parseInt(rawMask);
  if (!base10Mask || base10Mask > 128 || base10Mask < 24) throw Error('Invalid IPv6 subnet');
  var base10addr = normalizeIP(rawAddr);
  // Get random addr to pad with
  // using Math.random since we're not requiring high level of randomness
  var randomAddr = new Array(8).fill(1).map(function () {
    return Math.floor(Math.random() * 0xffff);
  });

  // Merge base10addr with randomAddr
  var mergedAddr = randomAddr.map(function (randomItem, idx) {
    // Calculate the amount of static bits
    var staticBits = Math.min(base10Mask, 16);
    // Adjust the bitmask with the staticBits
    base10Mask -= staticBits;
    // Calculate the bitmask
    // lsb makes the calculation way more complicated
    var mask = 0xffff - (Math.pow(2, 16 - staticBits) - 1);
    // Combine base10addr and random
    return (base10addr[idx] & mask) + (randomItem & (mask ^ 0xffff));
  });
  // Return new addr
  return mergedAddr.map(function (x) {
    return x.toString('16');
  }).join(':');
};

// eslint-disable-next-line max-len
var IPV6_REGEX = /^(([0-9a-f]{1,4}:)(:[0-9a-f]{1,4}){1,6}|([0-9a-f]{1,4}:){1,2}(:[0-9a-f]{1,4}){1,5}|([0-9a-f]{1,4}:){1,3}(:[0-9a-f]{1,4}){1,4}|([0-9a-f]{1,4}:){1,4}(:[0-9a-f]{1,4}){1,3}|([0-9a-f]{1,4}:){1,5}(:[0-9a-f]{1,4}){1,2}|([0-9a-f]{1,4}:){1,6}(:[0-9a-f]{1,4})|([0-9a-f]{1,4}:){1,7}(([0-9a-f]{1,4})|:))\/(1[0-1]\d|12[0-8]|\d{1,2})$/;
/**
 * Quick check for a valid IPv6
 * The Regex only accepts a subset of all IPv6 Addresses
 *
 * @param {string} ip the IPv6 block in CIDR-Notation to test
 * @returns {boolean} true if valid
 */
var isIPv6 = exports.isIPv6 = function (ip) {
  return IPV6_REGEX.test(ip);
};

/**
 * Normalise an IP Address
 *
 * @param {string} ip the IPv6 Addr
 * @returns {number[]} the 8 parts of the IPv6 as Integers
 */
var normalizeIP = exports.normalizeIP = function (ip) {
  // Split by fill position
  var parts = ip.split('::').map(function (x) {
    return x.split(':');
  });
  // Normalize start and end
  var partStart = parts[0] || [];
  var partEnd = parts[1] || [];
  partEnd.reverse();
  // Placeholder for full ip
  var fullIP = new Array(8).fill(0);
  // Fill in start and end parts
  for (var i = 0; i < Math.min(partStart.length, 8); i++) {
    fullIP[i] = parseInt(partStart[i], 16) || 0;
  }
  for (var _i2 = 0; _i2 < Math.min(partEnd.length, 8); _i2++) {
    fullIP[7 - _i2] = parseInt(partEnd[_i2], 16) || 0;
  }
  return fullIP;
};

/***/ }),

/***/ 4654:
/***/ (() => {

/* (ignored) */

/***/ }),

/***/ 2361:
/***/ (() => {

/* (ignored) */

/***/ }),

/***/ 4616:
/***/ (() => {

/* (ignored) */

/***/ }),

/***/ 2206:
/***/ ((module) => {

"use strict";
module.exports = JSON.parse('{"name":"ytdl-core","description":"YouTube video downloader in pure javascript.","keywords":["youtube","video","download"],"version":"4.11.5","repository":{"type":"git","url":"git://github.com/fent/node-ytdl-core.git"},"author":"fent <fentbox@gmail.com> (https://github.com/fent)","contributors":["Tobias Kutscha (https://github.com/TimeForANinja)","Andrew Kelley (https://github.com/andrewrk)","Mauricio Allende (https://github.com/mallendeo)","Rodrigo Altamirano (https://github.com/raltamirano)","Jim Buck (https://github.com/JimmyBoh)","Paweł Ruciński (https://github.com/Roki100)","Alexander Paolini (https://github.com/Million900o)"],"main":"./lib/index.js","types":"./typings/index.d.ts","files":["lib","typings"],"scripts":{"test":"nyc --reporter=lcov --reporter=text-summary npm run test:unit","test:unit":"mocha --ignore test/irl-test.js test/*-test.js --timeout 4000","test:irl":"mocha --timeout 16000 test/irl-test.js","lint":"eslint ./","lint:fix":"eslint --fix ./","lint:typings":"tslint typings/index.d.ts","lint:typings:fix":"tslint --fix typings/index.d.ts"},"dependencies":{"m3u8stream":"^0.8.6","miniget":"^4.2.2","sax":"^1.1.3"},"devDependencies":{"@types/node":"^13.1.0","assert-diff":"^3.0.1","dtslint":"^3.6.14","eslint":"^6.8.0","mocha":"^7.0.0","muk-require":"^1.2.0","nock":"^13.0.4","nyc":"^15.0.0","sinon":"^9.0.0","stream-equal":"~1.1.0","typescript":"^3.9.7"},"engines":{"node":">=12"},"license":"MIT"}');

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			id: moduleId,
/******/ 			loaded: false,
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/amd options */
/******/ 	(() => {
/******/ 		__webpack_require__.amdO = {};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/global */
/******/ 	(() => {
/******/ 		__webpack_require__.g = (function() {
/******/ 			if (typeof globalThis === 'object') return globalThis;
/******/ 			try {
/******/ 				return this || new Function('return this')();
/******/ 			} catch (e) {
/******/ 				if (typeof window === 'object') return window;
/******/ 			}
/******/ 		})();
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/node module decorator */
/******/ 	(() => {
/******/ 		__webpack_require__.nmd = (module) => {
/******/ 			module.paths = [];
/******/ 			if (!module.children) module.children = [];
/******/ 			return module;
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be in strict mode.
(() => {
"use strict";

;// CONCATENATED MODULE: ./node_modules/gopeed/dist/index.js
var gopeed$1 = gopeed;

// EXTERNAL MODULE: ./node_modules/ytdl-core/lib/index.js
var lib = __webpack_require__(9115);
;// CONCATENATED MODULE: ./src/index.js



// https://www.youtube.com/watch?v=aqz-KE-bpKQ
gopeed$1.events.onResolve(async function (ctx) {
  var video = await lib.getInfo(ctx.req.url);
  var bestFormat = lib.chooseFormat(video.formats, {
    quality: gopeed$1.settings.quality
  });
  gopeed$1.logger.debug(JSON.stringify(bestFormat));
  var fmt = '.mp4';
  if (bestFormat.mimeType) {
    fmt = '.' + bestFormat.mimeType.split(';')[0].split('/')[1];
  }
  ctx.res = {
    name: video.videoDetails.title,
    files: [{
      name: "video-".concat(bestFormat.qualityLabel).concat(fmt),
      size: bestFormat.contentLength,
      req: {
        url: bestFormat.url
      }
    }]
  };
});
})();

/******/ })()
;