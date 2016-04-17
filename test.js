require('dotenv').config();
var chai = require('chai');
var expect = chai.expect;
var chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);
var index = require('./index');
var getUrlByEndpoint = index.getUrlByEndpoint;
var FbAPI = index.FbAPI;
var pages = index.pages;
var fetchLatestPostIds = index.fetchLatestPostIds;
var countReactions = index.countReactions;
var redis = require('redis');
var bluebird = require('bluebird');

bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);

var _ = require('lodash');


client = redis.createClient({host:'192.168.99.100'});


describe('#getUrlByEndpoint', function() {
  it('should return correct endpoint', function () {
    expect(getUrlByEndpoint('page',{'pageId':123})).to.equal('https://graph.facebook.com/v2.6/123');
  });
});

describe('#FbAPI', function() {
  it('should return correct endpoint', function () {
    expect(typeof(FbAPI['page'])).to.equal('function');
    expect(FbAPI['page']({'pageId':123}).uri.pathname).to.equal('/v2.6/123');
  });
  describe('integration test', function() {
    it('page should return result promise', function () {
      var id =232633627068;
      return FbAPI['page']({'pageId':id}).then(function(data){
        expect(data.posts.data.length).to.equal(100);
        expect(parseInt(data.id)).to.equal(id);
      });
    });
    it('reactions should return result promise', function (done) {
      this.timeout(15000);
      var id ='232633627068_10154431772567069';
      // in practice size>2000 result in 500 error
      var size = 1000;
      return FbAPI['reactions']({'postId':id}).then(function(data){
        expect(data.summary.total_count).to.be.above(4000);
        expect(parseInt(data.data.length)).to.equal(size);
        //TODO check is url, undefined if no next
        expect(typeof(data.paging.next)).to.equal('string');
        done();
      });
    });
  });
});


describe('#redis', function() {
  beforeEach(function() {
    return client.delAsync('tw');
  });
  afterEach(function() {
    return client.delAsync('tw');
  });

  describe('integration test', function() {
    it('should set a key', function () {
      // client.set("string key", "string val", redis.print);
      client.zadd('tw', -Date.now(), '123_456');
      return client.zcardAsync('tw').then(function (data) {
        expect(data).to.equal(1);
      });
    });
  });
});

describe('should fetch and store #limit posts', function() {

  it('#fetchAndStorePosts should store #limit posts', function () {
    // client.set("string key", "string val", redis.print);
    return index.fetchAndStorePosts(pages['tw']['appledaily.tw'])
    .then(function(data){
      return client.zcardAsync('tw')
      .then(function (data) {
        expect(data).to.equal(100);
      });
    });
  });

  it('#fetchLatestPostIds should load latest posts', function () {
    // client.set("string key", "string val", redis.print);
    return fetchLatestPostIds()
    .then(function(data){
      return data;
    });
  });

  it('#countReactions',function (done) {
    this.timeout(5000);
    return countReactions('232633627068_10154431772567069')
      .then(function(counts){
        expect(counts['LIKE']).to.be.above(900);
        var reactionsTotal = _.chain(counts).values().sum().value()-counts.total
        console.log(_.values(counts));
        // There are some delay on total count and reaction objects
        expect(reactionsTotal-counts.total).to.below(10);
        done();
      });
    // countReactions
  });

  it('#countAndStoreReactions',function (done) {
    var postId = '232633627068_10154431772567069';
    this.timeout(5000);
    return index.countAndStoreReactions(postId)
    .then(function () {
        client.hlenAsync(postId).then(function (data) {
          expect(data).to.equal(7);
          client.hgetAsync(postId,'LIKE').then(function (count) {
            expect(count).to.above(1000);
            done();
          })
        });
    })
  })

});



// client.hset("hash key", "hashtest 1", "some value", redis.print);
