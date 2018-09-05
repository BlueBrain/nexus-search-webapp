import {fetchWrapper} from "./helpers";

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

function getRelatedResourceTypeByID(config, id, targetResourceType, queryMaker=makeQuery) {
  return new Promise((resolve, reject) => {
    const { token, base, org, domain, context, schema, ver } = config;
    let query = queryMaker(id, targetResourceType, context);
    // let body = encodeURI(JSON.stringify(query));
    let queryURL = base + "/queries/";// + "?fields=all";
    let options = {
      method: "POST",
      body: JSON.stringify(query),
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json; charset=utf-8"
      }
    };
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
