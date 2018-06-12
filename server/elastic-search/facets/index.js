import queryBuilder from "./query-builder";
import { ElasticSearchError } from "../errors";

/**
 * Factory that makes fetchFacets
 *
 * @export
 * @param {object} client elastic search client instance
 * @returns {function} fetchFacets
 */
export default function facetsFactory (client, index) {
  /**
   * Fetch the facets!
   *
   * @export
   * @param {object} query elastic search client instance
   * @returns {Promise} fetchFacets
   */
  return async function fetchFacets (query = { q: null, type: null }) {
    const { q, type } = query;
    let body =  await queryBuilder({ q, type }, client, index);
    const params = {
      index,
      type: "doc",
      body
    };
    console.log('params', JSON.stringify(params, null, 2))
    return new Promise((resolve, reject) => {
      client.search(params)
      .then(docs => {
        console.log('docs', docs);
        // TODO add test for normalization or move to client
        resolve(docs.aggregations)
      })
      .catch(error => reject(new ElasticSearchError(error)));
    });
  }
}