var SET_KEY = 'test';
var Tracker = require('../common/tracker').Tracker;
var tracker = Tracker(SET_KEY);
var REACTION_TYPES = require('../common/fb-api').REACTION_TYPES;
var pages = require('../common/pages');
var trackerUtil = require('../common/tracker-util');
var client = require('../common/redis-util').initClient();
var moment = require('moment');
describe('should fetch and store #limit posts', function() {

  //TODO lower limit for page
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
      var reactionsTotal = _.chain(counts).pick(REACTION_TYPES).values().sum().value();
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

describe('it should count by date range',function () {
  var start = moment().startOf('day').subtract(0,'days').format('x');
  var end =   moment().endOf('day').subtract(0,'days').format('x');
  console.log('start:'+moment(parseInt(start)).format());
  console.log('end:'+moment(parseInt(end)).format());
  beforeEach(function() {
    console.log('fetchAndStorePosts');
    return client.delAsync(SET_KEY)
    .then(tracker.fetchAndStorePosts.bind(this,'232633627068'))
  });

  it('loadPostsByDateRange should return records just fetched ',function () {

    tracker.loadPostsByDateRange(start, end)
    .then(function (data) {
      expect(data.length).to.equal(100);
    });
  })

  it('aggReactionsForPostsByDateRange  ',function () {
    return tracker.aggReactionsForPostsByDateRange(start,end)
    .then(function (data) {
      expect(data).to.not.eql(trackerUtil.initCountWithPostCount());
    })
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


  it('aggReactionsForLatestPost will agg only for matched pageId',function (done) {
    this.timeout(8000);
    return tracker.aggReactionsForLatestPost(5,'notExistPageId')
    .then(function (data) {
      console.log(data);
      expect(data).to.eql(trackerUtil.initCountWithPostCount());
      done();
    })
  });
  it('aggReactionsForLatestPost will return summary',function (done) {
    this.timeout(8000);

    return tracker.loadLatestPosts()
    .then(function (posts) {
      var postIds = trackerUtil._groupByIndex(posts,function (i) {
        return i % 2;
      })[0];

      return Promise.all(_.take(postIds,5).map(function (postId) {
        return tracker.countAndStoreReactions(postId);
      }));
    })
    .then(tracker.aggReactionsForLatestPostByPageId.bind(this,5,'232633627068'))
    .then(function (data){
      // TODO unit test counting separately
      console.log(data);
      expect(_.keys(data)).to.eql(REACTION_TYPES.concat('total').concat('postCount').concat('tops'));
      expect(data['LIKE']).to.above(1);
      done();
    })
  })
});
