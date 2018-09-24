import * as types from "./types";
import qs from "query-string";
import { auth } from "./index";
import {
  facetNormalizer,
  resultsToFacetWithSelection
} from "./facetNormalizer";
import { truthy } from "@libs/utils";

export default {
  fetchFacets,
  fetchFacetsStarted,
  fetchFacetsFulfilled,
  fetchFacetsFailed,
  normalizeFacets
};

function fetchFacets() {
  return (dispatch, getState) => {
    let state = getState();
    const { token } = state.auth;
    const { q, type, filter } = state.search;
    const { elasticSearchAPI } = state.config;
    const facetsAPI = elasticSearchAPI + "/facets";
    let params = truthy({ q, type, filter });
    if (params.filter) {
      params.filter = JSON.stringify(params.filter);
    }
    dispatch(fetchFacetsStarted());
    // TODO make query change
    return fetch(facetsAPI + "?" + qs.stringify(params), {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(response => {
        if (response.ok) {
          return response.json();
        }
        if (response.status === 401) {
          return dispatch(auth.logout({ reason: "invalid" }));
        }
        throw new Error(
          `Encountered HTTP error ${response.status}. Query is not available.`
        );
      })
      .then(response => {
        if (response) {
          normalizeFacets(facetNormalizer(response))(dispatch, getState);
        }
      })
      .catch(error => {
        console.error(error);
        dispatch(fetchFacetsFailed(error));
      });
  };
}

function normalizeFacets(response) {
  return (dispatch, getState) => {
    const { search, config } = getState();
    dispatch(
      facetsNormalized(
        resultsToFacetWithSelection(
          response,
          search.filter,
          config.uiConfig.filters.ignore
        )
      )
    );
    dispatch(fetchFacetsFulfilled());
  };
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
    type: types.FETCH_FULFILLED_FACETS
  };
}

function fetchFacetsFailed(error) {
  return {
    type: types.FETCH_FAILED_FACETS,
    error: error
  };
}
