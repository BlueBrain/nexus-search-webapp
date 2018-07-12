import * as types from "./types";
import qs from "query-string";
import {facetNormalizer} from "./facetNormalizer";
import getQueryFromUrl from "../../libs/query";

export default {
  fetchFacets,
  fetchFacetsStarted,
  fetchFacetsFulfilled,
  fetchFacetsFailed
};

function fetchFacets(type, query) {
  return (dispatch, getState) => {
    let state = getState();
    const { elasticSearchAPI } = state.config;
    const facetsAPI = elasticSearchAPI + "/facets";
    const { selectedFacets } = getQueryFromUrl(state.routing);
    dispatch(fetchFacetsStarted());
    // TODO make query change
    return fetch(facetsAPI + "?" + qs.stringify({ type, q: query }))
      .then(response => {
        if (response.ok) {
          return response.json();
        }
        throw new Error(
          `Encountered HTTP error ${response.status}. Query is not available.`
        );
      })
      .then(response => {
        dispatch(fetchFacetsFulfilled(facetNormalizer(response, selectedFacets)));
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
