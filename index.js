'use strict';

/**
 * Create a function that will cleanup the instance.
 *
 * @param {Array|String} keys Properties on the instance that needs to be cleared.
 * @param {Object} options Additional configuration.
 * @returns {Function} Destroy function
 * @api public
 */
module.exports = function demolish(keys, options) {
  if ('string' === typeof keys) keys = keys.split(/[\,|\s]+/);
  options = options ||  {};
  keys = keys || [];

  return function destroy() {
    var selfie = this
      , i = 0
      , prop;

    if (!selfie[keys[0]]) return false;

    for (; i < keys.length; i++) {
      prop = keys[i];

      if (selfie[prop] && 'function' === typeof selfie[prop].destroy) {
        selfie[prop].destroy();
      }

      selfie[prop] = null;
    }

    if (selfie.emit) selfie.emit('destroy');
    return true;
  };
};
