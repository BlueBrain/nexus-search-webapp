import { loading } from "../actions";
import notifications from "../../libs/notifications";

const fetchingMiddleware = store => next => action => {
  if (action.type && action.type.indexOf("FETCH_STARTED") >= 0) {
    store.dispatch(loading.requestMade)
  }
  if (action.type && action.type.indexOf("FETCH_FINISHED") >= 0) {
    store.dispatch(loading.requestResolved)
  }
  if (action.type && action.type.indexOf("FETCH_FAILED") >= 0) {
    store.dispatch(loading.requestResolved)
    notifications.errors.connectionError();
  }
  next(action);
}

export default fetchingMiddleware;