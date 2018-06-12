import * as types from "./types";
import qs from 'query-string';

export default {
  fetchFacets,
  fetchFacetsStarted,
  fetchFacetsFulfilled,
  fetchFacetsFailed
};

function fetchFacets(type) {
  return (dispatch, getState) => {
    let state = getState();
    const { location } = state.routing;
    const { elasticSearchAPI } = state.config;
    const facetsAPI = elasticSearchAPI + "/facets";
    dispatch(fetchFacetsStarted());
    // TODO make query change
    return fetch(facetsAPI + "?" + qs.stringify({ type }))
      .then(response => {
        if (response.ok) {
          return response.json();
        }
        throw new Error(
          `Encountered HTTP error ${
            response.status
          }. Query is not available.`
        );
      })
      .then(response => {
        let normalizedFacets = Object.keys(response).map((key, i) => {
          // TODO make recursive, or flatten object instead of hardcoded
          let buckets;
          if (key === "brainLocation") {
            buckets = response[key]["brainRegion"].labels.buckets;
          } else if (!response[key].labels) {
            buckets = [];
          } else {
            buckets = response[key].labels.buckets
          }
          return {
            title: key,
            total: response[key].doc_count,
            facetOptions: buckets.map(bucket => {
              return {
                label: bucket.key,
                value: bucket.key,
                amount: bucket.doc_count
              }
            })
          }
        })
        dispatch(
          fetchFacetsFulfilled(
           normalizedFacets.sort((a, b) => b.total - a.total)
          )
        );
      })
      .catch(error => {
        console.error(error);
        dispatch(fetchFacetsFailed(error));
      });
  };
}

function fetchFacetsStarted() {
  return {
    type: types.FETCH_FACETS_STARTED
  };
}

function fetchFacetsFulfilled(data) {
  return {
    type: types.FETCH_FACETS_FULFILLED,
    payload: data
  };
}

function fetchFacetsFailed(error) {
  return {
    type: types.FETCH_FACETS_FAILED,
    error: error
  };
}
