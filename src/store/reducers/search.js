import * as types from "../actions/types";
import getSearchParamsFromURL from "../../libs/query";

const DEFAULT_PAGE_SIZE = 20;
let { filter, q, type } = getSearchParamsFromURL();
export default function search (
  state = {
    filter,
    from: 0,
    q,
    size: DEFAULT_PAGE_SIZE,
    type,
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
