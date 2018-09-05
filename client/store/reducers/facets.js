import * as types from "../actions/types";

const DEFAULT_FACETS = [];

export default function facets (
  state = {
    results: DEFAULT_FACETS,
    pending: true,
    error: null,
  },
  action
) {
  switch (action.type) {

    case types.FETCH_STARTED_FACETS:
      return Object.assign({}, state, {
        pending: true,
        error: null,
        results: [],
      });

    case types.FETCH_FULFILLED_FACETS:
      return Object.assign({}, state, {
        pending: false,
        error: null,
      });

    case types.FACETS_NORMALIZED:
      return Object.assign({}, state, {
        results: action.payload,
      });

    case types.FETCH_FAILED_FACETS:
      return Object.assign({}, state, {
        pending: false,
        results: [],
        error: action.error,
      });

    default:
      return state;
  }
}
