/**
 *
 *
 * @param {string} query
 * @returns {object} an elastic search query object
 */
function makeDocsQuery(query={ filter:null, type:null, q:null }) {
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
    // MUST is an AND, we do it for terms across filter sets
    let must = Object.keys(filter).map(key => {
      // SHOULD is an OR, we do it for terms in the same filter set
      let should = filter[key].map(filterTerm => {
        let propertyName = `${key}.raw`;
        return { term: { [propertyName]: filterTerm } };
      });

      let path = key.split('.');
      return path.reverse().reduce((memo, level, index) => {
        if (index === 0) {
          memo = {
            bool: {
            should
          }}
        } else {
          memo = {
            nested: {
              path: level,
              query: memo
            }
          }
        }
        return memo;
      }, {});
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
