import {fetchWrapper, getURIPartsFromNexusURL} from "./helpers";
import whichToken from "../../server/libs/whichToken";

function makeQuery(startingResourceURI, targetResourceType, context) {
  const query = {
    "@context": context,
    filter: {
      op: "and",
      value: [
        {
          op: "eq",
          path: "prov:wasDerivedFrom",
          value: startingResourceURI
        },
        {
          op: "eq",
          path: "rdf:type",
          value: targetResourceType
        }
      ]
    }
  };
  return query;
}

function getRelatedResourceTypeByID(context, id, targetResourceType, queryMaker=makeQuery) {
  return new Promise((resolve, reject) => {
    let query = queryMaker(id, targetResourceType, context);
    let [base, ...uriParts] = getURIPartsFromNexusURL(id);
    let queryURL = base + "/queries/";// + "?fields=all";
    let token = whichToken(id);
    let options = {
      method: "POST",
      body: JSON.stringify(query),
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json; charset=utf-8"
      }
    };
    console.log(queryURL)
    return fetchWrapper(queryURL, {}, true, token, options)
      .then(response => {
        return resolve(response);
      })
      .catch(error => {
        console.log("error getting related resource");
        console.log(error);
        reject(error);
      });
  });
}

export default getRelatedResourceTypeByID;
