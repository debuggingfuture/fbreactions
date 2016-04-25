var _ = require('lodash');
var REACTION_TYPES = require('../common/fb-api').REACTION_TYPES;

function _groupByIndex(collection,cb){
  var result = {};
  _.forEach(collection,function (value,i) {
    var key = cb(i);
    if (_.has(result, key)) result[key].push(value); else result[key] = [value];
  });
  return result;
}

function initCount(){
  return _.reduce(REACTION_TYPES.concat('total'),function (result,reaction) {
   result[reaction]=0;
   return result;
 },{});
}
function sumReactions(counts){
  var posts = counts.filter(_.isObject);
  var agg = posts.reduce(function (prev,curr) {
      var result = {};
      REACTION_TYPES.concat('total').map(function (key) {
        // ignored NaN
        result[key] = parseInt(prev[key]) + parseInt(curr[key]);
      });
      return result;
  },initCount());

  agg['postCount']=posts.length;
  return agg;
}

function asRatio(result) {

  return _.pick(_.mapValues(result,function (v,k,o) {
      return v / o['total'];
  }),REACTION_TYPES);
}

module.exports = {
  _groupByIndex:_groupByIndex,
  initCount:initCount,
  sumReactions:sumReactions,
  asRatio:asRatio
}
