import queryBuilder from "./query-builder";

export default {
  queryBuilder,
  normalizer: docs => docs.aggregations || []
}