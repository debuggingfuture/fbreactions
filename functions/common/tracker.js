var _ = require('lodash');
var REACTION_TYPES = require('../common/fb-api').REACTION_TYPES;
var util = require('../common/tracker-util');
var FbAPI = require('../common/fb-api').FbAPI;
var rp = require('request-promise');
var winston = require('winston');
var Throttle= require('../common/throttle').Throttle;
function Tracker(setKey){
  function fetchAndStorePosts(pageId){
    winston.log('info','fetchAndStorePosts',pageId);
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
      return countAndFollow(_.clone(util.initCount()),data);
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
        postIds = util._groupByIndex(_.take(posts,postsLimit*2),function (i) {
          return i % 2;
        })[0];
      }
      //use take as work around at the moment
      console.log(postIds);
      winston.log('info','counting no. of ids: %s',postIds.length);
      return multiHgetallAsync(postIds)
      .then(function (countsOfPosts) {
        winston.log('info','got result from redis',countsOfPosts.length,countsOfPosts);
        return util.sumReactions(countsOfPosts);
      });
    });
  }

  function fetchLatestPostIds(){
    return client.zrangeAsync(setKey,1,100);
  }


  var BURST_RATE = 5; // 1req/ min burst rate
  var FILL_RATE = 3; // 120/hour sustained rate
  var throttle = Throttle(BURST_RATE,FILL_RATE);

  // Both the token bucket and rate limiter should be used with a message queue or some way of preventing multiple simultaneous calls to removeTokens().
  // countAndStoreReactions()
  //can't just fail if reach limit - starvation
  function countAndStoreForLatestPost(){
    winston.log('info','countAndStoreForLatestPost');
    fetchLatestPostIds()
    .then(function (ids) {
      console.log(ids);
      throttle.next(ids, function (id) {
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

module.exports={
  Tracker: Tracker
}
