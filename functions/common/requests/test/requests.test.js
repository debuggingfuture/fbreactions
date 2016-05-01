describe('requests', function () {
  'use strict';

  var requests = require('../')
    , assume = require('assume');

  it('is exported as function', function () {
    assume(requests).is.a('function');
  });
});
