import * as types from './types';

export default {
  requestMade,
  requestResolved
}


function requestMade() {
  return {
    type: types.REQUEST_MADE,
  }
}

function requestResolved() {
  return {
    type: types.REQUEST_RESOLVED,
  }
}
