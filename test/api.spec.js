var api = require('../common/api.js')
var moment = require('moment')
var redisUtil = require('../common/redis-util')
var client = redisUtil.initClient()
var moment = require('moment')
var getStartEndOfDayByDayOffset = require('../common/time').getStartEndOfDayByDayOffset

describe('API resultByDateRange', function () {
  beforeEach(function () {
    var multi = client.multi()
    ;['105259197447_10154345396237448', '105259197447_10154345713527448', '105259197447_10154345756587448']
      .map(function (id) {
        multi.hmsetAsync(id + '_meta', {
          'id': id,
          'name': 'abc',
          'message': '123'
        })
      })
    return multi.execAsync()
  })
  // ,'105259197447_10154345713527448','105259197447_10154345756587448'

  it('should return top with metadata', function (done) {
    var start = getStartEndOfDayByDayOffset(0)[0]
    var end = getStartEndOfDayByDayOffset(0)[1]

    var reactions = {
      LIKE: 50401, LOVE: 1454, WOW: 1255, HAHA: 5780, SAD: 4055, ANGRY: 8953
    }
    var aggReactions = {
      'reactions': reactions,
      'summary': {
        total: 72120,
        postCount: 456
      },
      tops: [
        { id: '105259197447_10154345396237448', type: 'ANGRY', count: 3537 },
        { id: '105259197447_10154345713527448', type: 'SAD', count: 2545 },
        { id: '105259197447_10154345756587448', type: 'ANGRY', count: 1795 }
      ]
    }

    api.resultByDateRange('test', start, end, aggReactions)
      .then(function (result) {
        console.log(result)
        expect(result['reactions']).to.eql(reactions)
        expect(result['tops'][0]).to.eql({
          id: '105259197447_10154345396237448',
          'name': 'abc',
          type: 'ANGRY',
          'message': '123',
          count: 3537
        })
        expect(result['tops'].length).to.eql(3)
        expect(result['summary'].total).to.eql(72120)
        done()
      // expect(typeof(FbAPI['page'])).to.equal('function')
      // expect(FbAPI['page']({'pageId':123}).uri.pathname).to.equal('/v2.6/123')
      })
  })
})

describe('cacheRead', function (done) {
  beforeEach(function () {
    var multi = client.multi()
    _.range(0, 5).map(function (d) {
      var start = moment().startOf('day').subtract(d, 'days').format('x')
      var end = moment().endOf('day').subtract(d, 'days').format('x')
      console.log(start + '_' + end)
      multi.hmsetAsync('test_result', start + '_' + end, JSON.stringify({a: 1}))
    })
    return multi.execAsync()
  })
  it('should return by range', function () {
    var start = moment().startOf('day').subtract(2, 'days').format('x')
    var end = moment().endOf('day').subtract(0, 'days').format('x')
    console.log(start + '_' + end)
    api.cacheRead('test', start, end)
      .then(function (data) {
        expect(data).to.eql([ '{"a":1}', '{"a":1}', '{"a":1}' ])
        done()
      })
  })
})
