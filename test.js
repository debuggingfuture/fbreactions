require('dotenv').config();
var index = require('./index');
var getUrlByEndpoint = index.getUrlByEndpoint;
var fetchLatestPostIds = index.fetchLatestPostIds;
var _ = require('lodash');

describe('redis helper',function () {
  beforeEach(function () {
    Promise.all(_.range(10000).map(function (i) {
      return client.delAsync(i);
    }))
    .then(function () {
      var multi = client.multi();
      _.range(10000).map(function () {
        multi.hset(i,'key',i);
      });
      return multi.execAsync();
    })

  })
  it('multiHgetallAsync',function () {
    multiHgetallAsync(client, _.range(10000))
    .then(function (data) {
      expect(data.length).equal(10000);
    })
  })
})




// client.hset("hash key", "hashtest 1", "some value", redis.print);
