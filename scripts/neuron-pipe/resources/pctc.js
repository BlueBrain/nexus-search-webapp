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
  let [error, docs] = await to(getResources(url, token));
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
    let traceURL = source.distribution[0].downloadURL
    if (memo[expCellName]) {
        memo[expCellName][protocol] = traceURL
    } else {
      memo[expCellName] = {
        [protocol]: traceURL
      };
    }
    return memo;
  }, {});
  console.log("finished, writing to file");
  file.write(short, docs);
}

export default fetch;
