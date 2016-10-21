var FbAPI = require('../common/fb-api').FbAPI
var redisUtil = require('../common/redis-util')
var client = redisUtil.initClient()
var REACTION_TYPES = require('../common/meta').REACTION_TYPES
var _ = require('lodash')

var moment = require('moment')

function asRatio (reactions, total) {
  return _.pick(_.mapValues(reactions, function (v, k, o) {
    return v / total
  }), REACTION_TYPES)
}

function _locationKey (location) {
  return location + '_result'
}
function _dateRangeKey (start, end) {
  return [start, end].join('_')
}
// fetch page again for content before write
// practically store daily now but support range for future
function cacheWrite (location, start, end, resultByDateRange) {
  var key = _locationKey(location)
  var dateRangeKey = _dateRangeKey(start, end)

  console.log('Write to cache' + key)
  return client.hmsetAsync(key, dateRangeKey, JSON.stringify(resultByDateRange))
}

// TODO true limit by range, now take 7 days

function cacheRead (location, start, end) {
  var key = _locationKey(location)
  var days = Math.ceil((end - start) / 86400000)
  // TODO refactor as duplicated
  var offset = moment().diff(moment(end).startOf('day'), 'days')
  console.log('read for ' + days + 'offset:' + offset)
  var dateRangekeys = _.range(0, days).map(function (d) {
    var start = moment().startOf('day').subtract(offset + d, 'days').format('x')
    var end = moment().endOf('day').subtract(offset + d, 'days').format('x')
    return _dateRangeKey(start, end)
  })
  console.log(dateRangekeys)
  return client.hmgetAsync(key, dateRangekeys)
    .then(function (data) {
      return _.zipObject(dateRangekeys, _.map(data, JSON.parse))
    })
}

// TODO together 1 structure or separate? separate for now as past data
function metaKey (id) {
  return id + '_meta'
}

function loadPostsMetadata (postIds) {
  return redisUtil.multiHgetallAsync(client, postIds.map(metaKey))
    .then(function (data) {
      return _.keyBy(_.compact(data), 'id')
    })
}
function resultByDateRange (location, start, end, aggReactions) {
  // TODO _.invokeMap([{'a':1},{'b':1}],_.get,'b')
  var ids = _.map(aggReactions['tops'], 'id')
  return loadPostsMetadata(ids)
    .then(function (meta) {
      aggReactions['tops'] = _.map(aggReactions['tops'], function (top, i) {
        var extra = meta[top.id] ? meta[top.id] : {}
        return _.assign(top, extra)
      })
      aggReactions['ratio'] = asRatio(aggReactions['reactions'], aggReactions['summary']['total'])
      return aggReactions
    })
}

module.exports = {
  resultByDateRange: resultByDateRange,
  loadPostsMetadata: loadPostsMetadata,
  cacheWrite: cacheWrite,
  cacheRead: cacheRead,
  asRatio: asRatio
}
