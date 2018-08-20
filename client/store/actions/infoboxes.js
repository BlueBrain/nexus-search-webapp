import * as types from "./types";

export default {
  addInfobox,
  removeInfobox,
};

function addInfobox(key) {
  return {
    type: types.ADD_INFOBOX,
    payload: key
  };
}

function removeInfobox(key) {
  return {
    type: types.REMOVE_INFOBOX,
    payload: key
  };
}
