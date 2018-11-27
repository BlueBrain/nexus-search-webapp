import processDoc from "../processDoc";
import fetchResourceById from "../fetchResourceById";
import getRelatedResourceWithFilter from "../getRelatedResourceWithFilter";
import trimMetaData from "../trimMetaData";
import pushToNexus from "../pushToNexus";
import flattenDownloadables from "../flattenDownloadables";
import { getProp } from "@libs/utils";
import { mTypes } from "@consts";
import { dataTypes } from "../consts";

// This is here because it seems that node cannot resolve DNS
// when doing lots of requests
require("dns-cache")(100000);

export default (resource, resourceURL, shouldUpload, dependencies) => [
  processDoc(resource),
  async doc => {
    let subject = getProp(doc, "wasDerivedFrom.@id");
    if (subject) {
      let subjectResult = await fetchResourceById(doc, doc => subject);
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
    // Traces are collected as a dependency
    let traces = dependencies;
    if (traces[doc.name]) {
      doc.traces = traces[doc.name];
    } else {
      doc.traces = {};
    }
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
    let { short } = resource;
    // prov pattern only for NMC Portal PC
    if (short !== "pc") {
      return doc;
    }
    let { context } = resource;
    let response = await getRelatedResourceWithFilter(
      context,
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
    let { short } = resource;
    // prov pattern only for Thalamus Project PCs
    if (short !== "tpc") {
      return doc;
    }
    let { context } = resource;
    let response = await getRelatedResourceWithFilter(
      context,
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
    let { context } = resource;
    // Getting contributions using the WholeCellPatchClamp
    let response = await getRelatedResourceWithFilter(
      context,
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
      let agent = await fetchResourceById(doc, doc => wasStartedBy["@id"]);
      if (!agent.familyName || !agent.givenName) {
        console.log(wasStartedBy);
        console.log(agent);
        throw new Error("No agent info");
      }
      agent.fullName = agent.additionalName
        ? `${agent.givenName} ${agent.additionalName} ${agent.familyName}`
        : `${agent.givenName} ${agent.familyName}`;
      agent.person = agent.fullName;
      agent.organization = "Laboratory of Neural Microcircuitry";
      doc.contribution = [agent];
    }
    if (!activity.length) {
      // NO WholeCellPatchClamp info,
      // we should use Stimulus Experiment instead
      let agentResponseFromStimulus = await getRelatedResourceWithFilter(
        context,
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
  async doc => {
    doc.dataType = {};
    if (doc.traces && Object.keys(doc.traces).length) {
      doc.dataType.electrophysiology = dataTypes.electrophysiology;
    }
    if (doc.morphology && doc.morphology.length) {
      doc.dataType.morphology = dataTypes.morphology;
    }
    return doc;
  },
  async doc => {
    doc.dataSource.nexusProject = resource.project;
    doc.citations = {
      howToCite: "https://bbp.epfl.ch/nmc-portal/howtocite",
      citationsList: [
        {
          text:
            "Markram H, Muller E, Ramaswamy S, Reimann MW,  Abdellah M, Sanchez CA, Ailamaki A, Alonso-Nanclares L, Antille N, Arsever S et al. (2015). Reconstruction and Simulation of Neocortical Microcircuitry. Cell 163:2, 456 - 492.",
          location: "doi: 10.1016/j.cell.2015.09.029"
        }
      ]
    };
    return doc;
  },
  async doc => await flattenDownloadables(doc),
  async doc => {
    if (shouldUpload) {
      await pushToNexus(doc, resourceURL);
    }
    return doc;
  }
];
