import queryBuilder from "./query-builder";
import { ElasticSearchError } from "../errors";
import defaultNormalizer from "./normalizer";
/**
 * Factory that makes fetchTypes
 *
 * @export
 * @param {object} client elastic search client instance
 * @returns {function} fetchTypes
 */
export default function typesFactory (client, index, normalizer=defaultNormalizer) {
  /**
   * Fetch the types!
   *
   * @export
   * @param {object} query elastic search client instance
   * @returns {Promise} fetchTypes
   */
  return async function fetchTypes (query = { q: null }) {
    const { q } = query;
    const params = {
      index,
      type: "doc",
      body: queryBuilder(q)
    };
    return new Promise((resolve, reject) => {
      client.search(params)
      .then(docs => resolve(normalizer(docs)))
      .catch(error => reject(new ElasticSearchError(error)));
    });
  }
}