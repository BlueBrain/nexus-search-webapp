import trimMetaData from "../trimMetaData";
const DOC_TYPE = "nxv:SearchCell";
const CONTEXT_ID = "http://created.by.kenny/neuroshapes";

export default async doc => {
  doc = trimMetaData(doc.source);
  doc["@context"]  = CONTEXT_ID;
  doc["@type"] = DOC_TYPE;
  doc["@id"] = doc["@id"].replace(
    "https://bbp-nexus.epfl.ch/staging/v0/data/somatosensorycortexproject/simulation/emodel/v0.1.1/",
    "em:"
  );
  doc["enteredBy"] = "kenny"
  doc.cellName = {
    label: doc.name
  };
  return doc;
};