import { readFileSync } from "fs";
import { resolve } from "path";
import processDoc from "../processDoc";
import fetchResourceById from "../fetchResourceById";
import pushToNexus from "../pushToNexus";
import flattenDownloadables from "../flattenDownloadables";
import getRelatedResourceWithFilter from "../getRelatedResourceWithFilterBody";
import { getProp } from "@libs/utils";
import { mTypes } from "@consts";
import { dataTypes } from "../consts";
// TODO remove this requirement
// if it is possible to get the pc trace collections
// via SPARQL query
function readTestDataJSON(file) {
  try {
    console.log("attempting to read file", file);
    return JSON.parse(readFileSync(file, "utf8"));
  } catch (error) {
    console.log(error);
    throw new Error(
      `file ${file} cannot be read. It must be available as a requirement to run this script`
    );
  }
}

let pc;

export default (resource, resourceURL, shouldUpload, dependency) => [
  processDoc(resource),
  async doc => {
    let morphology = await fetchResourceById(
      doc,
      doc => doc.wasDerivedFrom[0]["@id"]
    );

    if (!pc) {
      pc = readTestDataJSON(resolve(__dirname, "../../test-data/pc.json"));
    }
    // // morphology preview
    // doc.image = morphology.image;
    doc.morphology = [morphology];

    // map to (prod) version of reconstructed cell
    let patchedCellsFilteredByName = pc.filter(cell => {
      // we need to find the reconstructed cell used, in morphology
      let reconstructedCell = cell.morphology[0];
      if (reconstructedCell) {
        return morphology.name === reconstructedCell.name;
      } else {
        return false;
      }
    });
    let searchID = getProp(patchedCellsFilteredByName[0] || {}, "searchID");
    let id = getProp(patchedCellsFilteredByName[0] || {}, "@id");
    let type = getProp(patchedCellsFilteredByName[0] || {}, "@type");
    // if there's no ID, it doesn't map to anything in prod (BAD!)
    if (!id) {
      return doc;
    }
    doc.generatedMorphologyFrom = {
      "@id": id,
      searchId: searchID,
      type
    };
    return doc;
  },
  async doc => {
    doc.license = {
      name: "BBP/EPFL",
      availability: "Private"
    };
    doc.subject = {
      species: getProp(doc, "species.label")
    };
    doc.cellName = {
      label: doc.name
    };
    // get traces from trace collection (must be previously prepared)
    doc.traces = dependency[getProp(doc, "cellName.label")];
    doc.brainLocation = {
      brainRegion: getProp(doc, "brainRegion.label")
    };
    delete doc.brainRegion;
    delete doc.species;
    return doc;
  },
  async doc => {
    let [eType, mTypeWithLayer] = doc.name.split("_");
    let layer = mTypeWithLayer.match(/L(\d)+/g)[0];
    let [, mType] = mTypeWithLayer.split(layer);
    doc.cellType = {
      eType,
      mType: mTypes[mType.toLowerCase()]
    };
    if (layer === "L23") {
      layer = "L2/3";
    }
    doc.brainLocation.layer = layer;
    return doc;
  },
  async doc => {
    let { context } = resource;
    let response = await getRelatedResourceWithFilter(
      context,
      doc["@id"],
      "prov:SoftwareAgent",
      (startingResourceURI, targetResourceType, context) => {
        const query = {
          "@context": context,
          filter: {
            op: "and",
            value: [
              {
                path: "rdf:type",
                op: "eq",
                value: targetResourceType
              },
              {
                path: "^prov:wasAssociatedWith / prov:generated",
                op: "eq",
                value: startingResourceURI
              }
            ]
          }
        };
        return query;
      }
    );
    let generatedFrom =
      response.total > 0 ? response.results[0].resultId : null;
    doc.generatedFrom = generatedFrom;
    return doc;
  },
  async doc => {
    let { context } = resource;
    let response = await getRelatedResourceWithFilter(
      context,
      doc["@id"],
      "prov:SoftwareAgent",
      (startingResourceURI, targetResourceType, context) => {
        const query = {
          "@context": context,
          filter: {
            op: "and",
            value: [
              {
                path: "rdf:type",
                op: "eq",
                value: "nsg:PatchedCell"
              },
              {
                path: "nxv:deprecated",
                op: "eq",
                value: false
              },
              {
                path:
                  "^prov:used / ^prov:wasGeneratedBy / ^prov:hadMember / ^prov:wasDerivedFrom",
                op: "eq",
                value: startingResourceURI
              }
            ]
          }
        };
        return query;
      }
    );

    // resolve all the patchedCell Id's into thier full contents
    let patchedCells = await Promise.all(
      response.results.map(async result => {
        return await fetchResourceById(doc, doc => result.resultId);
      })
    );

    // match the names we have with the cells we have, and return their ids
    // should conform to this format
    // {
    //   "@id": "https://bbp-nexus.epfl.ch/staging/v0/data/somatosensorycortexproject/simulation/emodel/v0.1.1/2f2816e6-5d8f-42f2-b043-dad56eac30bc",
    //   "searchId": "em:2f2816e6-5d8f-42f2-b043-dad56eac30bc",
    //   "type": "nxv:SearchCell"
    // },
    let resolvedCellUsedWith = patchedCells.map(patchedCell => {
      let resolvedPatchedCellList = pc.filter(cell => {
        return cell.name === patchedCell.name;
      });
      if (resolvedPatchedCellList.length) {
        let {
          "@id": patchedCellID,
          searchID,
          "@type": patchedCellType
        } = resolvedPatchedCellList[0];
        return {
          "@id": patchedCellID,
          searchId: searchID,
          type: patchedCellType
        };
      }
    });

    doc.generatedEPhysFrom = resolvedCellUsedWith;
    return doc;
  },
  async doc => {
    let modelScript = await fetchResourceById(
      doc,
      doc => doc.modelScript[0]["@id"]
    );
    doc.modelScript = [modelScript];
    return doc;
  },
  async doc => {
    let generatedFrom = await fetchResourceById(doc, doc => doc.generatedFrom);
    doc.software = generatedFrom;
    return doc;
  },
  async doc => {
    let agent = await fetchResourceById(doc, doc => doc.wasAttributedTo["@id"]);
    agent.fullName = agent.fullName = agent.additionalName
      ? `${agent.givenName} ${agent.additionalName} ${agent.familyName}`
      : `${agent.givenName} ${agent.familyName}`;
    agent.person = agent.fullName;
    agent.organization = "Blue Brain Project";
    delete agent["@id"];
    doc.contribution = [agent];
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
