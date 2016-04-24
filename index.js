require('dotenv').config();
//TODO redis err handling, fetch only when started , dry run mode

var pages = require('./common/pages');
function loadPageId() {

}

function loadPageKeys() {

}


//Same as fb
function generatePostKey(pageId, postId){
  return [pageId,postId].join('_');
}

function getId(resId){
  return resId.split('_')[1];
}
//


//should accept flexible criteria on which posts to search
//e.g. yesterday
//should ignore missed values are are latest posts not yet fetched
//can be avoided by use two sets, but less meaningful as they keep updated



//state of not yet populated?

// return new Promise(function (resolve,reject) {
//
//   var isSuccess = bucket.removeTokens(1,function (err) {
//     countAndStoreReactions(id)
//   })
//   isSuccess ? resolve() : reject();
// })

// counting
// need of throttling
// countAndStoreReactions
// pages[SET_KEY]['appledaily.tw']



module.exports = {
  // pages:pages,
}
