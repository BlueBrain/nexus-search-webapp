import trimMetaData from "./trimMetaData";
const DOC_TYPE = "Cell"

export default async doc => {
  doc = trimMetaData(doc.source);
  doc["@type"] = DOC_TYPE;
  doc.cellName = {
    label: doc.name
  };
  return doc;
};