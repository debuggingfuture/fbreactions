var Tracker = require('./common/tracker').Tracker;
var _ = require('lodash');
var Promise = require("bluebird");
var moment = require('moment');
var api = require('./common/api');
var getStartEndOfDayByDayOffset = require('time').getStartEndOfDayByDayOffset;

exports.handle = function(e, ctx,cb) {
  console.log(e);
  console.log(e.params.querystring.location);
  console.log(ctx);
  var start = getStartEndOfDayByDayOffset(7)[0];
  var end =   getStartEndOfDayByDayOffset(0)[1];

  return api.cacheRead(e.params.querystring.location,start,end)
  .then(function (result) {
    console.log(result);
    ctx.done(null, result);
  });
}
