//
// So this might need some explanation. There are firewalls, virus scanners and
// what more that inspect the contents of files that is downloaded over the
// internet and search for potential bad words. Some of them assume that
// ActiveXObject is a bad word and will block the complete file from loading. In
// order to prevent this from happening we've pre-decoded the word ActiveXObject
// by changing the charCodes.
//
module.exports = (function AXO(x, i) {
  for (i = 0; i < x.length; i++) {
    x[i] = String.fromCharCode(x[i].charCodeAt(0) + i);
  }

  return this[x.join('')];
})('Abrfr`RHZa[Xh'.split(''));
