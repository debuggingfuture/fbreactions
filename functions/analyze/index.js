var winston = require('winston');
var Tracker = require('./common/tracker').Tracker;
var trackerUtil = require('./common/tracker-util');
var pages = require('./common/pages');
var _ = require('lodash');
var Promise = require("bluebird");
var moment = require('moment');

var api = require('./common/api');
// var getRandomByWeight = require('random').getRandomByWeight;

exports.handle = function(e, ctx,cb) {
  winston.log('info','timezone',process.env.TZ);
  // ctx.succeed({ hello: e.name })
  Promise.all(['hk','tw'].map(function (location) {
    var tracker = Tracker(location);
    winston.log('info','agg for %s',location);

    // tracker.aggReactionsForLatestPost(1000000,'*')
    // .then(function (result) {
    //   winston.log('info','Agg: %s',location,result);
    //   console.log(trackerUtil.asRatio(result));
    // });
    return Promise.all(_.range(7).map(function (d) {
      var start = moment().startOf('day').subtract(d,'days').format('x');
      var end =   moment().endOf('day').subtract(d,'days').format('x');

      return tracker.aggReactionsForPostsByDateRange(start,end)
      .then(function (aggReactions) {
        console.log('location:'+location);
        console.log('start:'+moment(parseInt(start)).format());
        console.log('end:'+moment(parseInt(end)).format());
        console.log(aggReactions);
        return api.resultByDateRange(location,start,end,aggReactions)
        .then(function (resultByDateRange) {
          console.log(resultByDateRange);
          return  api.cacheWrite(location,start,end,resultByDateRange);
        });
      });
    }));
  }))
  .catch(function (err) {
    console.error(err.stack);
    ctx.done(err);
  })
  .then(function () {
    ctx.done();
  });
}
