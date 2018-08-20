import { fetchWithToken } from "./helpers";
import { getProp } from "libs/utils";
import trimMetaData from "./trimMetaData";

const DEFAULT_PATH = "wasDerivedFrom.@id"

export default async (doc, name, replace, token, path=DEFAULT_PATH) => {
  try {
    let resourceID = getProp(doc, path);
    if (!resourceID) { return doc };
    let response = await fetchWithToken(resourceID, token);
    if (response) {
      let resource = await response.json();
      doc[name] = trimMetaData(resource);
      delete doc[replace]
    } else {
      throw new Error("something strange...")
    }
    return doc
  } catch(error) {
    throw error
  }
}