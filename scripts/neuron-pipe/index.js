import getConfig from "./config";
import getResources from "./getResources";
import file from "./file";
import to from "./to";
import pushToElastic from "./pushToElastic";
import waitForEach from "./waitForEach";
import processDoc from "./processDoc";
import fetchResourceById from "./fetchResourceById";
import getRelatedResourceWithFilter from "./getRelatedResourceWithFilter";
import trimMetaData from "./trimMetaData";
import fetchMorphology from "./fetchMorphology";
import pushToNexus from "./pushToNexus";
import morphoParser from "./morphoParser";
require('dns-cache')(10000);

const [, , stage, push] = process.argv;
const config = getConfig(stage);

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
        return await fetchResourceById(doc, "subject", "wasDerivedFrom", token);
      },
      async doc => {
        let response = await getRelatedResourceWithFilter(
          easyConfig,
          doc["@id"],
          "nsg:Trace"
        );
        doc.traces = response.results.map(trace => {
          trace = trimMetaData(trace.source);
          return trace;
        });
        return doc;
      },
      async doc => {
          let response = await getRelatedResourceWithFilter(
            easyConfig,
            doc["@id"],
            "nsg:ReconstructedCell",
            function makeQuery(startingResourceURI, targetResourceType, context) {
              const query = {
                // "@context": context,
                // filter: {
                  op: "and",
                  value: [
                    {
                      op: "eq",
                      path: "prov:wasDerivedFrom / prov:wasRevisionOf",
                      value: startingResourceURI
                    },
                    {
                      op: "eq",
                      path: "rdf:type",
                      value: targetResourceType
                    }
                  ]
                // }
              };
              return query;
            }
          );
          doc.morphology = response.results.map(morpho => {
            morpho = trimMetaData(morpho.source);
            return morpho;
          });
          return doc;
      },
      // async doc => await fetchMorphology(doc, easyConfig),
      // async doc => await morphoParser(doc, easyConfig)
      // async doc => await pushToNexus(doc, easyConfig)
    ])
  );
  if (!docs) {
    console.log(error, docs);
    throw new Error(
      "no docs found for some reason, maybe there was an auth error, check your token"
    );
  }
  console.log("finished, writing to file")
  file.write("Cells", docs);
}

async function pushDocs() {
  let cells = require("./Cells.json")
  let responses = await Promise.all(
    cells.map(async doc => await pushToNexus(doc, easyConfig))
  );
  return responses
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
