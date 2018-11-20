import { fetchWithToken } from "./helpers";
import trimMetaData from "./trimMetaData";
import whichToken from "../../server/libs/whichToken"

export default async (doc, getResourceID, trimData=true) => {
  try {
    let resourceID = getResourceID(doc);
    let token = whichToken(resourceID)
    if (!resourceID) { return doc };
    let response = await fetchWithToken(resourceID, token);
    if (response) {
      let resource = await response.json();
      return trimData ? trimMetaData(resource) : resource;
    } else {
      throw new Error("something strange...")
    }
  } catch(error) {
    throw error
  }
}