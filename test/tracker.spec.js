var SET_KEY = 'test';
var Tracker = require('../common/tracker').Tracker;
var tracker = Tracker(SET_KEY);
var REACTION_TYPES = require('../common/fb-api').REACTION_TYPES;
var pages = require('../common/pages');
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
