// For when ES breaks
class ElasticSearchError extends Error {
  constructor(message) {
    super(message);
    this.name = 'ElasticSearchError';
  }
}

// For when Resource API breaks
class ResourceError extends Error {
  constructor(message) {
    super(message);
    this.name = 'ResourceError';
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

// For when the token is invalid
class UnauthorizedError extends Error {
  constructor(message) {
    super(message);
    this.name = 'UnauthorizedError';
  }
}

export {
  ElasticSearchError,
  QueryBuilderError,
  UnauthorizedError,
  InvalidConfigError
}