import * as types from "./types";
import qs from "query-string";

export default {
  fetchTypes,
  fetchTypesStarted,
  fetchTypesFulfilled,
  fetchTypesFailed,
  updateHoverType
};

function fetchTypes(query) {
  return (dispatch, getState) => {
    let state = getState();
    const { elasticSearchAPI, uiConfig, routing } = state.config;
    const typesAPI = elasticSearchAPI + "/types";
    dispatch(fetchTypesStarted());
    return fetch(typesAPI + "?" + qs.stringify({ q: query }))
      .then(response => {
        if (response.ok) {
          return response.json();
        }
        throw new Error(
          `Encountered HTTP error ${
            response.status
          }. Instance info is not available.`
        );
      })
      .then(response => {
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
