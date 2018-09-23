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
  const expDocCollectionUrl =
    "https://bbp-nexus.epfl.ch/staging/v0/data/somatosensorycortexproject/electrophysiology/emodelexperimentaltraceset/v0.0.1/";
  let [error, docs] = await to(getResources(url, token));
  let [errorDocs, expDocs] = await to(getResources(expDocCollectionUrl, token));

  if (!docs) {
    console.log(error, docs);
    throw new Error(
      "no docs found for some reason, maybe there was an auth error, check your token"
    );
  }

  console.log("found " + docs.length + " docs");

  // group docs by cell name
  docs = docs.reduce((memo, { source }) => {
    let { emodel, protocol } = source;
    let model = source.distribution[0].downloadURL
    let exp = expDocs
      .filter(
        ({ source }) => source.name.indexOf(`${emodel}___${protocol}`) >= 0
      )
      .map(({ source }) => {
        const name = source.name.split("___").pop();
        let cellInfo = {}
        let resolvedPatchedCellList = pc.filter(cell => {
          return cell.name === name;
        });
        if (resolvedPatchedCellList.length) {
          let {
            searchID,
            "@type": patchedCellType
          } = resolvedPatchedCellList[0];
          cellInfo =  {
            searchId: searchID,
            type: patchedCellType
          };
        }
        return {
          name,
          traceURL: source.distribution[0].downloadURL,
          ...cellInfo
        }
      });
    if (memo[emodel]) {
      if (memo[emodel][protocol]) {
        memo[emodel][protocol] = {
          exp,
          model
        };
      } else {
        memo[emodel][protocol] = {
          exp,
          model
        };
      }
    } else {
      memo[emodel] = {
        [protocol]: {
          exp,
          model
        }
      };
    }
    return memo;
  }, {});
  console.log("finished, writing to file");
  file.write(short, docs);
}

export default fetch;
