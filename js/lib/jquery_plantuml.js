// jQuery PlantUML, some version with both deflate and inflate.
// Modified version from http://www.planttext.com/javascript/jquery-plantuml/plantuml.js

function decode6bit(c) {
  if (c>='0' && c<='9') return c.charCodeAt(0)-48;
  if (c>='A' && c<='Z') return c.charCodeAt(0)-65+10;
  if (c>='a' && c<='z') return c.charCodeAt(0)-97+36;
  if (c=='-') return 62;
  if (c=='_') return 63;
  return 0;
}

function decode64(data) {
  var pos = 0;
  var ss = "";
  for (i=0; i<data.length; i+=4) {
    var c1 = decode6bit(data.substring(i,i+1));
    var c2 = decode6bit(data.substring(i+1,i+2));
    var c3 = decode6bit(data.substring(i+2,i+3));
    var c4 = decode6bit(data.substring(i+3,i+4));
    ss += String.fromCharCode((c1 << 2) | (c2 >> 4));
    ss += String.fromCharCode(((c2 & 0x0F) << 4) | (c3 >> 2));
    ss += String.fromCharCode(((c3 & 0x3) << 6) | c4);
  }
  return decodeURIComponent(escape(RawDeflate.inflate(ss)));
}

function encode64(data) {
  r = "";
  for (i=0; i<data.length; i+=3) {
    if (i+2==data.length) {
      r +=append3bytes(data.charCodeAt(i), data.charCodeAt(i+1), 0);
    } else if (i+1==data.length) {
      r += append3bytes(data.charCodeAt(i), 0, 0);
    } else {
      r += append3bytes(data.charCodeAt(i), data.charCodeAt(i+1), data.charCodeAt(i+2));
    }
  }
  return r;
}

function append3bytes(b1, b2, b3) {
  c1 = b1 >> 2;
  c2 = ((b1 & 0x3) << 4) | (b2 >> 4);
  c3 = ((b2 & 0xF) << 2) | (b3 >> 6);
  c4 = b3 & 0x3F;
  r = "";
  r += encode6bit(c1 & 0x3F);
  r += encode6bit(c2 & 0x3F);
  r += encode6bit(c3 & 0x3F);
  r += encode6bit(c4 & 0x3F);
  return r;
}

function encode6bit(b) {
  if (b < 10) return String.fromCharCode(48 + b)
  b -= 10
  if (b < 26) return String.fromCharCode(65 + b)
  b -= 26
  if (b < 26) return String.fromCharCode(97 + b)
  b -= 26;
  if (b == 0) return '-'
  if (b == 1) return '_'
  return '?'
}

function compress(s) {
  s = unescape(encodeURIComponent(s));
  return encode64(RawDeflate.deflate(s, 9))
}
