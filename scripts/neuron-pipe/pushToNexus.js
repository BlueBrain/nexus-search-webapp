import { fetchWithToken } from "./helpers";
import { getProp } from "@libs/utils";

export default async (doc, config) => {
  try {
    const { token, v1 } = config;
    const { base, project, org } = v1;
    let body = JSON.stringify(doc);
    let queryURL = `${base}/resources/${org}/${project}/resources`;
    let error, status, responsePayload;
    [error, status, responsePayload] = await withStatus(
      fetchWithToken(queryURL, token, {
        method: "POST",
        body
      })
    );
    console.log(doc["@id"], status, "\n");
    // console.log("STATUS", status, queryURL, JSON.stringify(doc, null, 2))
    let code = responsePayload.code;
    if (error) {
      throw error;
    }
    switch (code) {
      case 502:
        throw new Error("broken connection");
      case "AlreadyExists":
        console.log("some conflict we have to resolve...")
        let resourceURL = queryURL + "/" + doc.searchID;
        let [error, status, payload] = await withStatus(
          fetchWithToken(resourceURL, token)
        );
        console.log("afterGet", error, status, payload);
        if (!payload) {
          throw new Error("cannot update: " + resourceURL);
        }
        let rev = payload._rev;
        if (!rev) {
          throw new Error("cannot update, no revision: " + resourceURL);
        }
        let updateURL = queryURL + "/" + doc.searchID + "?rev=" + rev;
        [error, status, payload] = await withStatus(
          fetchWithToken(updateURL, token, {
            method: "PUT",
            body
          })
        );
        console.log("afterPUT", error, status, payload);
        if (!payload || status >= 400) {
          throw new Error("cannot update: " + updateURL);
        }
        console.log("succesfully updated entity ", updateURL, status);
        break;
      default:
        console.log("succesfully pushed to nexus! ", responsePayload);
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
      // console.log(response);
      let payload = await response.json();
      return [null, status, payload];
    }
    throw new Error("failed to fetch");
  } catch (error) {
    return [error];
  }
}
