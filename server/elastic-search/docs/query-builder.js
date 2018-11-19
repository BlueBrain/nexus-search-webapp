/**
 *
 *
 * @param {string} query
 * @returns {object} an elastic search query object
 */
function makeDocsQuery(
  query = { filter: null, type: null, q: null, sort: null }
) {
  let params = {
    query: {
      bool: {
        must: []
      }
    }
  };
  let { sort, filter, type, q } = query;
  // TODO mop this up by using MAPPING or SCHEMA to assemble sorting
  if (sort) {
    sort = JSON.parse(sort);
    if (sort.field) {
      if (sort.field === "@type") {
        let field = sort.field + ".raw";
        params.sort = [
          {
            [field]: {
              order: sort.order
            }
          }
        ];
      } else {
        let field = sort.field + ".raw";
        params.sort = [
          {
            [field]: {
              order: sort.order,
              nested: {
                path: sort.field
              }
            }
          }
        ];
      }
    }
  }
  if (q) {
    params.query.bool.must.push({
      // query: {
        // fields : ["eType*", "label", "subject.*", "@id.*", "@type.*", "brainLocation.*", "name"],
        query_string: {
          query: `(${q}* OR ${q}~)`
        }
        // match: {
        //   "_all": query.q
        // }
      // }
    });
    // TODO how to speed up?
    // params.highlight = {
    //   fields: {
    //     "*": {}
    //   },
    //   require_field_match: false
    // }
  }
  if (type) {
    params.query.bool.must.push({
      term: { "@type.raw": query.type }
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

export default makeDocsQuery;
