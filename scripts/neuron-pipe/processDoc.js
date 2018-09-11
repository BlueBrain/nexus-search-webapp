import { context } from "./consts"
import trimMetaData from "./trimMetaData";

export default resource => async doc => {
  doc = trimMetaData(doc.source);
  doc["@context"] = context;
  doc["@type"] = resource.type;
  doc.searchID = doc["@id"].replace(
    resource.url,
    `${resource.short}:`
  );

  const { repository, source, studyType=null } = resource;
  if (studyType) {
    doc.studyType = { label: studyType };
  }
  doc.distributions = { repository, source };
  return doc;
};