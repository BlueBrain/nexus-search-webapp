import * as types from '../actions/types'

export default function syncEvents (state = {
  pending: false,
  data: null,
  error: null,
}, action) {
  switch (action.type) {

    case types.FETCH_STARTED_SYNC:
      return Object.assign({}, state, {
        pending: true,
        data: null
      });

    case types.FETCH_FULFILLED_SYNC:
      return Object.assign({}, state, {
        pending: false,
        data: action.payload
      });

    case types.FETCH_FAILED_SYNC:
      return Object.assign({}, state, {
        pending: false,
        data: null,
        error: action.error
      });

    default:
      return state;
  }
}
