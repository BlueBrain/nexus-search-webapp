const typeAggs = {
  "@types": {
    terms: {
      field: "@type.raw"
    }
  }
};

/**
 * make a query_string es query object with a given string input
 *
 * @param {string} textQuery
 * @returns {object} an elastic search query_string object
 */
function makeQueryStringWithText (textQuery) {
  return {
    query_string: {
        query: `(${textQuery}* OR ${textQuery}~)`
    }
  };
}

/**
 *
 *
 * @param {string} textQuery
 * @returns {object} an elastic search query object
 */
function makeTypeQuery({ q }={q: null}) {
  let params = {
    aggs: typeAggs
  };
  if (q) {
    params.query = makeQueryStringWithText(q)
  }
  return params;
}

export default makeTypeQuery;
