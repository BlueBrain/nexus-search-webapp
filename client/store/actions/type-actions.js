import * as types from "./types";
import qs from "query-string";
import { auth } from "./index";
import { truthy } from "@libs/utils";

export default {
  fetchTypes,
  fetchTypesStarted,
  fetchTypesFulfilled,
  fetchTypesFailed,
  updateHoverType
};

function fetchTypes() {
  return (dispatch, getState) => {
    let state = getState();
    const { q, type, filter } = state.search;
    const { token } = state.auth;
    const { elasticSearchAPI, uiConfig } = state.config;
    const typesAPI = elasticSearchAPI + "/types";
    let params = truthy({ q, type, filter });
    if (params.filter) {
      params.filter = JSON.stringify(params.filter);
    }
    dispatch(fetchTypesStarted());
    return fetch(typesAPI + "?" + qs.stringify(params), {
      headers: token ? { Authorization: `Bearer ${token}` } : {}
    })
      .then(response => {
        if (response.ok) {
          return response.json();
        }
        if (response.status === 401) {
          return dispatch(auth.logout({ reason: "invalid" }));
        }
        throw new Error(
          `Encountered HTTP error ${
            response.status
          }. Instance info is not available.`
        );
      })
      .then(response => {
        if (!response) { return; }
        dispatch(
          fetchTypesFulfilled(
            response.map(({ key, doc_count, color }) => {
              let typesUiConfig = uiConfig.types[key];
              return {
                label: typesUiConfig ? typesUiConfig.label : key,
                value: key,
                color: color,
                icon: typesUiConfig ? typesUiConfig.icon : null,
                amount: doc_count
              };
            })
          )
        );
      })
      .catch(error => {
        console.error(error);
        dispatch(fetchTypesFailed(error));
      });
  };
}

function fetchTypesStarted() {
  return {
    type: types.FETCH_STARTED_TYPES
  };
}

function fetchTypesFulfilled(data) {
  return {
    type: types.FETCH_FULTILLED_TYPES,
    payload: data
  };
}

function fetchTypesFailed(error) {
  return {
    type: types.FETCH_FAILED_TYPES,
    error: error
  };
}

function updateHoverType(data) {
  return {
    type: types.UPDATE_HOVER_TYPE,
    payload: data
  };
}
