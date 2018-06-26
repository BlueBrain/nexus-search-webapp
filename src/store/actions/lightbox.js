import * as types from './types';

export default {
  lightboxOpen,
  lightboxClose
}

function lightboxOpen() {
  return {
    type: types.LIGHTBOX_OPEN,
  }
}

function lightboxClose() {
  return {
    type: types.LIGHTBOX_CLOSE,
  }
}
