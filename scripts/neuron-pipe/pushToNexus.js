import { fetchWithToken } from "./helpers";
import { getProp } from "@libs/utils";
import whichToken from "../../server/libs/whichToken";

export default async (doc, queryURL) => {
  let body = JSON.stringify(doc);
  let error, status, responsePayload;
  let token = whichToken(queryURL);
  [error, status, responsePayload] = await withStatus(
    fetchWithToken(queryURL, token, {
      method: "POST",
      body
    })
  );
  console.log(
    "\n\npushing to nexus!",
    { queryURL, id: doc["@id"], status },
    "\n"
  );
  if (error) {
    console.log(error);
    console.log(responsePayload);
    throw error;
  }
  if (status >= 400 && status !== 409) {
    console.log(body);
    throw new Error(body);
  }
  // Already exists
  if (status === 409) {
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
    let updateURL = queryURL + doc.searchID + "?rev=" + rev;
    console.log("\n update to nexus!", { updateURL, id: doc["@id"] }, "\n");
    [error, status, payload] = await withStatus(
      fetchWithToken(updateURL, token, {
        method: "PUT",
        body
      })
    );
    console.log("attempt to update response: ", status);
    if (!payload || status >= 400) {
      console.log("there's a problem", status);
      throw new Error("cannot update: " + updateURL);
    }
  }
  if (status === 201 || status === 200) {
    console.log("succesfully created in nexus! ", responsePayload);
  }
  return doc;
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
