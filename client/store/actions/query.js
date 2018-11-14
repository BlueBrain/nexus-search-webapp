import * as types from "./types";
import qs from "query-string";
import {truthy} from "@libs/utils";
import { auth } from "./index";

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
    const { token } = state.auth;
    const { q, size, from, type, filter, sort } = state.search;
    const searchAPI = elasticSearchAPI + "/docs";
    let params = truthy({ q, size, from, type, filter, sort});
    if (params.filter) { params.filter = JSON.stringify(params.filter); }
    if (params.sort) { params.sort = JSON.stringify(params.sort); }
    dispatch(fetchQueryStarted());
    return fetch(
      searchAPI + "?" + qs.stringify(params),
      {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      }
    )
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
          dispatch(
            fetchQueryFulfilled({ hits: response.total, results: response.hits })
          );
        }
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
