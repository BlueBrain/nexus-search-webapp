import { auth, search } from "../actions";
import { bindActionCreators } from "redux";
import query from "../../libs/query";
import { getProp } from "../../libs/utils";

const routeChangingMiddleware = store => next => action => {
  if (action.type && action.type.indexOf("LOCATION_CHANGE") >= 0) {
    // TODO is it an antipattern to put things here?
    let authenticate = bindActionCreators(auth.authenticate, store.dispatch);
    authenticate(window.location.href)
    let searchQueryParams = getProp(action, "payload.location.search");
    if (searchQueryParams) {
      store.dispatch(search.updateSearchQueryParams(query(searchQueryParams)))
    }
  }
  return next(action);
}

export default routeChangingMiddleware;