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
import morphoParser from "../morphoParser";
require("dns-cache")(100000);

const [, , stage, push] = process.argv;
const config = getConfig("get-data", stage);

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
        // let response = await getRelatedResourceWithFilter(
        //   easyConfig,
        //   doc["@id"],
        //   "nsg:Trace"
        // );
        // doc.traces = response.results.map(trace => {
        //   trace = trimMetaData(trace.source);
        //   return trace;
        // });
        doc.traces = [];
        return doc;
      },
      async doc => {
        let label = doc.brainRegion.label;
        let layerIndex = label.indexOf("layer");
        if (layerIndex >= 0) {
          let layerName = label.slice(layerIndex, label.length);
          switch (layerName) {
            case "layer I":
              doc.brainRegion.layer = "L1";
              break;
            case "layer II":
              doc.brainRegion.layer = "L2";
              break;
            case "layer II/III":
              doc.brainRegion.layer = "L2/3";
              break;
            case "layer III":
              doc.brainRegion.layer = "L3";
              break;
            case "layer IV":
              doc.brainRegion.layer = "L4";
              break;
            case "layer V":
              doc.brainRegion.layer = "L5";
              break;
            case "layer VI":
              doc.brainRegion.layer = "L6";
              break;
            case "layer VIa":
              doc.brainRegion.layer = "L6a";
              break;
          }
        }
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
        console.log(doc.subject);
        if (!doc.subject) { return doc; }
        doc.subject.species = getProp(doc, "subject.species.label")
        doc.subject.sex = getProp(doc, "subject.sex.label")
        doc.subject.strain = getProp(doc, "subject.strain.label")
        doc.cellTypes = {
          eType: getProp(doc, "eType.label"),
          mType: getProp(doc, "mType.label")
        }
        if (doc.cellTypes.eType === "null" || doc.cellTypes.eType === null) {
          delete doc.cellTypes.eType;
        }
        if (doc.cellTypes.mType === "null" || doc.cellTypes.mType === null) {
          delete doc.cellTypes.mType;
        }
        return doc;
      },
      async doc => await flattenDownloadables(doc),
      // async doc => await fetchMorphology(doc, easyConfig),
      async doc => await morphoParser(doc, easyConfig),
      // async doc => await pushToNexus(doc, easyConfig)
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
