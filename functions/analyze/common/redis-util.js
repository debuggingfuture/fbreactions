var redis = require('redis');
var bluebird = require('bluebird');
var _ = require('lodash');
var initRedis = function () {

  bluebird.promisifyAll(redis.RedisClient.prototype);
  bluebird.promisifyAll(redis.Multi.prototype);
  return redis;
}

function initClient(){
  var redis = initRedis();
  var client = redis.createClient({host:process.env.REDIS_HOST,connect_timeout:10000});
  client.on("error", function (err) {
    console.log("Redis Error " + err);
  });
  return client;
}


function multiHgetallAsync(client, ids) {
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
