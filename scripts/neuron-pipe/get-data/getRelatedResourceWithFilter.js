import fetch from "node-fetch";

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

function getRelatedResourceTypeByID(config, id, targetResourceType, queryMaker=makeQuery) {
  return new Promise((resolve, reject) => {
    const { token, base, org, domain, context, schema, ver } = config;
    let query = queryMaker(id, targetResourceType);
    let filters = encodeURI(JSON.stringify(query));
    let queryURL = base + "/data/" + org + "?fields=all&filter=" + filters + "&context=" + context;
    let options = {
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json"
      }
    };
    console.log({queryURL})
    return fetch(queryURL, options)
      .then(response => {
        if (response.status > 308) {
          console.log(response.status, response.statusText);
          return reject(response.statusText);
        }
        return response.json();
      })
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
