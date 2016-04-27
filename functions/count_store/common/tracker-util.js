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
//TODO refactor
function initCountWithPostCount() {
  var init = initCount();
  init['postCount']=0;
  init['tops']=[];
  return init;
}

function _getEleOrPath(ele,path) {
  return path ? _.get(ele,path) :ele;
}

function _insertIfTops(sortedTops,size,ele,path) {
  var result = sortedTops;
  var value = _getEleOrPath(ele,path);
  _.some(sortedTops,function (exist,i,arr) {
    var isLarger = value > _getEleOrPath(exist,path);
    if(isLarger){
      result.splice(i,0,ele);
      result.pop();
    }
    return isLarger;
  });
  if(result.length<size){
    return result.concat(ele);
  }
  return result;
}

//TODO to pull up for parseInt
function findLargestReaction(countByReaction) {
  return _.chain(countByReaction)
  .pick(_.without(REACTION_TYPES,'LIKE'))
  .toPairs()
  .maxBy(function (pair) {
    return pair[1];
  })
  // .map(function (pair) {
  //   pair[1]=parseInt(pair[1]);
  //   return pair;
  // })
  .value();
}

//potential: Top by count; top by type
//TODO don't distinugihs for unique id now
function sumReactionsWithTop(ids, counts) {
  var sortedTops = [];
  var total = 0;
  var agg = _.reduce(counts,function (prev,curr,i) {
    var curr = _.mapValues(curr,function (v) {
      return parseInt(v);
    })
    if(!_.isObject(curr)){
      return prev;
    }
    var result={};

    REACTION_TYPES.concat('total').map(function (key) {
      // ignored NaN
      result[key] = parseInt(prev[key]) + parseInt(curr[key]);
    });
    var largestPair = findLargestReaction(curr);
    var currObj = {
      id:ids[i],
      type:largestPair[0],
      count:largestPair[1]
    };
    sortedTops = _insertIfTops(sortedTops,3,currObj,'count');
    result['postCount']=result['postCount']+1;
    return result;
  },initCountWithPostCount());

  agg['tops']=sortedTops;
  return agg;
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
  initCountWithPostCount:initCountWithPostCount,
  sumReactions:sumReactions,
  findLargestReaction:findLargestReaction,
  _insertIfTops:_insertIfTops,
  sumReactionsWithTop:sumReactionsWithTop,
  asRatio:asRatio
}
