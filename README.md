# demolish

[![Made by unshift][made-by]](http://unshift.io)[![Version npm][version]](http://browsenpm.org/package/demolish)[![Build Status][build]](https://travis-ci.org/unshiftio/demolish)[![Dependencies][david]](https://david-dm.org/unshiftio/demolish)[![Coverage Status][cover]](https://coveralls.io/r/unshiftio/demolish?branch=master)[![IRC channel][irc]](http://webchat.freenode.net/?channels=unshift)

[made-by]: https://img.shields.io/badge/made%20by-unshift-00ffcc.svg?style=flat-square
[version]: https://img.shields.io/npm/v/demolish.svg?style=flat-square
[build]: https://img.shields.io/travis/unshiftio/demolish/master.svg?style=flat-square
[david]: https://img.shields.io/david/unshiftio/demolish.svg?style=flat-square
[cover]: https://img.shields.io/coveralls/unshiftio/demolish/master.svg?style=flat-square
[irc]: https://img.shields.io/badge/IRC-irc.freenode.net%23unshift-00a8ff.svg?style=flat-square

Demolish is a small module which helps you clean up, release and destroy your
created instances.

## Install

This module is intended for Node.js and browserify usage and can be installed
using:

```
npm install --save demolish
```

## Usage

The module is exported as function and be required as following:

```js
'use strict';

var demolish = require('demolish');
```

The `demolish` function returns a function which will destroy the specified
properties from your instance.

```js
function Foo() {
  this.bar = 1;
  this.banana = new Banana();
}

Foo.prototype.destroy = demolish('foo banana');
```

In the example above we've created a new `destroy` method on our `Foo` class.
Once the method is called it will set the `bar` property to `null` and check if
`banana` also has a `destroy` method, if so, it will call that and set it to
`null` after execution.

After everything is cleaned we will emit a `destroy` event if there is an `emit`
method available.

The `destroy` method will automatically prevent double execution by checking if
the first supplied property is still active on the prototype. So in the example
above it will check if `foo` is not `null`.

## License

MIT
