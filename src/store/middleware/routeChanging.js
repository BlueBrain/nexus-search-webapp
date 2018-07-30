import { auth, search } from "../actions";
import { bindActionCreators } from "redux";
import query from "../../libs/query";
const routeChangingMiddleware = store => next => action => {
  if (action.type && action.type.indexOf("LOCATION_CHANGE") >= 0) {
    // TODO is it an antipattern to put things here?
    let authenticate = bindActionCreators(auth.authenticate, store.dispatch);
    authenticate(window.location.href)
    if (action.payload.search) {
      store.dispatch(search.updateSearchQueryParams(query(action.payload.search)))
    }
  }
  return next(action);
}

export default routeChangingMiddleware;