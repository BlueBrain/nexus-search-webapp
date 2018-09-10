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
  let types = docs.aggregations["@types"].buckets;
  // TODO move to client?
  let palette = palettes({
    count: types.length,
    ...COLOR_SETTINGS
  });
  types = types.map((type, index) => {
    type.color = palette[index].hex();
    return type;
  });
  return types
}

export default normalizer;