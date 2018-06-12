 const SPECIAL_CASES = {
  distribution: 'mediaType'
 }

 /**
  *
  *
  * @param {object} properties elasitc search properties from mappings
  * @returns {object} aggrigation
  */
 function mappingToArgs(properties, path) {
  return Object.keys(properties)
    // first, we only need properties of type "nested"
    .filter(key => properties[key].type === "nested")
    // then we transform the object recursively to an agg thing
    .reduce((memo, key) => {
      let property = properties[key];

      let label = property.properties.label || property.properties[SPECIAL_CASES[key]];
      let pathName = (path? path + "." : "") + key
      let aggs = {};
      if (label) {
        let field = SPECIAL_CASES[key]
        ? `${pathName}.${SPECIAL_CASES[key]}.raw`
        : `${pathName}.label.raw`
        aggs = {
          // "labels" can be any name
          labels: {
            terms: {
              field
            }
          }
        }
      } else {
        aggs = mappingToArgs(property.properties, key)
      }
      memo[key] = {
        nested: {
          path: pathName
        },
        aggs
      }
      return memo;
    }, {});
}

  export default mappingToArgs;