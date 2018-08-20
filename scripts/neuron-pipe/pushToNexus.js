import { fetchWithToken } from "./helpers";

export default async (doc, config) => {
  try {
    const { token, v1 } = config;
    const { base, project, org } = v1
    doc["@id"] = doc["@id"].replace("https://bbp.epfl.ch/nexus/v0/data/bbp/experiment/patchedcell/v0.1.0/", "pc:")
    let body = JSON.stringify(doc);
    let queryURL =
      `${base}/resources/${org}/${project}/resources/`;
    let response = await fetchWithToken(queryURL, token, {
      method: "POST",
      body
    });
    let resource = await response.json();
    console.log(resource);
    return doc;
  } catch (error) {
    console.log("something explodes")
    throw error;
  }
};
