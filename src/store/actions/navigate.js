import { push } from "connected-react-router";
import instanceActions from "./instance";
import * as types from "./types";
import qs from "query-string";
import { truthy } from "../../libs/utils";

const updateQuery = ({ query, type, instance, filter }) => {
  return (dispatch, getState) => {
    let { router } = getState();
    let path = router.location.pathname;
    const queryTerm =
      query === undefined ?
      qs.parse(router.location.search).q : query;
    const filterTerm =
      filter === undefined ?
      qs.parse(router.location.search).filter : filter !== null ? JSON.stringify(filter) : null;
    const selectedType =
      type === undefined ? qs.parse(router.location.search).type : type;
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
    const basename = getState().router.location.basename || "";
    dispatch(push(`${basename}/${url}`));
  };
};

const goToSearch = query => {
  return (dispatch, getState) => {
    const basename = getState().router.location.basename || "";
    dispatch(push(`${basename}/search?q=${query}`));
  };
};

const goToDetailsPageByID = id => {
  return (dispatch, getState) => {
    const basename = getState().router.location.basename || "";
    dispatch(push(`${basename}/docs/${id}`));
  };
};

const goDown = () => {
  return (dispatch, getState) => {
    const oldRoute = getState().router.location.pathname;
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
    const { router } = getState();
    const instanceID =  qs.parse(router.location.search).instance;
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
  goToDetailsPageByID,
  goToSearch,
  updateQuery
};
