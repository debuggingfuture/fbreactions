var trackerUtil = require('../common/tracker-util');
var sumReactions = trackerUtil.sumReactions;
var initCount = trackerUtil.initCount;
var REACTION_TYPES = require('../common/fb-api').REACTION_TYPES;
var _groupByIndex = trackerUtil._groupByIndex;

var pages = require('../common/pages');

describe('_groupByIndex',function () {
  it('should work for normal input',function () {
    var input = ['a','b','c','d'];
    expect(_groupByIndex(input,function (i) {
      return i %2;
    })).to.eql({
      0:['a','c'],
      1:['b','d']
    });
  });
  it('should work for empty input',function () {
    expect(_groupByIndex([],function (i) {
      return i %2;
    })).to.eql({});
  })
})

describe('#initCount',function () {
  it('return empty',function () {
    expect(initCount()).to.eql({
      LIKE: 0,
      LOVE: 0,
      WOW: 0,
      HAHA: 0,
      SAD: 0,
      ANGRY: 0,
      total: 0,
    });
  })
})
describe('sum reactions',function () {
  it('should add by reaction type',function () {
    var result = sumReactions([
      {
        LIKE: '1',
        LOVE: '0',
        WOW: '0',
        HAHA: '0',
        SAD: '0',
        ANGRY: '6',
        total: '57',
        updated_at: '1461113126588'
      },
      {
        LIKE: '2',
        LOVE: '0',
        WOW: '1',
        HAHA: '0',
        SAD: '0',
        ANGRY: '0',
        total: '76',
        updated_at: '1461113126970'
      },
      {
        LIKE: 3,
        LOVE: '3',
        WOW: '5',
        HAHA: '1',
        SAD: '3',
        ANGRY: '0',
        total: '212',
        updated_at: '1461113126668'
      }
    ]);


    expect(_.keys(result)).to.eql(REACTION_TYPES.concat('total').concat('postCount'));
    expect(result['LIKE']).to.equal(6);
    expect(result['total']).to.equal(57+76+212);
  });
});
