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

function objToKv(obj) {
  return _.flatten(_.zip(_.keys(obj),_.values(obj)));
}

function hmsetObjAsync(client, key,obj) {
  var keyValues = objToKv(obj);
  return client.hmsetAsync(key,keyValues);
}


function multiHgetallAsync(client, ids) {
  var multi = client.multi();
  _.forEach(ids,function (id) {
    multi.hgetall(id);
  });
  return multi.execAsync()
}


module.exports = {
  initRedis:initRedis,
  initClient:initClient,
  multiHgetallAsync:multiHgetallAsync,
  objToKv:objToKv,
  hmsetObjAsync:hmsetObjAsync
}
