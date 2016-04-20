require('dotenv').config();
var rp = require('request-promise');
var _ = require('lodash');
var appId = process.env.FB_APP_ID;
var secret =  process.env.FB_APP_SECRET;
var access_token = appId + '|' + secret;;

var winston = require('winston');
var initRedis = function () {
  var redis = require('redis');
  var bluebird = require('bluebird');

  bluebird.promisifyAll(redis.RedisClient.prototype);
  bluebird.promisifyAll(redis.Multi.prototype);
  return redis;
}
var redis = initRedis();
client = redis.createClient({host:process.env.REDIS_HOST});

var endpointConfig ={
  'reactions':{
    endpoint:'<%= postId %>/reactions',
    defaultParams:{
      'limit':1000,
      'summary':true
    }
  },
  'page': {
    endpoint:'<%= pageId %>',
    defaultParams:{
      'fields':'posts.limit(100)'
    }
  }
}

var pages ={
  'tw':{
    'appledaily.tw':'232633627068'
  },
  'hk':{
    'hk.nextmedia':'105259197447'
  }
}

function getUrlByEndpoint(endpoint,endpointParams){
  var template = 'https://graph.facebook.com/v2.6/';
  return _.template(template+endpointConfig[endpoint]['endpoint'])(endpointParams);
}


var apiFactory = function(endpoint){
  return function(defaultParams, params){
    var endpointUrl = getUrlByEndpoint(endpoint,params);
    params= _.assign(defaultParams,params)
    params['access_token']=access_token;
    return rp.get({
      uri:endpointUrl,
      qs:params,
      json:true
    });
  }
}
var FbAPI = {};
Object.keys(endpointConfig).forEach(function(key){
  var config = endpointConfig[key];
  FbAPI[key]=apiFactory(key).bind(this, config['defaultParams']);
});


function Tracker(setKey){
  function fetchAndStorePosts(pageId){
    return FbAPI['page']({'pageId':pageId})
    .then(function(data){
      Promise.all(_.map(data.posts.data, function(post){
        var created_time = Date.parse(post.created_time);
        return client.zaddAsync(setKey, -created_time, post.id);
      }));
    });
  }

  //Alternative:
  // posts - batch req
  // res   - batch res
  //       - batch follow
  // batch API count rate limit separately
  // so only useful to save HTTP overhead
  function countReactions(postId){

    // can only batch 1 level deep so two pages at once only
    // http://stackoverflow.com/questions/7196836/batch-paged-requests
    function countAndFollow(counts, data){
      _.forEach(data.data,function (reaction) {
        counts[reaction.type]++;
      });
      if(data.summary){
        counts['total']=data.summary.total_count;
      }
      counts['updated_at']= Date.now();
      if(data.paging && data.paging.next){
        return rp.get({
          uri:data.paging.next,
          json:true
        })
        .then(countAndFollow.bind(undefined,counts));
      }else{
        return counts;
      }
    }

    return FbAPI['reactions']({postId:postId}).then(function (data) {
      return countAndFollow(_.clone(initCount),data);
    });
  }

  function countAndStoreReactions(postId){
    winston.log('info','countAndStoreReactions: %s', postId);
    return countReactions(postId).then(function (counts) {
      var keyValues = _.flatten(_.zip(_.keys(counts),_.values(counts)));
      // expensive crawl so persist indivudally
      winston.log('info','Update postId: %s with ',postId,counts);
      return client.hmsetAsync(postId,keyValues);
    })

  }

  //problem: keep adding during the process
  function loadLatestPosts(count,match){
    if(!count){
      count=1000;
    }
    if(!match){
      match='*';
    }
    //Problem: seems the count of scan don't really work
    return client.zscanAsync(setKey,0,'MATCH', match,'COUNT',count)
    .then(function (data) {
      console.log(data[1].length);
      //TODO need if need of cursor
      var cursor = data[0];
      return data[1];
    });
  }

  function aggReactionsForLatestPost(postsLimit,pageId) {
    var match = pageId+'_*';
    winston.log('info','aggregate with match %s', match);
    return loadLatestPosts(postsLimit,match)
    .then(function (posts) {
      var postIds = [];
      if(!_.isEmpty(posts)){
        postIds = _groupByIndex(_.take(posts,postsLimit*2),function (i) {
          return i % 2;
        })[0];
      }
      //use take as work around at the moment
      console.log(postIds);
      winston.log('info','counting no. of ids: %s',postIds.length);
      return multiHgetallAsync(postIds)
      .then(function (countsOfPosts) {
        winston.log('info','got result from redis',countsOfPosts.length,countsOfPosts);
        return sumReactions(countsOfPosts);
      });
    });
  }

  function fetchLatestPostIds(){
    return client.zrangeAsync(setKey,1,100);
  }


  // Both the token bucket and rate limiter should be used with a message queue or some way of preventing multiple simultaneous calls to removeTokens().
  // countAndStoreReactions()
  //can't just fail if reach limit - starvation
  function countAndStoreForLatestPost(){
    fetchLatestPostIds()
    .then(function (ids) {
      console.log(ids);
      thottling(ids, function (id) {
        countAndStoreReactions(id);
      });
    });
  }


  return {
    fetchAndStorePosts:fetchAndStorePosts,
    fetchLatestPostIds:fetchLatestPostIds,
    countReactions:countReactions,
    countAndStoreForLatestPost:countAndStoreForLatestPost,
    countAndStoreReactions:countAndStoreReactions,
    loadLatestPosts:loadLatestPosts,
    aggReactionsForLatestPost:aggReactionsForLatestPost
  }
}

