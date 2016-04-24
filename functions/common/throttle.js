var TokenBucket = require('limiter').TokenBucket;
function Throttle(burstRate, fillRate){
  var bucket = new TokenBucket(burstRate, fillRate, 'second', null);
  //TODO check call stack
  function next(collection,cb){
    var ele = collection.pop();
    if(!ele){
      return;
    }
    // The default behaviour is to wait for the duration of the rate limiting that’s currently in effect before the callback is fired
    var isSuccess = bucket.removeTokens(1,function (err) {
      cb(ele);
      next(collection,cb);
    });
  }
  return {
    next:next
  }

}

module.exports={
  Throttle:Throttle
}
