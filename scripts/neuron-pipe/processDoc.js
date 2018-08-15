const DOC_TYPE = "Cell"

export default async doc => {
  doc = {...doc.source};
  doc["@type"] = DOC_TYPE;
  delete doc.links;
  delete doc["nxv:rev"];
  delete doc["nxv:deprecated"];
  delete doc["@context"];
  // change mapping?
  doc.brainRegion = doc.brainLocation.brainRegion;
  delete doc.brainLocation;
  doc.cellName = {
    label: doc.name
  };
  return doc;
};