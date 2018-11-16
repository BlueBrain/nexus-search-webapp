import * as Errors from "./errors";
import { to } from "../libs/async";
import { resources } from "../../scripts/neuron-pipe/consts";

function normalizer (docs) {
  return docs.hits.hits[0];
}


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
    // we use the search API because we don't know which project
    // contains our entity
    // IDs coming like "pc:1234"
    let id = requestParams.id;
    let [short, uuID] = id.split(":");
    // but they are stored in ES like
    // https://bbp.epfl.ch/nexus/v0/data/bbp/experiment/patchedcell/v0.1.0/1234
    let elasticSearchID = resources[short].url + uuID;
    let params = {
      index,
      size: 1,
      from: 0,
      body: {
        "query" : {
          "match":{
             "_id": elasticSearchID
          }
        }
     }
    }
    try {
      let docs = await client.search(params, headers);
      return normalizer(docs)
    } catch (error) {
      throw new Errors.ResourceError(error);
    }
  };
}
