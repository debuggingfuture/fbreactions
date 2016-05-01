# AXO

[![Build Status](https://travis-ci.org/unshiftio/axo.svg?branch=master)](https://travis-ci.org/unshiftio/axo)
[![NPM version](https://badge.fury.io/js/axo.svg)](http://badge.fury.io/js/axo)
[![Coverage Status](https://img.shields.io/coveralls/unshiftio/axo.svg)](https://coveralls.io/r/unshiftio/axo?branch=master)

AXO stands for **A**ctive**XO**bject. And the sole purpose of this library is to
return the `ActiveXObject` constructor from the environment it's loaded in.
Normally you would just reference the constructor directly by simply mentioning
this constructor in your source file can [result in blocking of your
file](https://github.com/felixge/node-active-x-obfuscator#why).

There are 2 ways of tackling this issue:

1. Use the [active-x-obfuscator](https://github.com/felixge/node-active-x-obfuscator)
   and introduce another build step in your code.
2. Use `AXO` and never mention it.

## Installation

```
npm install --save axo
```

This module makes the assumption that it can be loaded in node.js/commonjs based
environment and exports it self on the `module.exports`. So using browserify for
the code makes a lot of sense here.

## Usage

```js
var AXO = require('axo');

new AXO('htmlfile');
```

## License

MIT
