var trackerUtil = require('../common/tracker-util');
var sumReactions = trackerUtil.sumReactions;
var initCount = trackerUtil.initCount;
var REACTION_TYPES = require('../common/fb-api').REACTION_TYPES;
var _groupByIndex = trackerUtil._groupByIndex;
var _insertIfTops = trackerUtil._insertIfTops;

var pages = require('../common/pages');



describe('_insertIfTops',function () {
  var originalSortedTops = [
    {'type':'ANGRY',count:5},
    {'type':'HI',count:4},
    {'type':'HI',count:3}
  ];
  it('should work for empty input',function () {
    expect(_insertIfTops([])).to.eql([]);
  });
  it('should insert for empty original',function () {
    expect(_insertIfTops([],3,originalSortedTops[0])).to.eql([originalSortedTops[0]]);
  })
  it('should insert for original smaller than size',function () {
    expect(_insertIfTops(originalSortedTops.slice(0,2),3,originalSortedTops[2])).to.eql(originalSortedTops);
  })
  it('should replace at proper position if top',function () {
    var sortedTops = _.clone(originalSortedTops);
    var ele = {'type':'ANGRY',count:9999};
    var expected = sortedTops.slice(0,2);
    expected.unshift(ele);
    expect(_insertIfTops(sortedTops,3,ele,'count')).to.eql(expected);
  })
  it('should replace at proper position for no path',function () {
    var sortedTops = [6,4,2];
    expect(_insertIfTops(sortedTops,3,5)).to.eql([6,5,4]);
  })
  it('should not replace if not top',function () {
    var sortedTops = _.clone(originalSortedTops);
    var ele = {'type':'ANGRY',count:1};
    expect(_insertIfTops(sortedTops,3,ele,'count')).to.eql(sortedTops);
  });
});
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
});

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
  var ids = ['1_1','2_2','3_3'];
  var counts = [
    {
      LIKE: '1',
      LOVE: '0',
      WOW: '0',
      HAHA: '0',
      SAD: '0',
      ANGRY: '56',
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
  ]

  it('should add by reaction type',function () {

    var result = sumReactions(counts);
    expect(_.keys(result)).to.eql(REACTION_TYPES.concat('total').concat('postCount'));
    expect(result['LIKE']).to.equal(6);
    expect(result['total']).to.equal(57+76+212);
  });

  it ('should provide top results',function () {

    var result = trackerUtil.sumReactionsWithTop(ids,counts);
    expect(result['tops'][0]).to.eql({'id':'1_1','type':'ANGRY',count:'56'});
    expect(result['tops'].length).to.eql(3);
    expect(result['LIKE']).to.equal(6);
    expect(result['total']).to.equal(57+76+212);

  })
  //
});
describe('findLargestReaction',function () {
  var input = {
    LIKE: '1',
    LOVE: '5',
    WOW: '3',
    HAHA: '6',
    SAD: '888',
    ANGRY: '56',
    total: '57',
    updated_at: '1461113126588'
  };
  it ('should select not select like',function () {
    var result = trackerUtil.findLargestReaction(input);
    console.log(result);
    expect(result).to.eql(['SAD','888']);
  });
});
