import * as Errors from "./errors";
import { to } from "../libs/async";

const DEFAULT_QUERY_BUILDER = () => Promise.resolve({});
const DEFAULT_NORMALIZER = docs => docs;
const DEFAULT_PARAMS = {
  size: null,
  from: null,
  filter: null,
  type: null,
  q: null
};

/**
 * Factory that makes fetchQuery
 *
 * @export
 * @param {object} client elastic search client instance
 * @returns {function} fetchQuery
 */
export default function queryFactory(
  client,
  index,
  queryBuilder = DEFAULT_QUERY_BUILDER,
  normalizer = DEFAULT_NORMALIZER
) {
  /**
   * Fetch the docs!
   *
   * @export
   * @param {object} query elastic search client instance
   * @returns {Promise} fetchQuery
   */
  return async function fetchQuery(query = DEFAULT_PARAMS, requestParams=DEFAULT_PARAMS, headers) {
    let error, body, docs;
    [error, body] = await to(queryBuilder(query, client, index, headers));
    if (error) { throw new Errors.QueryBuilderError(error); }
    const params = {
      size: query.size,
      from: query.from,
      index,
      type: "doc",
      body
    };
    [error, docs] = await to(client.search(params, headers));
    if (error) { throw new Errors.ElasticSearchError(error); }
    return normalizer(docs);
  };
}
