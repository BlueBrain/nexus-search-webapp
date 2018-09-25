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
import { getURIPartsFromNexusURL, fetchWithToken } from "../helpers";
import downloadMorph from "../downloadMorph";
import { mTypes } from "@consts";

require("dns-cache")(100000);

async function fetch(resource, token, shouldUpload, resourceURL) {
  let { short, source, url, context } = resource;
  let [base, ...urlParts] = getURIPartsFromNexusURL(url);
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
        doc.brainLocation = {
          brainRegion: getProp(doc, "brainLocation.brainRegion.label")
        };
        doc.license = {
          name: "BBP/EPFL",
          availability: "Private"
        };
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
        let label = doc.brainLocation.brainRegion;
        let layerIndex = label.indexOf("layer");
        if (layerIndex >= 0) {
          let layerName = label.slice(layerIndex, label.length);
          switch (layerName) {
            case "layer I":
              doc.brainLocation.layer = "L1";
              break;
            case "layer II":
              doc.brainLocation.layer = "L2";
              break;
            case "layer II/III":
              doc.brainLocation.layer = "L2/3";
              break;
            case "layer III":
              doc.brainLocation.layer = "L3";
              break;
            case "layer IV":
              doc.brainLocation.layer = "L4";
              break;
            case "layer V":
              doc.brainLocation.layer = "L5";
              break;
            case "layer VI":
              doc.brainLocation.layer = "L6";
              break;
            case "layer VIa":
              doc.brainLocation.layer = "L6a";
              break;
          }
        }
        return doc;
      },
      async doc => {
        // prov pattern only for NMC Portal PC
        if (short !== "pc") {
          return doc;
        }
        let response = await getRelatedResourceWithFilter(
          { token, base, context },
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
                  value: "nsg:ReconstructedCell"
                }
              ]
            };
            return query;
          }
        );
        doc.morphology = response.results.map(morpho => {
          morpho = trimMetaData(morpho.source);
          // the JSON preview of the morpho is stored in the reconstructedCell
          if (morpho.image) {
            doc.image = morpho.image;
          }
          return morpho;
        });
        return doc;
      },
      async doc => {
        // prov pattern only for Thalamus Project PCs
        if (short !== "tpc") {
          return doc;
        }
        let response = await getRelatedResourceWithFilter(
          { token, base, context },
          doc["@id"],
          "nsg:ReconstructedCell",
          function makeQuery(startingResourceURI, targetResourceType) {
            const query = {
              op: "and",
              value: [
                {
                  op: "eq",
                  path: "^prov:generated / prov:used / prov:wasRevisionOf",
                  value: startingResourceURI
                },
                {
                  op: "eq",
                  path: "rdf:type",
                  value: "nsg:ReconstructedCell"
                }
              ]
            };
            return query;
          }
        );
        doc.morphology = response.results.map(morpho => {
          morpho = trimMetaData(morpho.source);
          // the JSON preview of the morpho is stored in the reconstructedCell
          if (morpho.image) {
            doc.image = morpho.image;
          }
          return morpho;
        });
        return doc;
      },
      async doc => {
        // Getting contributions using the WholeCellPatchClamp
        let response = await getRelatedResourceWithFilter(
          { token, base, context },
          doc["@id"],
          "nsg:WholeCellPatchClamp",
          function makeQuery(startingResourceURI, targetResourceType) {
            const query = {
              op: "and",
              value: [
                {
                  op: "eq",
                  path: "prov:generated / dcterms:hasPart / prov:hadMember",
                  value: startingResourceURI
                },
                {
                  op: "eq",
                  path: "rdf:type",
                  value: "nsg:WholeCellPatchClamp"
                }
              ]
            };
            return query;
          }
        );
        let activity = response.results.map(activity => {
          activity = trimMetaData(activity.source);
          return activity;
        });
        if (activity && activity.length && activity[0].wasStartedBy) {
          // This activity only ever has one agent
          let wasStartedBy = activity[0].wasStartedBy;
          let response = await fetchWithToken(wasStartedBy["@id"], token);
          let json = await response.json();
          let agent = trimMetaData(json);
          agent.fullName = agent.additionalName
            ? `${agent.givenName} ${agent.additionalName} ${agent.familyName}`
            : `${agent.givenName} ${agent.familyName}`;
          agent.person = agent.fullName;
          agent.organization = "Blue Brain Project";
          doc.contribution = [agent];
        }
        if (!activity.length) {
          // NO WholeCellPatchClamp info,
          // we should use Stimulus Experiment instead
          let agentResponseFromStimulus = await getRelatedResourceWithFilter(
            { token, base, context },
            doc["@id"],
            "schema:Person",
            function makeQuery(startingResourceURI, targetResourceType) {
              const query = {
                op: "and",
                value: [
                  {
                    op: "eq",
                    path: "^prov:wasStartedBy / prov:used",
                    value: startingResourceURI
                  },
                  {
                    op: "eq",
                    path: "rdf:type",
                    value: "schema:Person"
                  }
                ]
              };
              return query;
            }
          );
          let agents = agentResponseFromStimulus.results.map(activity => {
            activity = trimMetaData(activity.source);
            return activity;
          });
          doc.contribution = agents.map(agent => {
            agent.fullName = agent.additionalName
              ? `${agent.givenName} ${agent.additionalName} ${agent.familyName}`
              : `${agent.givenName} ${agent.familyName}`;
            agent.person = agent.fullName;
            agent.organization = "Laboratory of Neural Microcircuitry";
            return agent;
          });
        }
        return doc;
      },
      // downloadMorph(token, short, doc => getProp(doc, "morphology", [{}])[0]),
      async doc => {
        if (!doc.subject) {
          return doc;
        }
        doc.subject.species = getProp(doc, "subject.species.label");
        doc.subject.sex = getProp(doc, "subject.sex.label");
        doc.subject.strain = getProp(doc, "subject.strain.label");
        doc.cellType = {
          eType: getProp(doc, "eType.label"),
          mType: mTypes[getProp(doc, "mType.label")]
        };

        // process mType form morphology
        let mTypePreprocessed = getProp(doc.morphology[0] || {}, "mType.label");
        if (mTypePreprocessed) {
          let [layer, mTypeWithColon] = mTypePreprocessed.split("_");
          let [mType, unknownValue] = mTypeWithColon.split(":");
          doc.brainLocation.layer = layer;
          // There are sometimes this strange layer here
          if (doc.brainLocation.layer === "L23") {
            doc.brainLocation.layer = "L2/3";
          }
          doc.cellType.mType = mTypes[mType.toLowerCase()];
        }

        if (doc.cellType.eType === "null" || doc.cellType.eType === null) {
          delete doc.cellType.eType;
        }
        if (doc.cellType.mType === "null" || doc.cellType.mType === null) {
          delete doc.cellType.mType;
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
