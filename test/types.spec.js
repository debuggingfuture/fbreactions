var Ajv = require('ajv');
var ajv = new Ajv(); // options can be passed, e.g. {allErrors: true}
var ReactionsType = require('../common/types-reactions');
var ApiType = require('../common/types-api');
var PostType = require('../common/types-post')
var fixture = require('./fixture-api.js');
describe('types', function() {

  describe('reactions', function() {
    it('validate reaction types ', function () {
      var reactions = _.cloneDeep(fixture["1480348800000_1480435199999"].reactions);
      var isValid = ajv.validate(ReactionsType.schema, reactions);
      console.error(ajv.errors);
      expect(isValid).to.be.true;
    });
    it('invalidate wrong reaction types ', function () {
      var reactions = _.cloneDeep(fixture["1480348800000_1480435199999"].reactions);
      reactions.HAHA = '0';
      var isValid = ajv.validate(ReactionsType.schema, reactions);
      console.error(ajv.errors);
      expect(isValid).to.be.false;
    });
  });

  describe('post', function() {
    it('validate post', function () {
      var post = _.cloneDeep(fixture["1480348800000_1480435199999"].tops)[0];
      var isValid = ajv.validate(PostType.schema, post);
      console.error(ajv.errors);
      expect(isValid).to.be.true;
    });
    it('invalidate incorrect post', function () {
      var post = _.cloneDeep(fixture["1480348800000_1480435199999"].tops)[0];
      post.type = 'HIHI'
      var isValid = ajv.validate(PostType.schema, post);
      console.error(ajv.errors);
      expect(isValid).to.be.false;
    });
  });

  describe('api', function() {
    it('validate api responses', function () {
      var apiResponse = _.cloneDeep(fixture);
      var isValid = ajv.validate(ApiType.schema, apiResponse);
      console.error(ajv.errors);
      expect(isValid).to.be.true;
    });

    it('invalidate incorrect api responses', function () {
      var apiResponse = _.cloneDeep(fixture);
      apiResponse["1480348800000_1480435199999"].tops = null
      var isValid = ajv.validate(ApiType.schema, apiResponse);
      console.error(ajv.errors);
      expect(isValid).to.be.false;
    });

  });
});
