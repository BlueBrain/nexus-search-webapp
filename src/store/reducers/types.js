import * as types from "../actions/types";

export default function typesReducer (
  state = {
    types: [],
    pending: false,
    error: null
  },
  action
) {
  switch (action.type) {
    case types.FETCH_TYPES_STARTED:
      return Object.assign({}, state, {
        pending: true,
        error: null,
        types: []
      });

    case types.FETCH_TYPES_FULFILLED:
      return Object.assign({}, state, {
        pending: false,
        error: null,
        types: action.payload
      });

    case types.FETCH_TYPES_FAILED:
      return Object.assign({}, state, {
        pending: false,
        types: [],
        error: action.error
      });

    default:
      return state;
  }
}
