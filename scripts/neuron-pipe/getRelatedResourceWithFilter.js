import {fetchWrapper} from "./helpers";
import whichToken from "../../server/libs/whichToken"

function makeQuery(startingResourceURI, targetResourceType, context) {
  const query = {
    // "@context": context,
    // filter: {
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
    // }
  };
  return query;
}

function getRelatedResourceTypeByID(context, id, targetResourceType, queryMaker=makeQuery) {
  return new Promise((resolve, reject) => {
    let base = id.slice(0, id.indexOf("/data/"));
    let token = whichToken(id);
    let query = queryMaker(id, targetResourceType);
    let filters = encodeURI(JSON.stringify(query));
    let queryURL = base + "/data/?fields=all&filter=" + filters + "&context=" + context;
    console.log({queryURL})
    return fetchWrapper(queryURL, {}, true, token)
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
