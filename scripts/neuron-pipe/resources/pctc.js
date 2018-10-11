import getResources from "../getResources";
import file from "../file";
import { to } from "@libs/promise";
import { getURIPartsFromNexusURL, fetchWithToken } from "../helpers";
import { getProp } from "@libs/utils";
import trimMetaData from "../trimMetaData";
import pc from "../../testData/pc.json";

async function fetch(resource, token, shouldUpload, resourceURL) {
  let { short, source, url, context } = resource;
  let [base, ...urlParts] = getURIPartsFromNexusURL(url);
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
  let [error, docs] = await to(getResources(url, token, options));
  console.log(error, docs);
  if (!docs) {
    console.log(error, docs);
    throw new Error(
      "no docs found for some reason, maybe there was an auth error, check your token"
    );
  }

  console.log("found " + docs.length + " docs");

  // group docs by cell name
  docs = docs.reduce((memo, { source }) => {
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
  console.log("finished, writing to file");
  file.write(short, docs);
}

export default fetch;
