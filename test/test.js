/*!
 * glob-object <https://github.com/jonschlinkert/glob-object>
 *
 * Copyright (c) 2015-2017, Jon Schlinkert.
 * Released under the MIT License.
 */

'use strict';

require('mocha');
var assert = require('assert');
var glob = require('..');

var fixture = {
  a: {
    b: {
      c: 'd',
      e: 'f',
      g: 'h',
      i: {j: 'k'},
      l: {g: 'k'}
    },
    i: 'j'
  }
};

describe('glob', function() {
  it('should match properties using wildcards:', function() {
    assert.deepEqual(glob(fixture, 'a.*'), fixture);
  });

  it('should match properties using negation patterns:', function() {
    assert.deepEqual(glob(fixture, '!a'), {});
    assert.deepEqual(glob({a: {b: 'c', d: 'e'}}, ['!a', 'a.b.c']), {});
    assert.deepEqual(glob({a: {b: 'c', d: 'e'}}, ['*', '!a.*']), {a: {}});
    assert.deepEqual(glob(fixture, ['*', '!a.b.[g-l]']), {
      a: {
        b: {
          c: 'd',
          e: 'f'
        },
        i: 'j'
      }
    });
  });

  it('should match properties using multiple negation patterns:', function() {
    var obj = {a: 'a', b: 'b', c: 'c', d: 'd'};

    assert.deepEqual(glob(obj, ['*', '!a', '!b', '!c']), {d: 'd'});
    assert.deepEqual(glob(obj, ['*', '!a', '!c', '!d']), {b: 'b'});
    assert.deepEqual(glob(obj, ['*', '!a', '!b', '!c', '!d']), {});
  });

  it('should match properties using braces:', function() {
    assert.deepEqual(glob(fixture, '*.{b,i}'), fixture);
    assert.deepEqual(glob(fixture, 'a.*.{c,e}'), {a: {b: {c: 'd', e: 'f'}}});
  });

  it('should match a nested property using a wildcard:', function() {
    assert.deepEqual(glob(fixture, 'a.*.g'), {a: {b: {g: 'h'}}});
  });

  it('should match deep properties using globstars', function() {
    assert.deepEqual(glob(fixture, 'a.**.g'), {a: {b: {g: 'h', l: {g: 'k'}}}});
  });
});
