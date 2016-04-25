var Tracker = require('./common/tracker').Tracker;
var pages = require('./common/pages');
var _ = require('lodash');
var Promise = require("bluebird");
var rp = require('request-promise');

exports.handle = function(e, ctx) {


  var locations = ['hk','tw'];
  var location = _.sample(locations);
  var pageIds = _.values(pages[location]);

  var tracker = Tracker(location);
  tracker.stats();
  console.log('tracking:'+location);
  Promise.all(
    _.values(_.sampleSize(pageIds,5)).map(function (id) {
      return tracker.fetchAndStorePosts(id)
    })
  )
  .then(tracker.countAndStoreForLatestPost)
  .finally(function () {
    console.log(arguments);
    console.log('finish')
    ctx.done();
  });
};