//Same as fb
function generatePostKey(pageId, postId){
  return [pageId,postId].join('_');
}

function getId(resId){
  return resId.split('_')[1];
}


var initCount = {};
// 'NONE',
var REACTION_TYPES=['LIKE','LOVE','WOW','HAHA','SAD','ANGRY'];
_.forEach(REACTION_TYPES,function (reaction) {
  initCount[reaction]=0;
});




function _groupByIndex(collection,cb){
  var result = {};
  _.forEach(collection,function (value,i) {
    var key = cb(i);
    if (_.has(result, key)) result[key].push(value); else result[key] = [value];
  });
  return result;
}

function multiHgetallAsync(ids) {
  var multi = client.multi();
  _.forEach(ids,function (ids) {
    multi.hgetall(ids);
  });
  return multi.execAsync()
}

function sumReactions(counts){
  var posts = counts.filter(_.isObject);
  var agg = posts.reduce(function (prev,curr) {
      var result = {};
      REACTION_TYPES.concat('total').map(function (key) {
        // ignored NaN
        result[key] = _.has(prev,key) ? (parseInt(prev[key]) + parseInt(curr[key])) : 0;
      });
      return result;
  },{});

  agg['postCount']=posts.length;
  return agg;
}



var TokenBucket = require('limiter').TokenBucket;
var BURST_RATE = 5; // 1req/ min burst rate
var FILL_RATE = 3; // 120/hour sustained rate
var bucket = new TokenBucket(BURST_RATE, FILL_RATE, 'second', null);

//TODO check call stack
function thottling(collection,cb){
  var ele = collection.pop();
  if(!ele){
    return;
  }
  // The default behaviour is to wait for the duration of the rate limiting that’s currently in effect before the callback is fired
  var isSuccess = bucket.removeTokens(1,function (err) {
    cb(ele);
    thottling(collection,cb);
  });
}
//
var twTracker = Tracker('tw');
var hkTracker = Tracker('hk');
// // fetchAndStorePosts

// twTracker.fetchAndStorePosts('232633627068');
// twTracker.countAndStoreForLatestPost();
//
//
// hkTracker.fetchAndStorePosts('105259197447');
// hkTracker.countAndStoreForLatestPost();

// hkTracker.fetchAndStorePosts('105259197447')
// .then(function () {
//   hkTracker.countAndStoreForLatestPost();
// });

function asRatio(result) {

  return _.pick(_.mapValues(result,function (v,k,o) {
      return v / o['total'];
  }),REACTION_TYPES);
}

twTracker.aggReactionsForLatestPost(100,'232633627068')
.then(function (result) {
  console.log(result);
  console.log(asRatio(result));
});
hkTracker.aggReactionsForLatestPost(1000,'105259197447')
.then(function (result) {
  // TODO ratio
  console.log(result);
    console.log(asRatio(result));
});


//should accept flexible criteria on which posts to search
//e.g. yesterday
//should ignore missed values are are latest posts not yet fetched
//can be avoided by use two sets, but less meaningful as they keep updated



//state of not yet populated?

// return new Promise(function (resolve,reject) {
//
//   var isSuccess = bucket.removeTokens(1,function (err) {
//     countAndStoreReactions(id)
//   })
//   isSuccess ? resolve() : reject();
// })

// counting
// need of throttling
// countAndStoreReactions
// pages[SET_KEY]['appledaily.tw']



module.exports = {
  initRedis:initRedis,
  FbAPI:FbAPI,
  Tracker:Tracker,
  REACTION_TYPES:REACTION_TYPES,
  _groupByIndex:_groupByIndex,
  multiHgetallAsync:multiHgetallAsync,
  pages:pages,
  getUrlByEndpoint:getUrlByEndpoint,
  sumReactions:sumReactions
}
