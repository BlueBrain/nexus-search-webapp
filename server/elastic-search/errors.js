// For when ES breaks
class ElasticSearchError extends Error {
  constructor(message) {
    super(message);
    this.name = 'ElasticSearchError';
  }
}

// For when QB breaks
class QueryBuilderError extends Error {
  constructor(message) {
    super(message);
    this.name = 'QueryBuilderError';
  }
}

// For when the server is not configured correctly
class InvalidConfigError extends Error {
  constructor(message) {
    super(message);
    this.name = 'InvalidConfigError';
  }
}

export {
  ElasticSearchError,
  QueryBuilderError,
  InvalidConfigError
}