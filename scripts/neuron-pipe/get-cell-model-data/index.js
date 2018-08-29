import getConfig from "../config";
import getResources from "../getResources";
import file from "../file";
import { to } from "libs/promise";
import waitForEach from "../../../libs/waitForEach";
import processDoc from "./processDoc";
import fetchResourceById from "../fetchResourceById";
import pushToNexus from "../pushToNexus";
import flattenDownloadables from "../flattenDownloadables";
import getRelatedResourceWithFilter from "../getRelatedResourceWithFilter";
require("dns-cache")(10000);

const [, , stage, push] = process.argv;
const config = getConfig("get-cell-model-data", stage);

const {
  TOKEN: token,
  BASE: base,
  ORG: org,
  DOMAIN: domain,
  CONTEXT: context,
  SCHEMA: schema,
  VER: ver,
  V1_PROJECT: v1Project,
  V1_ORG: v1Org,
  V1_BASE: v1Base
} = config;

let easyConfig = {
  token,
  base,
  org,
  domain,
  context,
  schema,
  ver,
  v1: { project: v1Project, org: v1Org, base: v1Base }
};

async function fetch() {
  let [error, docs] = await to(
    waitForEach(getResources(easyConfig), [
      processDoc,
      async doc => {
        let morphology = await fetchResourceById(
          doc,
          easyConfig.token,
          doc => doc.wasDerivedFrom[0]["@id"]
        );
        doc.morphology = [morphology];
        return doc;
      },
      async doc => {
        doc.subject = {
          species: doc.species
        };
        delete doc.species;
        return doc;
      },
      async doc => {
        let [eType, mTypeWithLayer] = doc.name.split("_");
        let layer = mTypeWithLayer.match(/L(\d)+/g)[0];
        let [,mType] = mTypeWithLayer.split(layer);
        doc.studyType = { label: "In Silico" };
        doc.eType = {
          label: eType,
        }
        doc.mType = {
        label: mType
        }
        doc.layer = {
          label: layer
        }
        return doc;
      },
      // async doc => {
      //   let response = await getRelatedResourceWithFilter(
      //     easyConfig,
      //     doc["@id"],
      //     "nsg:EModelBuilding",
      //     (startingResourceURI, targetResourceType, context) => {
      //       const query = {
      //         // "@context": context,
      //         // filter: {
      //           op: "and",
      //           value: [
      //             {
      //               op: "eq",
      //               path: "prov:generated",
      //               value: startingResourceURI
      //             },
      //             {
      //               op: "eq",
      //               path: "rdf:type",
      //               value: targetResourceType
      //             }
      //           ]
      //         // }
      //       };
      //       return query;
      //     }
      //   );
      //   doc.generatedFrom = response;
      //   return doc;
      // },
      async doc => {
        let modelScript = await fetchResourceById(
          doc,
          easyConfig.token,
          doc => doc.modelScript[0]["@id"]
        );
        doc.modelScript = [modelScript];
        return doc;
      },
      async doc => {
        let attribution = await fetchResourceById(
          doc,
          easyConfig.token,
          doc => doc.wasAttributedTo["@id"]
        );
        doc.attribution = [attribution];
        return doc;
      },
      // async doc => {
      //   let morphology = await fetchResourceById(
      //     doc,
      //     easyConfig.token,
      //     doc => doc.wasDerivedFrom[0]["@id"]
      //   );
      //   doc.morphology = [morphology];
      //   return doc;
      // },
      async doc => await flattenDownloadables(doc),
      // async doc => await morphoParser(doc, easyConfig)
      async doc => await pushToNexus(doc, easyConfig)
    ])
  );
  if (!docs) {
    console.log(error, docs);
    throw new Error(
      "no docs found for some reason, maybe there was an auth error, check your token"
    );
  }
  console.log("found " + docs.length + " docs");
  console.log("finished, writing to file");
  file.write("CellModels", docs);
}

async function pushDocs() {
  let cells = require("./Cells.json");
  let responses = await Promise.all(
    cells.map(async doc => await pushToNexus(doc, easyConfig))
  );
  return responses;
}

void (async function main() {
  try {
    if (push) {
      let stuff = await pushDocs();
    } else {
      let stuff = await fetch();
    }
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
})();
