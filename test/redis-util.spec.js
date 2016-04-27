var redisUtil = require('../common/redis-util');
var initClient = redisUtil.initClient;
describe('#redis', function() {
  beforeEach(function() {
    client = initClient();
  });

  beforeEach(function() {
    return client.delAsync(SET_KEY);
  });
  afterEach(function() {
    return client.delAsync(SET_KEY);
  });

  describe('integration test', function() {
    it('should set a key', function () {
      // client.set("string key", "string val", redis.print);
      client.zadd(SET_KEY, -Date.now(), '123_456');
      return client.zcardAsync(SET_KEY).then(function (data) {
        expect(data).to.equal(1);
      });
    });
  });
});


describe('redis helper',function (done) {
  var COUNT=10000;
  beforeEach(function () {
    return Promise.all(_.range(COUNT).map(function (i) {
      return client.delAsync(i);
    }))
    .then(function () {
      var multi = client.multi();
      _.range(COUNT).map(function (i) {
        multi.hset(i,'key','value:'+i);
      });
      return multi.execAsync().then(done);
    })

  })
  it('multiHgetallAsync',function (done) {
    redisUtil.multiHgetallAsync(client, _.range(COUNT))
    .then(function (data) {
      console.log(data);
      expect(data.length).equal(COUNT);
      done();
    })
  })
})
