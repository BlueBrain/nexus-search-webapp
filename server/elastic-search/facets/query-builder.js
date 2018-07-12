import mappingToAggs from "./mappings-to-aggs";

async function getAggsFromMapping (client, index) {
  let properties = await client.indices.getMapping({
    index,
    type: "doc"
  })
  properties = properties[index].mappings.doc.properties;
  return mappingToAggs(properties)
}

/**
 *
 *
 * @param {object} nexusSearchQueryObject
 * @returns {object} an elastic search query object
 */
async function makeFacetQuery({ q, type }, client, index) {
  let aggs = await getAggsFromMapping(client, index);
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
