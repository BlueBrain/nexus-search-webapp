import { fetchWithToken } from "./helpers";
import { getProp } from "@libs/utils";

export default async (doc, token, queryURL) => {
  try {
    let body = JSON.stringify(doc);
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
        let resourceURL = queryURL + doc.searchID;
        let [error, status, payload] = await withStatus(
          fetchWithToken(resourceURL, token)
        );
        if (!payload) {
          throw new Error("cannot update: " + resourceURL);
        }
        let rev = payload._rev;
        if (!rev) {
          throw new Error("cannot update, no revision: " + resourceURL);
        }
        let updateURL = queryURL +  doc.searchID + "?rev=" + rev;
        [error, status, payload] = await withStatus(
          fetchWithToken(updateURL, token, {
            method: "PUT",
            body
          })
        );
        if (!payload || status >= 400) {
          throw new Error("cannot update: " + updateURL);
        }
        break;
      case 200:
        console.log("succesfully updated in nexus! ", responsePayload);
        break;
      case 201:
        console.log("succesfully created in nexus! ", responsePayload);
        break;
      default:
        console.log(error, responsePayload, updateURL, status);
        // throw new Error("error updating");
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
