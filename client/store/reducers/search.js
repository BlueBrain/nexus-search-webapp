import * as types from "../actions/types";
import getSearchParamsFromURL from "../../libs/query";


let {
  filter,
  q,
  type,
  from,
  size,
  listType,
  sort
} = getSearchParamsFromURL();

export default function search(
  state = {
    filter,
    from,
    q,
    size,
    type,
    listType,
    sort
  },
  action
) {
  switch (action.type) {
    case types.ASSIGN_SEARCH_QUERY_PARAMS:
      return Object.assign({}, state, {
        ...action.payload
      });
    default:
      return state;
  }
}
