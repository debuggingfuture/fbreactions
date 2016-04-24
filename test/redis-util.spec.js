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
