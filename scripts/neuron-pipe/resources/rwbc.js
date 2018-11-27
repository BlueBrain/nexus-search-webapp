import processDoc from "../processDoc";
import pushToNexus from "../pushToNexus";
import flattenDownloadables from "../flattenDownloadables";
import { getProp } from "@libs/utils";
import { mTypes } from "@consts";
import { dataTypes } from "../consts";

export default (resource, resourceURL, shouldUpload, dependencies) => [
  processDoc(resource),
  async doc => {
    doc.cellName = {
      label: doc.name
    };
    // Hard Coded! There's no mouse data there
    doc.subject = {
      species: "Mus musculus"
    };

    // split by brain region?
    // which project?
    //
    doc.brainLocation = {
      brainRegion: getProp(doc, "brainLocation.brainRegion.label"),
      atlas: getProp(doc, "brainLocation.atlasSpatialReferenceSystem.name")
    };
    doc.license = {
      name: "CC-BY NC",
      availability: "Open"
    };
    doc.contribution = [
      {
        // PUBLIC
        organization: "Janelia Research Campus"
      }
    ];
    doc.cellType = { specialDesignation: "Whole Brain" };
    return doc;
  },
  async doc => {
    doc.citations = {
      howToCite:
        "https://www.janelia.org/project-team/mouselight/neuronbrowser",
      citationsList: [
        {
          text: `Economo, M. N., Clack, N. G., Lavis, L. D., Gerfen, C. R., Svoboda, K., Myers, E. W., & Chandrashekar, J. (2016). A platform for brain-wide imaging and reconstruction of individual neurons. eLife, 5.`,
          location: "https://doi.org/10.7554/eLife.10566"
        },
        {
          text: "Neuron Identifier",
          location: doc.identifier
        }
      ]
    };
    return doc;
  },
  async doc => {
    let mTypePreprocessed = getProp(doc, "mType.label");
    if (mTypePreprocessed) {
      let [layer, mTypeWithColon] = mTypePreprocessed.split("_");
      let [mType, unknownValue] = mTypeWithColon.split(":");
      doc.brainLocation.layer = layer;
      doc.cellType.mType = mTypes[mType.toLowerCase()];
    }
    return doc;
  },
  async doc => {
    doc.dataType = {
      morphology: dataTypes.morphology
    };
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
