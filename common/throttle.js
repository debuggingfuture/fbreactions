var Promise = require("bluebird");
var TokenBucket = require('limiter').TokenBucket;
function Throttle(burstRate, fillRate){
  var bucket = new TokenBucket(burstRate, fillRate, 'second', null);

  function promise(collection,cb){
    return new Promise(function (resolve, reject) {
        next(collection,cb,resolve);
    });

  }

  //TODO check call stack
  function next(collection,cb,resolve){
    var ele = collection.pop();
    if(!ele){
      if(resolve) resolve();
      return;
    }
    // The default behaviour is to wait for the duration of the rate limiting that’s currently in effect before the callback is fired
    var isSuccess = bucket.removeTokens(1,function (err) {
      cb(ele);
      next(collection,cb);
    });
  }
  return {
    promise:promise,
    next:next
  }

}

module.exports={
  Throttle:Throttle
}
