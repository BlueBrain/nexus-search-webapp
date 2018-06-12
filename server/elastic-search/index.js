import elasticsearch from "elasticsearch";
import types from "./types";
import facets from "./facets";
import dotenv from "dotenv";
import path from "path";

// TODO move to config provider...
const STAGE = process.env.NODE_ENV === "production" ? "prod" : "dev";
// load ENV variables from env stage configs
if (STAGE === "dev") {
  dotenv.config({ path: path.resolve(__dirname, `../../envs/${STAGE}.env`) });
}


const index = process.env.ELASTIC_SEARCH_INDEX;
const client = new elasticsearch.Client({
  host: process.env.ELASTICSEARCH_CLIENT_URL
});

const ENDPOINTS = {
  types: types(client, index),
  facets: facets(client, index),
  docs: getDocs
};

export default ENDPOINTS;

function getDocs(query) {
  let params = {
    query: {
      bool: {
        must: []
      }
    }
  };
  let { size, from, filter, type, q } = query;
  if (q) {
    params.query.bool.must.push({
      query_string: {
        query: `(${query.q}* OR ${query.q}~)`
      }
    });
  }
  if (type) {
    params.query.bool.must.push({
      term: { "@type.raw": query.type }
    });
  }
  if (filter) {
    filter = JSON.parse(filter);
    console.log(filter);
    // MUST is an AND, we do it for terms across filter sets
    let must = Object.keys(filter).map(key => {
      // SHOULD is an OR, we do it for terms in the same filter set
      let should = filter[key].map(filterTerm => {
        let propertyName = key + ".label.raw";
        return { term: { [propertyName]: filterTerm } };
      });
      return {
        nested: {
          path: key,
          query: {
            bool: {
              should
            }
          }
        }
      };
    });
    params.query.bool.must.push({
      bool: {
        must
      }
    });
  }
  console.log("PARAMS", JSON.stringify(params, null, 2));
  return client
    .search({
      size,
      from,
      index,
      type: "doc",
      body: params
    })
    .then(resp => {
      return resp.hits;
    });
}

function getTypes(query) {
  const params = {
    index,
    type: "doc",
    body: makeTypeQuery(query.q)
  };
  return client.search(params).then(res => {
    return res.aggregations["@types"].buckets;
  });
}

function getFacets(query) {
  const params = {
    index,
    type: "doc",
    body: {
      aggs: {
        sex: {
          nested: {
            path: "sex"
          },
          aggs: {
            labels: {
              terms: {
                field: "sex.label.raw"
              }
            }
          }
        },
        strain: {
          nested: {
            path: "strain"
          },
          aggs: {
            labels: {
              terms: {
                field: "strain.label.raw"
              }
            }
          }
        },
        species: {
          nested: {
            path: "species"
          },
          aggs: {
            labels: {
              terms: {
                field: "species.label.raw"
              }
            }
          }
        },
        distribution: {
          nested: {
            path: "distribution"
          },
          aggs: {
            labels: {
              terms: {
                field: "distribution.mediaType.raw"
              }
            }
          }
        },
        "brain location": {
          nested: {
            path: "brainLocation"
          },
          aggs: {
            "brain region": {
              nested: {
                path: "brainLocation.brainRegion"
              },
              aggs: {
                labels: {
                  terms: {
                    field: "brainLocation.brainRegion.label.raw"
                  }
                }
              }
            }
          }
        }
      }
    }
  };
  if (query.type) {
    params.body.query = {
      match: {
        "@type.raw": query.type
      }
    };
  }
  return client.search(params).then(res => {
    return res.aggregations;
  });
}
