import React, { useState, useEffect } from 'react';
import { Copy, Check, RefreshCw, Share2, Shield, UploadCloud, FileText } from 'lucide-react';

interface HashProps {
  onCopy?: (text: string) => void;
  onShare?: (title: string, path: string) => void;
}

// Pure JS MD5 implementation for client-side checksum
function md5(string: string): string {
  function rotateLeft(lValue: number, iShiftBits: number) {
    return (lValue << iShiftBits) | (lValue >>> (32 - iShiftBits));
  }
  function addUnsigned(lX: number, lY: number) {
    const lX8 = lX & 0x80000000;
    const lY8 = lY & 0x80000000;
    const lX4 = lX & 0x40000000;
    const lY4 = lY & 0x40000000;
    const lResult = (lX & 0x3fffffff) + (lY & 0x3fffffff);
    if (lX4 & lY4) return lResult ^ 0x80000000 ^ lX8 ^ lY8;
    if (lX4 | lY4) {
      if (lResult & 0x40000000) return lResult ^ 0xc0000000 ^ lX8 ^ lY8;
      else return lResult ^ 0x40000000 ^ lX8 ^ lY8;
    } else return lResult ^ lX8 ^ lY8;
  }
  function F(x: number, y: number, z: number) { return (x & y) | (~x & z); }
  function G(x: number, y: number, z: number) { return (x & z) | (y & ~z); }
  function H(x: number, y: number, z: number) { return x ^ y ^ z; }
  function I(x: number, y: number, z: number) { return y ^ (x | ~z); }
  function FF(a: number, b: number, c: number, d: number, x: number, s: number, ac: number) {
    a = addUnsigned(a, addUnsigned(addUnsigned(F(b, c, d), x), ac));
    return addUnsigned(rotateLeft(a, s), b);
  }
  function GG(a: number, b: number, c: number, d: number, x: number, s: number, ac: number) {
    a = addUnsigned(a, addUnsigned(addUnsigned(G(b, c, d), x), ac));
    return addUnsigned(rotateLeft(a, s), b);
  }
  function HH(a: number, b: number, c: number, d: number, x: number, s: number, ac: number) {
    a = addUnsigned(a, addUnsigned(addUnsigned(H(b, c, d), x), ac));
    return addUnsigned(rotateLeft(a, s), b);
  }
  function II(a: number, b: number, c: number, d: number, x: number, s: number, ac: number) {
    a = addUnsigned(a, addUnsigned(addUnsigned(I(b, c, d), x), ac));
    return addUnsigned(rotateLeft(a, s), b);
  }

  const utf8Bytes = new TextEncoder().encode(string);
  const nWords = (((utf8Bytes.length + 8) >> 6) + 1) * 16;
  const words = new Int32Array(nWords);
  for (let i = 0; i < utf8Bytes.length; i++) {
    words[i >> 2] |= utf8Bytes[i] << ((i % 4) * 8);
  }
  words[utf8Bytes.length >> 2] |= 0x80 << ((utf8Bytes.length % 4) * 8);
  words[nWords - 2] = (utf8Bytes.length * 8) & 0xffffffff;
  words[nWords - 1] = Math.floor((utf8Bytes.length * 8) / 0x100000000);

  let a = 1732584193, b = -271733879, c = -1732584194, d = 271733878;

  for (let k = 0; k < words.length; k += 16) {
    const AA = a, BB = b, CC = c, DD = d;
    a = FF(a, b, c, d, words[k + 0], 7, -680876936);
    d = FF(d, a, b, c, words[k + 1], 12, -389564586);
    c = FF(c, d, a, b, words[k + 2], 17, 606105819);
    b = FF(b, c, d, a, words[k + 3], 22, -1044525330);
    a = FF(a, b, c, d, words[k + 4], 7, -176418897);
    d = FF(d, a, b, c, words[k + 5], 12, 1200080426);
    c = FF(c, d, a, b, words[k + 6], 17, -1473231341);
    b = FF(b, c, d, a, words[k + 7], 22, -45705983);
    a = FF(a, b, c, d, words[k + 8], 7, 1770035416);
    d = FF(d, a, b, c, words[k + 9], 12, -1958414417);
    c = FF(c, d, a, b, words[k + 10], 17, -42063);
    b = FF(b, c, d, a, words[k + 11], 22, -1990404162);
    a = FF(a, b, c, d, words[k + 12], 7, 1804603682);
    d = FF(d, a, b, c, words[k + 13], 12, -40341101);
    c = FF(c, d, a, b, words[k + 14], 17, -1502002290);
    b = FF(b, c, d, a, words[k + 15], 22, 1236535329);

    a = GG(a, b, c, d, words[k + 1], 5, -165796510);
    d = GG(d, a, b, c, words[k + 6], 9, -1069501632);
    c = GG(c, d, a, b, words[k + 11], 14, 643717713);
    b = GG(b, c, d, a, words[k + 0], 20, -373897302);
    a = GG(a, b, c, d, words[k + 5], 5, -701558691);
    d = GG(d, a, b, c, words[k + 10], 9, 38016083);
    c = GG(c, d, a, b, words[k + 15], 14, -660478335);
    b = GG(b, c, d, a, words[k + 4], 20, -405537848);
    a = GG(a, b, c, d, words[k + 9], 5, 568446438);
    d = GG(d, a, b, c, words[k + 14], 9, -1019803690);
    c = GG(c, d, a, b, words[k + 3], 14, -187363961);
    b = GG(b, c, d, a, words[k + 8], 20, 1163531501);
    a = GG(a, b, c, d, words[k + 13], 5, -1444681467);
    d = GG(d, a, b, c, words[k + 2], 9, -51403784);
    c = GG(c, d, a, b, words[k + 7], 14, 1735328473);
    b = GG(b, c, d, a, words[k + 12], 20, -1926607734);

    a = HH(a, b, c, d, words[k + 5], 4, -378558);
    d = HH(d, a, b, c, words[k + 8], 11, -2022574463);
    c = HH(c, d, a, b, words[k + 11], 16, 1839030562);
    b = HH(b, c, d, a, words[k + 14], 23, -35309556);
    a = HH(a, b, c, d, words[k + 1], 4, -1530992060);
    d = HH(d, a, b, c, words[k + 4], 11, 1272893353);
    c = HH(c, d, a, b, words[k + 7], 16, -155497632);
    b = HH(b, c, d, a, words[k + 10], 23, -1094730640);
    a = HH(a, b, c, d, words[k + 13], 4, 681279174);
    d = HH(d, a, b, c, words[k + 0], 11, -358537222);
    c = HH(c, d, a, b, words[k + 3], 16, -722521979);
    b = HH(b, c, d, a, words[k + 6], 23, 76029189);
    a = HH(a, b, c, d, words[k + 9], 4, -640364487);
    d = HH(d, a, b, c, words[k + 12], 11, -421815835);
    c = HH(c, d, a, b, words[k + 15], 16, 530742520);
    b = HH(b, c, d, a, words[k + 2], 23, -995338651);

    a = II(a, b, c, d, words[k + 0], 6, -198630844);
    d = II(d, a, b, c, words[k + 7], 10, 1126891415);
    c = II(c, d, a, b, words[k + 14], 15, -1416354905);
    b = II(b, c, d, a, words[k + 5], 21, -57434055);
    a = II(a, b, c, d, words[k + 12], 6, 1700485571);
    d = II(d, a, b, c, words[k + 3], 10, -1894986606);
    c = II(c, d, a, b, words[k + 10], 15, -1051523);
    b = II(b, c, d, a, words[k + 1], 21, -2054922799);
    a = II(a, b, c, d, words[k + 8], 6, 1873313359);
    d = II(d, a, b, c, words[k + 15], 10, -30611744);
    c = II(c, d, a, b, words[k + 6], 15, -1560198380);
    b = II(b, c, d, a, words[k + 13], 21, 1309151649);
    a = II(a, b, c, d, words[k + 4], 6, -145523070);
    d = II(d, a, b, c, words[k + 11], 10, -1120210379);
    c = II(c, d, a, b, words[k + 2], 15, 718787259);
    b = II(b, c, d, a, words[k + 9], 21, -343485551);

    a = addUnsigned(a, AA);
    b = addUnsigned(b, BB);
    c = addUnsigned(c, CC);
    d = addUnsigned(d, DD);
  }

  const hexTab = '0123456789abcdef';
  let out = '';
  for (const val of [a, b, c, d]) {
    for (let j = 0; j <= 3; j++) {
      out += hexTab.charAt((val >> (j * 8 + 4)) & 0x0f) + hexTab.charAt((val >> (j * 8)) & 0x0f);
    }
  }
  return out;
}

