import * as types from "./types";

export default {
  fetchInstance,
  fetchInstanceStarted,
  fetchInstanceFulfilled,
  fetchInstanceFailed,
  setUseModalInstance
};

function fetchInstance(docID) {
  return (dispatch, getState) => {
    const state = getState();
    const { elasticSearchAPI } = state.config;
    const { token } = state.auth;
    const documentURL = elasticSearchAPI + "/instances/" + docID;
    dispatch(fetchInstanceStarted());
    return fetch(documentURL, {
      headers: { Authorization: `Bearer ${token}`}
    })
      .then(response => {
        if (response.ok) {
          return response.json();
        }
        throw new Error(
          `Encountered HTTP error ${
            response.status
          }. Instance is not available.`
        );
      })
      .then(response => {
        dispatch(fetchInstanceFulfilled(response));
      })
      .catch(error => {
        console.error(error);
        dispatch(fetchInstanceFailed(error));
      });
  };
}

function fetchInstanceStarted() {
  return {
    type: types.FETCH_STARTED_INSTANCE
  };
}

function fetchInstanceFulfilled(data) {
  return {
    type: types.FETCH_FULFILLED_INSTANCE,
    payload: data
  };
}

function fetchInstanceFailed(error) {
  return {
    type: types.FETCH_FAILED_INSTANCE,
    error: error
  };
}

function setUseModalInstance() {
  return {
    type: types.SET_USE_MODAL_INSTANCE
  };
}
