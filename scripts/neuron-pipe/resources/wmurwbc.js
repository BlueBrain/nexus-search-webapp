import processDoc from "../processDoc";
import pushToNexus from "../pushToNexus";
import flattenDownloadables from "../flattenDownloadables";
import { getProp } from "@libs/utils";

export default (resource, resourceURL, shouldUpload) => [
  processDoc(resource),
  async doc => {
    doc.cellName = {
      label: doc.name
    };
    // Hard Coded! There's no mouse data there
    doc.subject = {
      species: "Mus musculus"
    }
    let brainRegion = getProp(doc, "brainLocation.brainRegion.label");
    doc.brainLocation = {
      brainRegion: brainRegion === "TH" ? "Thalamus" : brainRegion,
      atlas: getProp(doc, "brainLocation.atlasSpatialReferenceSystem.name")
    };
    doc.contribution = [{
      organization: "Wenzhou Medical University"
    }]
    doc.cellType = { specialDesignation: "Whole Brain" }
    return doc;
  },
  async doc => {
    let mTypePreprocessed = getProp(doc, "mType.label");
    if (mTypePreprocessed) {
      let [layer, mTypeWithColon] = mTypePreprocessed.split("_");
      let [mType, unknownValue] = mTypeWithColon.split(":");
      doc.brainLocation.layer = layer;
      doc.cellType.mType = mType;
    }
    return doc;
  },
  async doc => {
    doc.dataType = {
      morphology: "has morphology"
    };
    doc.dataSource.nexusProject = resource.project;
    return doc;
  },
  async doc => await flattenDownloadables(doc),
  async doc => {
    // don't upload if the name starts with AA
    // because it is a duplicate of RWBC found in this same directory!
    let isMouseLightCell = doc.name.slice(0, 2) === "AA";
    if (shouldUpload && !isMouseLightCell) {
      await pushToNexus(doc, resourceURL);
    }
    return doc;
  }
];