require('dotenv').config();
var chai = require('chai');
var expect = chai.expect;
var chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);
var index = require('./index');
var getUrlByEndpoint = index.getUrlByEndpoint;
var FbAPI = index.FbAPI;
var pages = index.pages;
var SET_KEY = 'test';
var tracker = index.Tracker(SET_KEY);
var fetchLatestPostIds = index.fetchLatestPostIds;
var _ = require('lodash');



var redis = index.initRedis();
client = redis.createClient({host:'192.168.99.100'});


//Util
describe('_groupByIndex',function () {
  it('should work for normal input',function () {
    var input = ['a','b','c','d'];
    expect(index._groupByIndex(input,function (i) {
      return i %2;
    })).to.eql({
      0:['a','c'],
      1:['b','d']
    });
  });
  it('should work for empty input',function () {
    expect(index._groupByIndex([],function (i) {
      return i %2;
    })).to.eql({});
  })
})


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
    return client.delAsync(SET_KEY);
  });
  afterEach(function() {
    return client.delAsync(SET_KEY);
  });

  describe('integration test', function() {
    it('should set a key', function () {
      // client.set("string key", "string val", redis.print);
      client.zadd(SET_KEY, -Date.now(), '123_456');
      return client.zcardAsync(SET_KEY).then(function (data) {
        expect(data).to.equal(1);
      });
    });
  });
});

describe('should fetch and store #limit posts', function() {

  it('#fetchAndStorePosts should store #limit posts', function () {
    // client.set("string key", "string val", redis.print);
    return tracker.fetchAndStorePosts(pages['tw']['appledaily.tw'])
    .then(function(data){
      return client.zcardAsync(SET_KEY)
      .then(function (data) {
        expect(data).to.equal(100);
      });
    });
  });

  it('#fetchLatestPostIds should load latest posts', function () {
    // client.set("string key", "string val", redis.print);
    return tracker.fetchLatestPostIds()
    .then(function(data){
      return data;
    });
  });

  it('#countReactions',function (done) {
    this.timeout(8000);
    return tracker.countReactions('232633627068_10154431772567069')
    .then(function(counts){
      expect(counts['LIKE']).to.be.above(900);
      var reactionsTotal = _.chain(counts).pick(index.REACTION_TYPES).values().sum().value();
      // There are some delay on total count and reaction objects
      expect(reactionsTotal-counts.total).to.below(10);
      done();
    });
  });

  it('#countAndStoreReactions',function (done) {
    var postId = '232633627068_10154431772567069';
    this.timeout(8000);
    return tracker.countAndStoreReactions(postId)
    .then(function () {
      client.hlenAsync(postId).then(function (data) {
        expect(data).to.equal(8);
        client.hgetAsync(postId,'LIKE').then(function (count) {
          expect(count).to.above(1000);
          done();
        })
      });
    })
  })

});

describe('redis helper',function () {
  beforeEach(function () {
    Promise.all(_.range(10000).map(function (i) {
      return client.delAsync(i);
    }))
    .then(function () {
      var multi = client.multi();
      _.range(10000).map(function () {
        multi.hset(i,'key',i);
      });
      return multi.execAsync();
    })

  })
  it('multiHgetallAsync',function () {
    index.multiHgetallAsync(_.range(10000))
    .then(function (data) {
      expect(data.length).equal(10000);
    })
  })
})


describe('sum reactions',function () {
  it('should add by reaction type',function () {
    var result = index.sumReactions([
      {
        LIKE: '1',
        LOVE: '0',
        WOW: '0',
        HAHA: '0',
        SAD: '0',
        ANGRY: '6',
        total: '57',
        updated_at: '1461113126588'
      },
      {
        LIKE: '2',
        LOVE: '0',
        WOW: '1',
        HAHA: '0',
        SAD: '0',
        ANGRY: '0',
        total: '76',
        updated_at: '1461113126970'
      },
      {
        LIKE: 3,
        LOVE: '3',
        WOW: '5',
        HAHA: '1',
        SAD: '3',
        ANGRY: '0',
        total: '212',
        updated_at: '1461113126668'
      }
    ]);


    expect(_.keys(result)).to.eql(index.REACTION_TYPES.concat('total'));
    expect(result['LIKE']).to.equal(6);
    expect(result['total']).to.equal(57+76+212);
  });
});
describe('it should count latest posts',function () {

  beforeEach(function() {
    return client.delAsync(SET_KEY)
    .then(tracker.fetchAndStorePosts.bind(this,'232633627068'))
    // .then(function () {
    //   // var multi = client.multi();
    //   // _.range(10000).map(function (i) {
    //   //   multi.zadd(SET_KEY,-Date.now(),i);
    //   // })
    //   // return multi.execAsync();
    // });
  });
  it('loadLatestPosts should return latest 1000 posts in store',function () {
    return tracker.loadLatestPosts(5)
    .then(function (data) {
      //200 is score(time)+key
      expect(data.length).to.above(199);
    })
  });
  // TODO correctness


  it('aggReactionsForLatestPost will agg only for matched pageId',function () {
    return tracker.aggReactionsForLatestPost(5,'notExistPageId').then(function (data) {
      expect(data).to.eql({});
      })
  });
  it('aggReactionsForLatestPost will return summary',function (done) {
    this.timeout(8000);

    return tracker.loadLatestPosts()
    .then(function (posts) {
      var postIds = index._groupByIndex(posts,function (i) {
        return i % 2;
      })[0];

      return Promise.all(_.take(postIds,5).map(function (postId) {
        return tracker.countAndStoreReactions(postId);
      }));
    })
    .then(tracker.aggReactionsForLatestPost.bind(this,5,'232633627068'))
    .then(function (data){
      // TODO unit test counting separately
      console.log(data);
      expect(_.keys(data)).to.eql(index.REACTION_TYPES.concat('total'));
      expect(data['LIKE']).to.above(1);
      done();
    })
  })
});


// client.hset("hash key", "hashtest 1", "some value", redis.print);
