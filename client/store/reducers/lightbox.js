import * as types from '../actions/types'

export default function lightbox (state = {
  open: false
}, action) {
  switch (action.type) {

    case types.LIGHTBOX_OPEN:
      return Object.assign({}, state, {
        open: true
      });

    case types.LIGHTBOX_CLOSE:
      return Object.assign({}, state, {
        open: false
      });

    default:
      return state;
  }
}
