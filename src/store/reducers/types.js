import * as types from "../actions/types";

export default function typesReducer (
  state = {
    types: [],
    pending: true,
    error: null,
    hoverType: null
  },
  action
) {
  switch (action.type) {
    case types.FETCH_STARTED_TYPES:
      return Object.assign({}, state, {
        pending: true,
        error: null,
        types: []
      });

    case types.FETCH_FULTILLED_TYPES:
    return Object.assign({}, state, {
        pending: false,
        error: null,
        types: action.payload
      });

    case types.FETCH_FAILED_TYPES:
      return Object.assign({}, state, {
        pending: false,
        types: [],
        error: action.error
      });

    case types.UPDATE_HOVER_TYPE:
      return Object.assign({}, state, {
        hoverType: action.payload
      });

    default:
      return state;
  }
}
