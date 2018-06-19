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

export {
  ElasticSearchError,
  QueryBuilderError
}