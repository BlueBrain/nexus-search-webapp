import * as Errors from "./errors";
import { to } from "../libs/async";
import fetch from "node-fetch";

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
  return async function getInstance(query, requestParams=DEFAULT_PARAMS, headers) {
    let error, docs;
    const params = {
      headers: {
        Authorization: headers.authorization
      }
    };
    //TODO remove hardcoded path when new API is up
    // TODO make check for bad token
    let url = "https://bbp-nexus.epfl.ch/staging/v1/resources/kenny/search/resource/" + requestParams.id;
    [error, docs] = await to(fetch(url, params).then(res => res.json()));
    if (error) { throw new Errors.ElasticSearchError(error); }
    return docs
  };
}
