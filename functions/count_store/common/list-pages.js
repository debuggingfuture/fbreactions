var Promise = require("bluebird");
var FbAPI = require('../common/fb-api').FbAPI;
var rp = require('request-promise');

function loadPages() {
  var pages={'hk':[],'tw':[]};
  var url ='https://spreadsheets.google.com/feeds/list/1TFlDA8SHSaLml-xm1OOl4k-4lKu4VFNixDaFbDASkuw/od6/public/values?alt=json'
  return rp.get(url)
    .then(function (data) {
      var entries = JSON.parse(data).feed.entry
      _.forEach(entries,function (entry) {
        ['gsx$tw','gsx$hk'].map(function (locale) {
          var pageUrl = entry[locale]['$t'];
          if(pageUrl){
            var key = pageUrl.replace(/.*facebook.com\//,'').replace(/\/$/, "");
            pages[locale.replace(/.*\$/,'')].push(key);
          }
        });
      });
    return pages;
  });
}
loadPages().then(function (pagesByCountry) {
  console.log('pagesByCountry')
  // loadPageId()
  _.mapValues(pagesByCountry,function (pages) {
    var pagesWithId = {};
    return Promise.all(pages.map(function (pageKey) {
      return FbAPI['graph']({'key':pageKey})
        .then(function (data) {
          return [pageKey, data.id];
            // console.log(data.id);
        })
      })).then(function (pairs) {
          console.log(JSON.stringify(_.fromPairs(pairs)));
      });

  });

});
module.exports = loadPages;
