const typeAggs = {
  "@types": {
    terms: {
      field: "@type.raw"
    }
  }
};
/**
 *
 *
 * @param {string} textQuery
 * @returns {object} an elastic search query object
 */
function makeTypeQuery({ q, filter }={q: null, filter: null}) {
  let params = {
    query: {
      bool: {
        must: []
      }
    },
    aggs: typeAggs
  };
  if (q) {
    params.query.bool.must.push({
      query_string: {
        query: `(${q}* OR ${q}~)`
      }
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

export default makeTypeQuery;
