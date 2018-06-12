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
  let params = {
    aggs: await getAggsFromMapping(client, index)
  };
  if (type) {
    params.query = {
      match: {
        "@type.raw": type
      }
    };
  }
  return params;
}

export default makeFacetQuery;
