require('dotenv').config();
var index = require('./index');
var getUrlByEndpoint = index.getUrlByEndpoint;
var fetchLatestPostIds = index.fetchLatestPostIds;
var _ = require('lodash');

//
// var redis = index.initRedis();
// client = redis.createClient({host:'192.168.99.100'});


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
