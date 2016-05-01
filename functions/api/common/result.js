function _locationKey(locaiton) {
  return location+'_result';
}
function _dateRangeKey(start,end) {
  return [start,end].join();
}
//fetch page again for content before write
// practically store daily now but support range for future
function cacheWrite(location,start,end) {
  var key = _locationKey(location);
  var dateRangeKey = _dateRangeKey(start,end);

  var result ={
    "raw":{

    },
    "normalized":{
      
    }
  }

}

function cacheRead(location,resultByDate) {

}



module.exports = {
  cacheWrite:cacheWrite,
  cacheRead:cacheRead
}
