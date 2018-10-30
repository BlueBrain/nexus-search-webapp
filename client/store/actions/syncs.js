import * as types from "./types";
import { auth } from "./index";

export default {
  triggerSync,
  fetchSyncEvents,
  fetchSyncStarted,
  fetchSyncFulfilled,
  fetchSyncFailed
};

function triggerSync() {
  return (dispatch, getState) => {
    const state = getState();
    const { elasticSearchAPI } = state.config;
    const { token } = state.auth;
    const documentURL = elasticSearchAPI + "/syncs/events";
    return fetch(documentURL, {
      headers: { Authorization: `Bearer ${token}`},
      method: 'post'
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
        // TODO migrate ES client handling to client not server;
        if (response.code) {
          switch(response.code) {
            case "UnauthorizedAccess":
              dispatch(auth.authenticate(window.location.href));
            break;
          }
          throw new Error("Bad response from server");
        }
      })
      .catch(error => {
        console.error(error);
      });
  };
}

function fetchSyncEvents() {
  return (dispatch, getState) => {
    const state = getState();
    const { elasticSearchAPI } = state.config;
    const { token } = state.auth;
    const documentURL = elasticSearchAPI + "/syncs/events";
    dispatch(fetchSyncStarted());
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
        // TODO migrate ES client handling to client not server;
        if (response.code) {
          switch(response.code) {
            case "UnauthorizedAccess":
              dispatch(auth.authenticate(window.location.href));
            break;
          }
          throw new Error("Bad response from server");
        }
        dispatch(fetchSyncFulfilled(response));
      })
      .catch(error => {
        console.error(error);
        dispatch(fetchSyncFailed(error));
      });
  };
}

function fetchSyncStarted() {
  return {
    type: types.FETCH_STARTED_SYNC
  };
}

function fetchSyncFulfilled(data) {
  return {
    type: types.FETCH_FULFILLED_SYNC,
    payload: data
  };
}

function fetchSyncFailed(error) {
  return {
    type: types.FETCH_FAILED_SYNC,
    error: error
  };
}