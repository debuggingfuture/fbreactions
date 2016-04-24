var Tracker = require('./common/tracker');
var pages = require('./common/pages');

exports.handle = function(e, ctx) {
  // ctx.succeed({ hello: e.name })
  ['hk','tw'].map(function (location) {
    var tracker = Tracker(location);
    _.values(pages[location]).map(function (id) {
      tracker.fetchAndStorePosts(id)
      .then(tracker.countAndStoreForLatestPost);
    });
  });
}
