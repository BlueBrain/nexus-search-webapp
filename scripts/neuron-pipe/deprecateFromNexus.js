import { fetchWithToken } from "./helpers";
import { getProp } from "@libs/utils";
import whichToken from "../../server/libs/whichToken"

export default async (doc, queryURL) => {
  let body = JSON.stringify(doc);
  let token = whichToken(queryURL);
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
  let deprecateURL = queryURL + doc.searchID + "?rev=" + rev;
  [error, status, payload] = await withStatus(
    fetchWithToken(deprecateURL, token, {
      method: "DELETE",
    })
  );
  if (status !== 200) {
    throw new Error("cannot depcrecate: " + deprecateURL);
  }
  console.log("succesfully deprecated in nexus! ", doc["@id"]);
  return doc;
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