export default function HashGenerator({ onCopy, onShare }: HashProps) {
  const [input, setInput] = useState<string>('yuitility');
  const [uppercase, setUppercase] = useState<boolean>(false);
  const [hashes, setHashes] = useState<Record<string, string>>({
    MD5: '',
    'SHA-1': '',
    'SHA-256': '',
    'SHA-384': '',
    'SHA-512': '',
  });
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const bufferToHex = (buffer: ArrayBuffer): string => {
    return Array.from(new Uint8Array(buffer))
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('');
  };

  const calculateHashes = async () => {
    if (!input) {
      setHashes({ MD5: '', 'SHA-1': '', 'SHA-256': '', 'SHA-384': '', 'SHA-512': '' });
      return;
    }

    const encoder = new TextEncoder();
    const data = encoder.encode(input);

    const md5Hash = md5(input);

    try {
      const [sha1, sha256, sha384, sha512] = await Promise.all([
        crypto.subtle.digest('SHA-1', data),
        crypto.subtle.digest('SHA-256', data),
        crypto.subtle.digest('SHA-384', data),
        crypto.subtle.digest('SHA-512', data),
      ]);

      const format = (h: string) => (uppercase ? h.toUpperCase() : h.toLowerCase());

      setHashes({
        MD5: format(md5Hash),
        'SHA-1': format(bufferToHex(sha1)),
        'SHA-256': format(bufferToHex(sha256)),
        'SHA-384': format(bufferToHex(sha384)),
        'SHA-512': format(bufferToHex(sha512)),
      });
    } catch {
      setHashes({
        MD5: uppercase ? md5Hash.toUpperCase() : md5Hash.toLowerCase(),
        'SHA-1': 'Not supported in this environment',
        'SHA-256': 'Not supported in this environment',
        'SHA-384': 'Not supported in this environment',
        'SHA-512': 'Not supported in this environment',
      });
    }
  };

  useEffect(() => {
    calculateHashes();
  }, [input, uppercase]);

  const handleCopy = (key: string, val: string) => {
    navigator.clipboard.writeText(val);
    setCopiedKey(key);
    if (onCopy) onCopy(val);
    setTimeout(() => setCopiedKey(null), 1800);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setInput(reader.result as string);
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-100 dark:border-zinc-800 pb-5">
        <div>
          <h2 className="text-2xl font-display font-semibold text-zinc-900 dark:text-zinc-50 tracking-tight">
            Hash Generator (MD5, SHA-1, SHA-256, SHA-512)
          </h2>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
            Compute cryptographic checksums and digital fingerprints locally via Web Crypto API.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setInput('')}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-zinc-600 dark:text-zinc-300 bg-zinc-100 dark:bg-zinc-800 rounded-md hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Clear
          </button>
          {onShare && (
            <button
              onClick={() => onShare("Hash Generator", "hash-generator-md5-sha")}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-zinc-600 dark:text-zinc-300 bg-zinc-100 dark:bg-zinc-800 rounded-md hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
            >
              <Share2 className="w-3.5 h-3.5" />
              Share
            </button>
          )}
        </div>
      </div>

      {/* Input Section */}
      <div className="space-y-3">
        <div className="flex justify-between items-center text-xs text-zinc-500">
          <span className="font-semibold uppercase tracking-wider">Input String or Text</span>
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={uppercase}
                onChange={(e) => setUppercase(e.target.checked)}
                className="w-3.5 h-3.5 rounded border-zinc-300 text-rose-600 focus:ring-rose-500"
              />
              <span>UPPERCASE HEX</span>
            </label>

            <label className="inline-flex items-center gap-1.5 hover:text-zinc-900 dark:hover:text-zinc-100 cursor-pointer">
              <UploadCloud className="w-3.5 h-3.5 text-rose-500" />
              <span>Load File</span>
              <input type="file" onChange={handleFileUpload} className="hidden" />
            </label>
          </div>
        </div>

        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type or paste payload to calculate cryptographic hashes..."
          className="w-full h-32 p-4 font-mono text-xs rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 text-zinc-900 dark:text-zinc-100 outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 resize-none shadow-sm"
        />
      </div>

      {/* Hash Results Table */}
      <div className="space-y-3">
        <h3 className="text-xs font-semibold text-zinc-600 dark:text-zinc-400 uppercase tracking-wider">
          Calculated Cryptographic Digests
        </h3>

        <div className="space-y-2.5">
          {Object.entries(hashes).map(([algo, hashValue]) => (
            <div
              key={algo}
              className="p-4 bg-white dark:bg-zinc-900/80 border border-zinc-200 dark:border-zinc-800 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-sm hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors"
            >
              <div className="flex items-center gap-2 sm:w-28 shrink-0">
                <Shield className="w-4 h-4 text-rose-500" />
                <span className="font-mono text-xs font-bold text-zinc-900 dark:text-zinc-100">{algo}</span>
              </div>

              <div className="font-mono text-xs text-zinc-700 dark:text-zinc-300 break-all select-all flex-1">
                {hashValue || <span className="text-zinc-400">Empty input</span>}
              </div>

              <button
                onClick={() => handleCopy(algo, hashValue)}
                disabled={!hashValue}
                className="self-end sm:self-center shrink-0 flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium border border-zinc-200 dark:border-zinc-700 rounded-lg bg-zinc-50 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:text-zinc-900 hover:bg-zinc-100 dark:hover:bg-zinc-700 transition-all disabled:opacity-40"
              >
                {copiedKey === algo ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-500" />
                    <span className="text-emerald-600 dark:text-emerald-400 font-semibold">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
