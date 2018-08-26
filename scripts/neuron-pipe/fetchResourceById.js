import { fetchWithToken } from "./helpers";
import trimMetaData from "./trimMetaData";

export default async (doc, token, getResourceID) => {
  try {
    let resourceID = getResourceID(doc);
    if (!resourceID) { return doc };
    let response = await fetchWithToken(resourceID, token);
    if (response) {
      let resource = await response.json();
      return trimMetaData(resource);
    } else {
      throw new Error("something strange...")
    }
  } catch(error) {
    throw error
  }
}