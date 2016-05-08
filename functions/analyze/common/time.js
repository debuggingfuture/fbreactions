var moment = require('moment');

function getStartEndOfDayByDayOffset(dayOffset) {

  // UTC. https://github.com/vincentlaucy/fbreactions/issues/4
  var start = moment().startOf('day').subtract(dayOffset,'days').valueOf();
  var end =   moment().endOf('day').subtract(dayOffset,'days').valueOf();
  //sad but no tuple es5
  return [start,end]
}

module.exports={
  getStartEndOfDayByDayOffset:getStartEndOfDayByDayOffset
}
