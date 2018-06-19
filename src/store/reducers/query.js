import * as types from "../actions/types";

export default function query (
  state = {
    results: [],
    pending: false,
    error: null,
    hits: 0
  },
  action
) {
  switch (action.type) {

    case types.FETCH_QUERY_STARTED:
      return Object.assign({}, state, {
        pending: true,
        error: null,
        results: [],
        hits: 0
      });

    case types.FETCH_QUERY_FULFILLED:
      return Object.assign({}, state, {
        pending: false,
        error: null,
        results: action.payload.results,
        hits: action.payload.hits
      });

    case types.FETCH_QUERY_FAILED:
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
