import { readFileSync } from "fs";
import { resolve } from "path";
import getResources from "../getResources";
import { resources } from "../consts";
import { getURIPartsFromNexusURL } from "../helpers";

// TODO remove this requirement
// if it is possible to get the pc trace collections
// via SPARQL query
function readTestDataJSON (file) {
  try {
    console.log("attempting to read file", file);
    return JSON.parse(readFileSync(file, 'utf8'));
  } catch(error) {
    console.log(error);
    throw new Error(`file ${file} cannot be read. It must be available as a requirement to run this script`);
  }
}


let docs;

async function fetchAdjacentResource() {
  let pc = readTestDataJSON(resolve(__dirname, "../../test-data/pc.json"));

  // if docs have been fetched and are in memory...
  if (docs && Object.keys(docs.length)) { return docs; }

  // otherwise fetch
  try {
    console.log("fetching EMTC traces");
    let resource = resources.emtc;
    let { short, source, url, context } = resource;
    let [base, ...urlParts] = getURIPartsFromNexusURL(url);
    const expDocCollectionUrl =
      "https://bbp-nexus.epfl.ch/staging/v0/data/somatosensorycortexproject/electrophysiology/emodelexperimentaltraceset/v0.0.1/";
    let unpreparedDocs = await getResources(url);
    let expDocs = await getResources(expDocCollectionUrl);

    console.log("found " + unpreparedDocs.length + " docs");

    // group docs by cell name
    docs = unpreparedDocs.reduce((memo, { source }) => {
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
            cellInfo = {
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

    return docs;
  } catch (error) {
    console.log(error);
    throw new Error("Problem with EMTC: " + error);
  }
}

export default fetchAdjacentResource;
