import * as types from "./types";
import qs from "query-string";
import { resultsToFacetWithSelection } from "./facetNormalizer";
import getQueryFromUrl from "../../libs/query";

export default {
  fetchFacets,
  fetchFacetsStarted,
  fetchFacetsFulfilled,
  fetchFacetsFailed,
  normalizeFacets
};

function fetchFacets(type, query) {
  return (dispatch, getState) => {
    let state = getState();
    const { elasticSearchAPI } = state.config;
    const facetsAPI = elasticSearchAPI + "/facets";
    // const { selectedFacets } = getQueryFromUrl(state.routing);
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
        normalizeFacets(response)(dispatch, getState);
      })
      .catch(error => {
        console.error(error);
        dispatch(fetchFacetsFailed(error));
      });
  };
}

function normalizeFacets (response) {
  return (dispatch, getState) => {
    const { selectedFacets } = getQueryFromUrl(getState().routing);
    dispatch(
      facetsNormalized(resultsToFacetWithSelection(response, selectedFacets))
    );
    dispatch(
      fetchFacetsFulfilled()
    );
  }
}

function facetsNormalized(data) {
  return {
    type: types.FACETS_NORMALIZED,
    payload: data
  };
}

function fetchFacetsStarted() {
  return {
    type: types.FETCH_STARTED_FACETS
  };
}

function fetchFacetsFulfilled() {
  return {
    type: types.FETCH_FULFILLED_FACETS,
  };
}

function fetchFacetsFailed(error) {
  return {
    type: types.FETCH_FAILED_FACETS,
    error: error
  };
}
