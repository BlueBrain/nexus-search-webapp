import * as types from "./types";
import qs from "query-string";
import {truthy} from "../../libs/utils";
export default {
  fetchQuery,
  fetchQueryStarted,
  fetchQueryFulfilled,
  fetchQueryFailed
};

function fetchQuery() {
  return (dispatch, getState) => {
    let state = getState();
    const { elasticSearchAPI } = state.config;
    const { q, size, from, type, filter } = state.search;
    const searchAPI = elasticSearchAPI + "/docs";
    let params = truthy({ q, size, from, type, filter});
    if (params.filter) { params.filter = JSON.stringify(params.filter); }
    dispatch(fetchQueryStarted());
    return fetch(
      searchAPI + "?" + qs.stringify(params)
    )
      .then(response => {
        if (response.ok) {
          return response.json();
        }
        throw new Error(
          `Encountered HTTP error ${response.status}. Query is not available.`
        );
      })
      .then(response => {
        dispatch(
          fetchQueryFulfilled({ hits: response.total, results: response.hits })
        );
      })
      .catch(error => {
        console.error(error);
        dispatch(fetchQueryFailed(error));
      });
  };
}

function fetchQueryStarted() {
  return {
    type: types.FETCH_STARTED_QUERY
  };
}

function fetchQueryFulfilled(data) {
  return {
    type: types.FETCH_FULFILLED_QUERY,
    payload: data
  };
}

function fetchQueryFailed(error) {
  return {
    type: types.FETCH_FAILED_QUERY,
    error: error
  };
}
