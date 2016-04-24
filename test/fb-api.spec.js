var FbAPI = require('../common/fb-api').FbAPI;
var getUrlByEndpoint = require('../common/fb-api').getUrlByEndpoint;
describe('#FbAPI', function() {
  it('should return correct endpoint', function () {
    expect(typeof(FbAPI['page'])).to.equal('function');
    expect(FbAPI['page']({'pageId':123}).uri.pathname).to.equal('/v2.6/123');
  });
  describe('integration test', function() {
    it('page should return result promise', function () {
      var id =232633627068;
      return FbAPI['page']({'pageId':id}).then(function(data){
        expect(data.posts.data.length).to.equal(100);
        expect(parseInt(data.id)).to.equal(id);
      });
    });
    it('reactions should return result promise', function (done) {
      this.timeout(15000);
      var id ='232633627068_10154431772567069';
      // in practice size>2000 result in 500 error
      var size = 1000;
      return FbAPI['reactions']({'postId':id}).then(function(data){
        expect(data.summary.total_count).to.be.above(4000);
        expect(parseInt(data.data.length)).to.equal(size);
        //TODO check is url, undefined if no next
        expect(typeof(data.paging.next)).to.equal('string');
        done();
      });
    });
  });
});

describe('#getUrlByEndpoint', function() {
  it('should return correct endpoint', function () {
    expect(getUrlByEndpoint('page',{'pageId':123})).to.equal('https://graph.facebook.com/v2.6/123');
  });
});
