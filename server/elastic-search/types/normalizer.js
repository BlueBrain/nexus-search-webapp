import palettes from "distinct-colors";

const COLOR_SETTINGS = {
  chromaMax: 80,
  lightMin: 70
};

/**
 *
 *
 * @param {Object} docs elastic search response
 * @returns {Array} types
 */
function normalizer (docs) {
  if (!docs.aggregations) {
    return [];
  }
  let types = docs.aggregations["@types"].buckets;
  // TODO: hardcoded a count for consistency,
  // this should absolutely be moved to client
  // when distinct-colors npm package's browser
  // bugs are fixed
  let palette = palettes({
    count: types.length > 4 ? types.length : 4,
    ...COLOR_SETTINGS
  });
  types = types.map((type, index) => {
    type.color = palette[index].hex();
    return type;
  });
  return types
}

export default normalizer;