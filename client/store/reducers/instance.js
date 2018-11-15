import * as types from '../actions/types'

export default function instance (state = {
  pending: false,
  data: null,
  error: null,
  useModal: false,
}, action) {
  switch (action.type) {

    case types.FETCH_STARTED_INSTANCE:
      return Object.assign({}, state, {
        pending: true,
        data: null
      });

    case types.FETCH_FULFILLED_INSTANCE:
      return Object.assign({}, state, {
        pending: false,
        data: action.payload._source
      });

    case types.FETCH_FAILED_INSTANCE:
      return Object.assign({}, state, {
        pending: false,
        data: null,
        error: action.error
      });

    case types.SET_USE_MODAL_INSTANCE:
      return Object.assign({}, state, {
        useModal: true
      });


    default:
      return state;
  }
}
