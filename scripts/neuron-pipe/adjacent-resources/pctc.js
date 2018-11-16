import getResources from "../getResources";
import { resources } from "../consts";

let docs;

async function fetchAdjacentResource() {
  // if docs have been fetched and are in memory...
  if (docs && Object.keys(docs.length)) { return docs; }

  // otherwise fetch
  try {
    console.log("fetching PCTC traces");
    let resource = resources.pctc;
    let { short, url } = resource;
    const options = {
      filter: JSON.stringify({
        op: "eq",
        path: "rdf:type",
        value: "nsg:Configuration"
      }),
      context: JSON.stringify({
        nsg: "https://bbp-nexus.epfl.ch/vocabs/bbp/neurosciencegraph/core/v0.1.0/"
      })
    };
    let preProcessedDocs = [];

    try {
      await getResources(url, options, results => {
        preProcessedDocs = preProcessedDocs.concat(results)
      });
    } catch (error) {
      console.log(error);
    }

    console.log("found " + preProcessedDocs.length + " docs");

    // group docs by cell name
    docs = preProcessedDocs.reduce((memo, { source }) => {
      let { expCellName, protocol } = source;
      if (source.distribution) {
        let traceURL = source.distribution[0].downloadURL
        if (memo[expCellName]) {
          memo[expCellName][protocol] = traceURL
        } else {
          memo[expCellName] = {
            [protocol]: traceURL
          };
        }
      } else {
        console.log("found strange one", source);
      }
      return memo;
    }, {});

    return docs;
  } catch (error) {
    console.log(error);
    throw new Error("Problem with PCTC: " + error);
  }
}

export default fetchAdjacentResource;
