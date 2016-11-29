var factory = function() {
  return {}
};

var schema = {
  type: 'object',
  properties: {
    id: {
      type: 'string',
      pattern: '\\d+_\\d+'
    },
    type:{
       enum : require('./fb-api').REACTION_TYPES
    },
    count: {
      type: 'number'
    },
    message:{
      type: 'string'
    },
    caption: {
      type: 'string'
    }
  }
};

module.exports = {
  schema: schema,
  factory: factory
};
