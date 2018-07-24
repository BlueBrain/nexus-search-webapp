import elasticsearch from "elasticsearch";
import config from "../../server/libs/config";
import getCellsFromTraceFiles from "./traceFiles";
import getMorphologies from "./getMorphologies";

const LIMIT = 1000;

const index = config.ELASTIC_SEARCH_INDEX;
const host = config.ELASTICSEARCH_CLIENT_URL;
const client = new elasticsearch.Client({
  host
});

(function main() {
  try {
    const documentDictionary = getCellsFromTraceFiles();
    return getMorphologies(documentDictionary)
    .then(documentDictionaryWithMorphologies => {
      let docs = Object.values(documentDictionaryWithMorphologies);
      console.log(docs.length);
      let body = [];
      for (let i = 0; i <= docs.length - 1; i++) {
        if (i + 1 > LIMIT) {
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
      return client.bulk({
        body
      });
    })
    .then((result) => {
      console.log(result);
      return client.count({
        index: index
      });
    })
    .then(({ count }) => {
      console.log("HOW MANY DOCS?: ", count);
    })
    .catch(error => {
      console.log(error);
      process.exit(1);
    });
  } catch(error) {
    console.log(error);
    console.log("something terrible happened");
    process.exit(1);
  }
})();