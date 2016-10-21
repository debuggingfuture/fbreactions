var Tracker = require('./common/tracker').Tracker
var _ = require('lodash')
var Promise = require('bluebird')
var moment = require('moment')
var api = require('./common/api')
var getStartEndOfDayByDayOffset = require('./common/time').getStartEndOfDayByDayOffset

exports.handle = function (e, ctx, cb) {
  console.log('Qs params')
  console.log(e.params.querystring)
  // Always take -7 for now, as most likely usecase is view today
  var offset = parseInt(e.params.querystring.offset) || 0
  var start = getStartEndOfDayByDayOffset(offset + 7)[0]
  var end = getStartEndOfDayByDayOffset(offset + 0)[1]

  return api.cacheRead(e.params.querystring.location, start, end)
    .then(function (result) {
      console.log(result)
      ctx.done(null, result)
    })
}
