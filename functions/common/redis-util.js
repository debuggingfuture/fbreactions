var redis = require('redis');
var bluebird = require('bluebird');

var initRedis = function () {

  bluebird.promisifyAll(redis.RedisClient.prototype);
  bluebird.promisifyAll(redis.Multi.prototype);
  return redis;
}

var redis = initRedis();
function initClient(){
  return redis.createClient({host:process.env.REDIS_HOST});
}


function multiHgetallAsync(ids) {
  var multi = client.multi();
  _.forEach(ids,function (ids) {
    multi.hgetall(ids);
  });
  return multi.execAsync()
}


module.exports = {
  initRedis:initRedis,
  initClient:initClient,
  multiHgetallAsync:multiHgetallAsync
}
