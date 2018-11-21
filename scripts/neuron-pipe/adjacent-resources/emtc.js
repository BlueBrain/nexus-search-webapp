import getResources from "../getResources";
import { resources } from "../consts";
import { getURIPartsFromNexusURL } from "../helpers";

let docs;

async function fetchAdjacentResource() {
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
        .map(async ({ source }) => {
          const name = source.name.split("___").pop();
          let cellInfo = {}
          let { context } = resources.pc;
          let response
          // try {
          //   response = await getRelatedResourceWithFilter(
          //     context,
          //     doc["@id"],
          //     "nsg:ReconstructedCell",
          //     function makeQuery(startingResourceURI, targetResourceType) {
          //       const query = {
          //         op: "and",
          //         value: [
          //           {
          //             op: "eq",
          //             path: "name",
          //             value: name
          //           },
          //           {
          //             op: "eq",
          //             path: "rdf:type",
          //             value: "nsg:PatchedCell"
          //           }
          //         ]
          //       };
          //       return query;
          //     }
          //   );
          //   console.log({response});
          // } catch (error) {
          //   console.log("oh no!", error)
          //   throw new Error("broken!", error);
          // }
          let resolvedPatchedCellList = [];
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
