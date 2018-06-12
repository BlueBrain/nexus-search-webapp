class ElasticSearchError extends Error {
  constructor(message) {
    super(message);
    this.name = 'ElasticSearchError';
  }
}

export {
  ElasticSearchError
}