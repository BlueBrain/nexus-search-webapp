import trimMetaData from "../trimMetaData";
const DOC_TYPE = "nxv:SearchCell";
const CONTEXT_ID = "http://created.by.kenny/neuroshapes";

export default async doc => {
  doc = trimMetaData(doc.source);
  doc["@context"]  = CONTEXT_ID;
  doc["@type"] = DOC_TYPE;
  doc.cellName = {
    label: doc.name
  };
  doc.brainRegion = doc.brainLocation.brainRegion;
  return doc;
};