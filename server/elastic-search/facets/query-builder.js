import mappingToAggs from "./mappings-to-aggs";
import { to } from "@libs/promise";

async function getAggsFromMapping (client, index, headers) {
  let mapping = await client.indices.getMapping({
    index,
    type: "doc"
  }, headers)
  let properties = mapping.properties;
  return mappingToAggs(properties)
}

/**
 *
 *
 * @param {object} nexusSearchQueryObject
 * @returns {object} an elastic search query object
 */
async function makeFacetQuery({ q, type, filter }, client, index, headers) {
  let [error, aggs] = await to(getAggsFromMapping(client, index, headers));
  if (error) { return Promise.reject(error)}
  let params = {
    query: {
      bool: {
        must: []
      }
    },
    aggs
  };
  if (q) {
    params.query.bool.must.push({
      query_string: {
        query: `(${q}* OR ${q}~)`
      }
    });
  }
  if (type) {
    params.query.bool.must.push({
      term: { "@type.raw": type }
    });
  }
  if (filter) {
    filter = JSON.parse(filter);
    // MUST is an AND, we do it for terms across filter sets
    let must = Object.keys(filter).map(key => {
      // SHOULD is an OR, we do it for terms in the same filter set
      let should = filter[key].map(filterTerm => {
        let propertyName = `${key}.raw`;
        return { term: { [propertyName]: filterTerm } };
      });

      // For nested queries, every part of the path needs to contain
      // its ancestors, as in "grandparent.parent.value"
      let path = key.split(".").reduce((previous, current) => {
        const parentLabel = previous[previous.length - 1] || null;
        const currentLabel = parentLabel
          ? `${parentLabel}.${current}`
          : current;
        previous.push(currentLabel);
        return previous;
      }, []);

      return path.reverse().reduce((memo, level, index) => {
        if (index === 0) {
          memo = {
            bool: {
              should
            }
          };
        } else {
          memo = {
            nested: {
              path: level,
              query: memo
            }
          };
        }
        return memo;
      }, {});
    });
    if (must.length) {
      params.query.bool.must.push({
        bool: {
          must
        }
      });
    }
  }
  return params;
}

export default makeFacetQuery;
