var winston = require('winston');
var Tracker = require('./common/tracker').Tracker;
var trackerUtil = require('./common/tracker-util');
var pages = require('./common/pages');
var _ = require('lodash');
var Promise = require("bluebird");
// var rp = require('request-promise');

exports.handle = function(e, ctx) {
  // ctx.succeed({ hello: e.name })
  ['hk','tw'].map(function (location) {
    var tracker = Tracker(location);

    winston.log('info','agg for %s',location);

    tracker.aggReactionsForLatestPost(1000000,'*')
    .then(function (result) {
      winston.log('info','Agg: %s',location,result);
      console.log(trackerUtil.asRatio(result));
    });
    // _.values(pages[location]).map(function (id) {
    //   tracker.aggReactionsForLatestPost(10000,id)
    //   .then(function (result) {
    //     winston.log('info',id,result);
    //     console.log(trackerUtil.asRatio(result));
    //   });
    // });

  });



}
