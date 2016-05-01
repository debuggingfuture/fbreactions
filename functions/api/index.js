var Tracker = require('./common/tracker').Tracker;
var _ = require('lodash');
var Promise = require("bluebird");
var moment = require('moment');
var api = require('./common/api');

exports.handle = function(e, ctx,cb) {
  console.log(e);
  console.log(e.params.querystring.location);
  console.log(ctx);
  var start = moment().startOf('day').subtract(7,'days').format('x');
  var end =   moment().endOf('day').subtract(0,'days').format('x');
  return api.cacheRead(e.params.querystring.location,start,end)
  .then(function (result) {
    console.log(result);
    // cb(null,result);
    ctx.done(null, result);
  });
}
