beforeEach(function() {
  //Not working
  require('dotenv').config({path: '../.env'});
  console.log('before every test in every file');
  chai = require('chai');
  expect = chai.expect;
  chaiAsPromised = require("chai-as-promised");
  chai.use(chaiAsPromised);
  _ = require('lodash');

  SET_KEY = 'test';
});
