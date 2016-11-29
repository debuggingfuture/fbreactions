var factory = function() {
  return {}
};

var schema = {
  type: 'object',
  patternProperties: {
    '.*': { type: 'integer', default: 0 }
  }
};

module.exports = {
  schema: schema,
  factory: factory
};
