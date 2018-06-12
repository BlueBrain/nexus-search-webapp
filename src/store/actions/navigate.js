import { push } from "react-router-redux";
import instanceActions from "./instance";
import * as types from "./types";
import qs from "query-string";
import { truthy } from "../../libs/utils";

const updateQuery = ({ query, type, instance, filter }) => {
  return (dispatch, getState) => {
    let { routing } = getState();
    let path = routing.location.pathname;
    const queryTerm =
      query === undefined ?
      qs.parse(routing.location.search).q : query;
    const filterTerm =
      filter === undefined ?
      qs.parse(routing.location.search).filter : JSON.stringify(filter);
    const selectedType =
      type === undefined ? qs.parse(routing.location.search).type : type;
    let queryStringObject = truthy({ q: queryTerm, type: selectedType, instance, filter: filterTerm });
    let queryString = qs.stringify(queryStringObject);
    if (queryString) {
      return dispatch(push(`${path}?${queryString}`));
    }
    return dispatch(push(path));
  };
};

const navigate = url => {
  return (dispatch, getState) => {
    const basename = getState().routing.location.basename || "";
    dispatch(push(`${basename}/${url}`));
  };
};

const goToSearch = query => {
  return (dispatch, getState) => {
    const basename = getState().routing.location.basename || "";
    dispatch(push(`${basename}/search?q=${query}`));
  };
};

const goToEntityByID = id => {
  return (dispatch) => {
    dispatch(updateQuery({ instance: id }));
  };
};

const goDown = () => {
  return (dispatch, getState) => {
    const oldRoute = getState().routing.location.pathname;
    const paths = oldRoute.split("/").slice(1);
    // if last element of the path is a version, remove that at
    // the same time we remove the schema part of the path (do two pops, not just one)
    const versionIndex = 4;
    if (paths.length === versionIndex) {
      paths.pop();
    }
    paths.pop();
    const newUrl = paths.join("/");
    dispatch(navigate(newUrl));
  };
};

const reconcileRoutes = () => {
  return (dispatch, getState) => {
    const { routing } = getState();
    const instanceID =  qs.parse(routing.location.search).instance;
    if (instanceID) {
      dispatch(instanceActions.fetchInstance());
    }
  };
};

const fetchListFailed = (error, entity) => {
  error.entity = entity;
  return {
    type: types.FETCH_LIST_FAILED,
    error
  };
};

export default {
  navigate,
  goDown,
  reconcileRoutes,
  fetchListFailed,
  goToEntityByID,
  goToSearch,
  updateQuery
};
