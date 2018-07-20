import { auth } from "../actions";
import { bindActionCreators } from "redux";

const routeChangingMiddleware = store => next => action => {
  if (action.type && action.type.indexOf("LOCATION_CHANGE") >= 0) {
    // TODO is it an antipattern to put things here?
    let authenticate = bindActionCreators(auth.authenticate, store.dispatch);
    authenticate(window.location.href)
  }
  return next(action);
}

export default routeChangingMiddleware;