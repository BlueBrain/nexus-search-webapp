import palettes from "distinct-colors";

/**
 *
 *
 * @param {Object} docs elastic search response
 * @returns
 */
function normalizer (docs) {
  let types = docs.aggregations["@types"].buckets;
  // TODO add tests for colors or move to client
  let palette = palettes({
    count: types.length,
    chromaMax: 80,
    lightMin: 70
  });
  types = types.map((type, index) => {
    type.color = palette[index].hex();
    return type;
  });
  return types
}

export default normalizer;