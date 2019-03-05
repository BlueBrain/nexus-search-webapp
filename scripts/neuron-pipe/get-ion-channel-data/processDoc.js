import trimMetaData from "../trimMetaData";
const DOC_TYPE = "nxv:IonChannel";
const CONTEXT_ID = "https://bbp.epfl.ch/nexus/search/neuroshapes";

export default async doc => {
  doc = trimMetaData(doc.source);
  doc["@context"] = CONTEXT_ID;
  doc["@type"] = DOC_TYPE;
  doc["@id"] = doc["@id"].replace(
    "https://bbp-nexus.epfl.ch/staging/v0/data/ionchannel/experiment/ionchannelgene/v0.1.0/",
    "icg:"
  );
  doc.brainRegion = doc.brainLocation.brainRegion;
  delete doc.brainLocation;
  doc["enteredBy"] = "kenny";
  return doc;
};
