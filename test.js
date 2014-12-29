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

  it('still allows destruction if prop is falsey', function () {
    function Foo() {
      this.bar = 0;
    }

    Foo.prototype.destroy = demolish('bar');

    var foo = new Foo();
    assume(foo.destroy()).equals(true);
  });

  it('doesn\'t add null properties when properties don\'t exist', function () {
    function Foo() {}

    Foo.prototype.destroy = demolish('bar, baz');

    var foo = new Foo();
    assume(foo.destroy()).equals(true);
    assume(foo.bar).equals(undefined);
    assume(foo.baz).equals(undefined);
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

  it('runs additional before hooks', function () {
    function Foo() {
      this.bar = 1;
    }

    Foo.prototype.__proto__ = EventEmitter.prototype;
    Foo.prototype.destroy = demolish('bar', {
      before: 'removeAllListeners'
    });

    var foo = new Foo();

    /* istanbul ignore next */
    foo.on('destroy', function () {
      throw new Error('I should neve be called as all events should be removed');
    });

    assume(foo.listeners('destroy').length).equals(1);
    assume(foo.destroy()).is.true();
    assume(foo.listeners('destroy').length).equals(0);
  });

  it('runs additional after hooks', function (next) {
    function Foo() {
      this.bar = 1;
    }

    Foo.prototype.__proto__ = EventEmitter.prototype;
    Foo.prototype.destroy = demolish('bar', {
      after: 'removeAllListeners'
    });

    var foo = new Foo();

    foo.on('destroy', next);

    assume(foo.listeners('destroy').length).equals(1);
    assume(foo.destroy()).is.true();
    assume(foo.listeners('destroy').length).equals(0);
  });

  it('can execute before / after functions', function (next) {
    function Foo() {
      this.bar = 1;
    }

    Foo.prototype.__proto__ = EventEmitter.prototype;
    Foo.prototype.destroy = demolish('bar', {
      after: ['removeAllListeners', function () {
        assume(this).equals(foo);
        next();
      }]
    });

    var foo = new Foo();

    foo.on('destroy', function () {});

    assume(foo.listeners('destroy').length).equals(1);
    assume(foo.destroy()).is.true();
    assume(foo.listeners('destroy').length).equals(0);
  });
});
