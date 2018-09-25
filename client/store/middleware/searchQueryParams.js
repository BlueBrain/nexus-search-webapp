import { types, facets, query } from "../actions";
import * as typeConsts from "../actions/types";
import isEqual from "fast-deep-equal";
import { getProp } from "@libs/utils";

const routeChangingMiddleware = store => next => action => {
  if (action.type && action.type.indexOf(typeConsts.ASSIGN_SEARCH_QUERY_PARAMS) >= 0) {
    const { search: currentSearchParams } = store.getState();
    const nextSearchParams = action.payload || {};
    const isSameFilter = !isEqual(getProp(currentSearchParams, "filter"), getProp(nextSearchParams, "filter"));

    // Update Types
    if (
      currentSearchParams.q !== nextSearchParams.q ||
      !isSameFilter
    ) {
      store.dispatch(types.fetchTypes())
    }

    // Update facets
    if (
      currentSearchParams.q !== nextSearchParams.q ||
      currentSearchParams.type !== nextSearchParams.type ||
      !isSameFilter
    ) {
      store.dispatch(facets.fetchFacets())
    }

    // Update documents
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