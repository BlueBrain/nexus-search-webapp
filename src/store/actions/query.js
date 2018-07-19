import * as types from "./types";
import qs from "query-string";

export default {
  fetchQuery,
  fetchQueryStarted,
  fetchQueryFulfilled,
  fetchQueryFailed
};

function fetchQuery({ query, size, from, type, filter }) {
  return (dispatch, getState) => {
    let state = getState();
    const { elasticSearchAPI, uiConfig, routing } = state.config;
    const searchAPI = elasticSearchAPI + "/docs";
    dispatch(fetchQueryStarted());
    // TODO make query change
    return fetch(
      searchAPI + "?" + qs.stringify({ q: query, size, from, type, filter })
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
