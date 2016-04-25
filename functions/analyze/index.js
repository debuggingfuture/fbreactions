var winston = require('winston');
var Tracker = require('./common/tracker').Tracker;
var trackerUtil = require('./common/tracker-util');
var pages = require('./common/pages');
var _ = require('lodash');
var Promise = require("bluebird");
var moment = require('moment');
// var getRandomByWeight = require('random').getRandomByWeight;
// var rp = require('request-promise');

exports.handle = function(e, ctx) {
  // ctx.succeed({ hello: e.name })
  Promise.all(['hk','tw'].map(function (location) {
    var tracker = Tracker(location);
    winston.log('info','agg for %s',location);

    // tracker.aggReactionsForLatestPost(1000000,'*')
    // .then(function (result) {
    //   winston.log('info','Agg: %s',location,result);
    //   console.log(trackerUtil.asRatio(result));
    // });
    return Promise.all([0,1,2,3].map(function (d) {
      var start = moment().startOf('day').subtract(d,'days').format('x');
      var end =   moment().endOf('day').subtract(d,'days').format('x');

      return tracker.aggReactionsForPostsByDateRange(start,end)
      .then(function (result) {
        console.log('location:'+location);
        console.log('start:'+moment(parseInt(start)).format());
        console.log('end:'+moment(parseInt(end)).format());
        console.log(result);
        console.log(trackerUtil.asRatio(result));
        return ;
      });
    }));


    // _.values(pages[location]).map(function (id) {
    //   tracker.aggReactionsForLatestPost(10000,id)
    //   .then(function (resuxlt) {
    //     winston.log('info',id,result);
    //     console.log(trackerUtil.asRatio(result));
    //   });
    // });

  })
).then(function () {
  ctx.done();
});



}
