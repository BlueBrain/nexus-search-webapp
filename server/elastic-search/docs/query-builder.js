const SPECIAL_CASES = {
  distribution: 'mediaType',
  brainLocation: 'brainRegion.label'
 }

/**
 *
 *
 * @param {string} query
 * @returns {object} an elastic search query object
 */
function makeDocsQuery(query) {
  let params = {
    query: {
      bool: {
        must: []
      }
    }
  };
  let { filter, type, q } = query;
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
    console.log("FILTER: ", filter);
    // MUST is an AND, we do it for terms across filter sets
    let must = Object.keys(filter).map(key => {
      // SHOULD is an OR, we do it for terms in the same filter set
      let should = filter[key].map(filterTerm => {
        let specialCase = SPECIAL_CASES[key];
        // TODO programatically deal with special case;
        let propertyName = `${key}.${specialCase || "label"}.raw`;
        return { term: { [propertyName]: filterTerm } };
      });
      if (key === "brainLocation") {
        return {
          nested: {
            path: "brainLocation",
            query: {
              nested: {
                path: "brainRegion",
                query: should[0]
                  // should[0]
                  // bool: {
                  //   should
                  // }
                // }
              }
            }
          }
        }
      }
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
  return params
}

export default makeDocsQuery;
