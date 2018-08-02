import * as Errors from "./errors";
import { to } from "../libs/async";

const DEFAULT_PARAMS = {
  id: null
};

/**
 * Factory that makes fetchQuery
 *
 * @export
 * @param {object} client elastic search client instance
 * @returns {function} fetchQuery
 */
export default function getInstanceFactory(
  client,
  index
) {
  /**
   * Fetch the docs!
   *
   * @export
   * @param {object} query elastic search client instance
   * @returns {Promise} fetchQuery
   */
  return async function getInstance(query, requestParams= DEFAULT_PARAMS) {
    let error, docs;
    const params = {
      index,
      type: "doc",
      id: requestParams.id
    };
    [error, docs] = await to(client.get(params));
    if (error) { throw new Errors.ElasticSearchError(error); }
    return docs
  };
}
