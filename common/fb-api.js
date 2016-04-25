var rp = require('request-promise');
var _ = require('lodash');

var appId = process.env.FB_APP_ID;
var secret =  process.env.FB_APP_SECRET;
var access_token = appId + '|' + secret;

var REACTION_TYPES=['LIKE','LOVE','WOW','HAHA','SAD','ANGRY'];

var endpointConfig ={
  'graph':{
    endpoint:'<%= key %>'
  },
  'reactions':{
    endpoint:'<%= postId %>/reactions',
    defaultParams:{
      'limit':1000,
      'summary':true
    }
  },
  //TODO ignore content
  'page': {
    endpoint:'<%= pageId %>',
    defaultParams:{
      'fields':'posts.limit(100)'
    }
  }
}

function getUrlByEndpoint(endpoint,endpointParams){
  var template = 'https://graph.facebook.com/v2.6/';
  return _.template(template+endpointConfig[endpoint]['endpoint'])(endpointParams);
}

var apiFactory = function(endpoint){
  return function(defaultParams, params){

    var endpointUrl = getUrlByEndpoint(endpoint,params);
    if(!_.isEmpty(defaultParams)){
      params= _.assign(defaultParams,params)
    }
    params['access_token']=access_token;
    return rp.get({
      uri:endpointUrl,
      qs:params,
      json:true
    });
  }
}
var FbAPI = {};
Object.keys(endpointConfig).forEach(function(key){
  var config = endpointConfig[key];
  FbAPI[key]=apiFactory(key).bind(this, config['defaultParams']);
});

module.exports = {
  FbAPI:FbAPI,
  REACTION_TYPES:REACTION_TYPES,
  getUrlByEndpoint:getUrlByEndpoint
}
