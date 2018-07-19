import { auth } from "../actions";
import { bindActionCreators } from "redux";

const routeChangingMiddleware = store => next => action => {
  if (action.type && action.type.indexOf("LOCATION_CHANGE") >= 0) {
    let authenticate = bindActionCreators(auth.authenticate, store.dispatch);
    authenticate(window.location.href)
    if (action.payload.search) {
      // DO QUERY UPDATING STUFF;
      console.log(window.location.href);
    }
  }
  next(action);
}

export default routeChangingMiddleware;