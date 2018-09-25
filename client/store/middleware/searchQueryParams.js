import { facets, query } from "../actions";
import * as types from "../actions/types";
import isEqual from "fast-deep-equal";

const routeChangingMiddleware = store => next => action => {
  if (action.type && action.type.indexOf(types.ASSIGN_SEARCH_QUERY_PARAMS) >= 0) {
    const { search: currentSearchParams } = store.getState();
    const nextSearchParams = action.payload;
    if (
      currentSearchParams.q !== nextSearchParams.q ||
      currentSearchParams.type !== nextSearchParams.type ||
      !isEqual(currentSearchParams.filter, nextSearchParam.filter)
    ) {
      store.dispatch(facets.fetchFacets())
    }
    if (
      currentSearchParams.q !== nextSearchParams.q ||
      currentSearchParams.type !== nextSearchParams.type ||
      currentSearchParams.from !== nextSearchParams.from ||
      currentSearchParams.sort !== nextSearchParams.sort ||
      !isEqual(currentSearchParams.filter, nextSearchParam.filter)
    ) {
      store.dispatch(query.fetchQuery())
    }
  }
  return next(action);
}

export default routeChangingMiddleware;