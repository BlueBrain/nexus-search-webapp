import { get } from "../../libs/object";
// TODO make

 /**
  *
  *
  * @param {object} properties elasitc search properties from mappings
  * @returns {object} aggrigation
  */
 function mappingToArgs(properties, path) {
  return Object.keys(properties)
    .filter(key => properties[key].type === "nested")
    .reduce((memo, key) => {
      let property = properties[key];
      let pathName = (path? path + "." : "") + key
      let aggs = Object.keys(property.properties)
        .reduce((memo, propKey) => {
          let keyword = get(['fields', 'raw', 'type'], property.properties[propKey]);

          // TODO put into a config
          if (propKey === "@id") {
            return memo;
          }
          if (keyword) {
            let label = propKey;
            let field = `${pathName}.${propKey}.raw`;
            memo[label] =
              {
                terms: {
                  field,
                  // TODO maybe this should be more reasonable?
                  // Default size is 10
                  size: 999999999
                }
              };
          }
          return memo
        }, {});
      if (!Object.keys(aggs).length) {
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