import getConfig from "../config";
import getResources from "../getResources";
import file from "../file";
import { to, waitForEach } from "libs/promise";
import processDoc from "./processDoc";
import fetchResourceById from "../fetchResourceById";
import getRelatedResourceWithFilter from "../getRelatedResourceWithFilter";
import trimMetaData from "../trimMetaData";
import pushToNexus from "../pushToNexus";
import flattenDownloadables from "../flattenDownloadables";
import { getProp } from "@libs/utils";
require("dns-cache")(100000);

const [, , stage, push] = process.argv;
const config = getConfig("get-data", stage);
console.log(config);

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
  console.log(easyConfig);
  let [error, docs] = await to(
    waitForEach(getResources(easyConfig), [
      processDoc,
      async doc => {
        console.log(doc);
        let subject = getProp(doc, "wasDerivedFrom.@id");
        if (subject) {
          let subjectResult = await fetchResourceById(
            doc,
            easyConfig.token,
            doc => subject
          );
          doc.subject = subjectResult;
        }
        return doc;
      },
      async doc => {
        doc.studyType = { label: "Experimental" };
        return doc;
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
          function makeQuery(startingResourceURI, targetResourceType) {
            const query = {
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
      async doc => {
        doc["@id"] = doc["@id"].replace(
          "https://bbp.epfl.ch/nexus/v0/data/bbp/experiment/patchedcell/v0.1.0/",
          "pc:"
        );
        return doc;
      },
      async doc => await flattenDownloadables(doc),
      // async doc => await fetchMorphology(doc, easyConfig),
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
  file.write("Cells", docs);
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
