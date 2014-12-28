describe('demolish', function () {
  'use strict';

  var EventEmitter = require('events').EventEmitter
    , assume = require('assume')
    , demolish = require('./');

  it('is exported as a function', function () {
    assume(demolish).is.a('function');
  });

  it('returns a function when executed', function () {
    assume(demolish()).is.a('function');
  });

  it('will emit a destroy event', function (next) {
    function Foo() {
      this.bar = 1;
    }

    Foo.prototype.__proto__ = EventEmitter.prototype;
    Foo.prototype.destroy = demolish('bar');

    var foo = new Foo();
    foo.on('destroy', next);

    assume(foo.destroy).is.a('function');
    foo.destroy();
    assume(foo.bar).equals(null);
  });

  it('calls the destroy method of things', function (next) {
    function Foo() {
      this.bar = {
        destroy: next
      };
    }

    Foo.prototype.__proto__ = EventEmitter.prototype;
    Foo.prototype.destroy = demolish('bar');

    var foo = new Foo();

    assume(foo.destroy).is.a('function');
    foo.destroy();
    assume(foo.bar).equals(null);
  });

  it('returns true on first destroy and false on second', function (next) {
    function Foo() {
      this.bar = 1;
    }

    Foo.prototype.__proto__ = EventEmitter.prototype;
    Foo.prototype.destroy = demolish('bar');

    var foo = new Foo();

    foo.on('destroy', function () {
      assume(foo.destroy()).is.false();

      next();
    });

    assume(foo.destroy()).is.true();
  });
});
