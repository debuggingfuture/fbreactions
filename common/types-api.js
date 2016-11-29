var factory = function() {
  return {};
};

var schema = {
  type: 'object',
  patternProperties: {
    '.*_.*': {
      type: 'object',
      properties: {
        reactions: {
          type: 'object'
        },
        tops: {
         type: 'array',
         minItems: 1,
         items: require('./types-post')
       },
       summary:{
         type: 'object'
       }
      },
      required: ['reactions', 'tops', 'summary']
    }
  }
};

module.exports = {
  schema: schema,
  factory: factory
};
