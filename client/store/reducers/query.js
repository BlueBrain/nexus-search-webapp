import * as types from "../actions/types";

export default function docs (
  state = {
    results: [],
    pending: true,
    error: null,
    hits: 0
  },
  action
) {
  switch (action.type) {
    case types.FETCH_STARTED_QUERY:
      return Object.assign({}, state, {
        pending: true,
        error: null,
        hits: 0
      });

    case types.FETCH_FULFILLED_QUERY:
      return Object.assign({}, state, {
        pending: false,
        error: null,
        results: action.payload.results,
        hits: action.payload.hits
      });

    case types.FETCH_FAILED_QUERY:
      return Object.assign({}, state, {
        pending: false,
        results: [],
        error: action.error,
        hits: 0
      });

    default:
      return state;
  }
}
