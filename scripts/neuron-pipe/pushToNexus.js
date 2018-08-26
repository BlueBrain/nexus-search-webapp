import { fetchWithToken } from "./helpers";
import { getProp } from "@libs/utils";

export default async (doc, config) => {
  try {
    const { token, v1 } = config;
    const { base, project, org } = v1;
    let body = JSON.stringify(doc);
    let queryURL = `${base}/resources/${org}/${project}/resources/`;
    let error, status, payload;
    [error, status, payload] = await withStatus(
      fetchWithToken(queryURL, token, {
        method: "POST",
        body
      })
    );
    if (error) {
      throw error;
    }
    switch (status) {
      case 409:
        let resourceURL = queryURL + doc["@id"];
        [error, status, payload] = await withStatus(
          fetchWithToken(resourceURL, token)
        );
        if (!payload) {
          throw new Error("cannot update: ", resourceURL);
        }
        let rev = payload._rev;
        let updateURL = queryURL + doc["@id"] + "?rev=" + rev;
        let updateBody = Object.assign(doc);
        delete updateBody["@id"];
        [error, status, payload] = await withStatus(
          fetchWithToken(updateURL, token, {
            method: "PUT",
            body: JSON.stringify(updateBody)
          })
        );
        if (!payload || status >= 400) {
          console.log("error", payload,  JSON.stringify(updateBody, null, 2))
          throw new Error("cannot update: " + updateURL);
        }
        console.log("succesfully updated entity ", updateURL);
        break;
      default:
        console.log("succesfully pushed to nexus! ", queryURL);
        break;
    }
    return doc;
  } catch (error) {
    console.log("problem pushing to nexus");
    throw error;
  }
};

async function withStatus(fetchWithToken) {
  try {
    let response = await fetchWithToken;
    if (response) {
      let status = getProp(response, "status");
      console.log(response);
      let payload = await response.json();
      return [null, status, payload];
    }
    throw new Error("failed to fetch");
  } catch (error) {
    return [error];
  }
}
