import elasticsearch from "elasticsearch";
import config from "../../server/libs/config";
import to from "./to";

const DEFAULT_INDEX = config.ELASTIC_SEARCH_INDEX;
const DEFAULT_HOST = config.ELASTICSEARCH_CLIENT_URL;
const DEFAULT_LIMIT = 5000;

function prepareESBodyPayload(docs, index, limit) {
  let body = [];
  for (let i = 0; i <= docs.length - 1; i++) {
    if (i + 1 > limit) {
      break;
    }
    let document = docs[i];
    body.push({
      index: {
        _index: index,
        _type: "doc",
        _id: document["@id"]
      }
    });
    body.push(document);
  }
  return body;
}

export default (docs, options = {}) => {
  return to(
    new Promise((resolve, reject) => {
      const {
        index = DEFAULT_INDEX,
        host = DEFAULT_HOST,
        limit = DEFAULT_LIMIT
      } = options;
      console.log("Push to Elastic: ", { index, host, limit });
      const client = new elasticsearch.Client({ host });
      const body = prepareESBodyPayload(docs, index, limit);
      return client.bulk({ body })
      .then(resolve)
      .catch(reject)
    })
  );
};
