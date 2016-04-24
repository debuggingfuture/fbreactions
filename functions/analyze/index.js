exports.handle = function(e, ctx) {
  // ctx.succeed({ hello: e.name })
  ['hk','tw'].map(function (location) {
    var tracker = Tracker(location);
    _.values(pages[location]).map(function (id) {
      tracker.aggReactionsForLatestPost(10000,id)
      .then(function (result) {
        winston.log('info',id,result);
        console.log(trackerUtil.asRatio(result));
      });
    });

  });
}
