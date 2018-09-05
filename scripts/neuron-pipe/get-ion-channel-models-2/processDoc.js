import trimMetaData from "../trimMetaData";
const DOC_TYPE = "nxv:SearchIonChannel";
const CONTEXT_ID = "http://created.by.kenny/neuroshapes";

export default async doc => {
  doc = trimMetaData(doc.source);
  doc["@context"]  = CONTEXT_ID;
  doc["@type"] = DOC_TYPE;
  doc.searchID = doc["@id"].replace(
    "https://bbp-nexus.epfl.ch/staging/v0/data/somatosensorycortexproject/simulation/subcellularmodel/v0.1.2/",
    "subcell:"
  );
  doc["enteredBy"] = "kenny"
  doc.cellName = {
    label: doc.name
  };
  return doc;
};