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
  client
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
    // TODO make check for bad token?
    [error, docs] = await to(client.get(requestParams.id, headers));
    if (error) { throw new Errors.ResourceError(error); }
    return docs
  };
}
