import getResources from "../getResources";
import file from "../file";
import { to, waitForEach } from "libs/promise";
import processDoc from "../processDoc";
import fetchResourceById from "../fetchResourceById";
import getRelatedResourceWithFilter from "../getRelatedResourceWithFilter";
import trimMetaData from "../trimMetaData";
import pushToNexus from "../pushToNexus";
import flattenDownloadables from "../flattenDownloadables";
import { getProp } from "@libs/utils";
import { getURIPartsFromNexusURL } from "../helpers";

require("dns-cache")(100000);

async function fetch(resource, token, shouldUpload, resourceURL) {
  let { short, source, url, context } = resource;
  let [base, ...urlParts ] = getURIPartsFromNexusURL(url);
  let [error, docs] = await to(
    waitForEach(getResources(url, token), [
      processDoc(resource),
      async doc => {
        let subject = getProp(doc, "wasDerivedFrom.@id");
        if (subject) {
          let subjectResult = await fetchResourceById(
            doc,
            token,
            doc => subject
          );
          doc.subject = subjectResult;
        }
        doc.cellName = {
          label: doc.name
        };
        doc.brainRegion = doc.brainLocation.brainRegion;
        delete doc.brainLocation;
        doc.studyType = { label: "Experimental" };
        return doc;
      },
      async doc => {
        return doc;
      },
      async doc => {
        // TODO what do we do with traces?
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
          { token, base, context},
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
        if (!doc.subject) {
          return doc;
        }
        doc.subject.species = getProp(doc, "subject.species.label");
        doc.subject.sex = getProp(doc, "subject.sex.label");
        doc.subject.strain = getProp(doc, "subject.strain.label");
        doc.cellTypes = {
          eType: getProp(doc, "eType.label"),
          mType: getProp(doc, "mType.label")
        };
        if (doc.cellTypes.eType === "null" || doc.cellTypes.eType === null) {
          delete doc.cellTypes.eType;
        }
        if (doc.cellTypes.mType === "null" || doc.cellTypes.mType === null) {
          delete doc.cellTypes.mType;
        }
        return doc;
      },
      async doc => await flattenDownloadables(doc),
      async doc => {
        if (shouldUpload) {
          await pushToNexus(doc, token, resourceURL);
        }
        return doc;
      }
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
  file.write(short, docs);
}

export default fetch;
