import mappingToAggs from "./mappings-to-aggs";

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
async function makeFacetQuery({ q, type }, client, index, headers) {
  let aggs = await getAggsFromMapping(client, index, headers);
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
  return params;
}

export default makeFacetQuery;
