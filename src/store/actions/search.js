import * as types from "./types";
import qs from "query-string";
import {truthy} from "../../libs/utils";
import { push } from "react-router-redux";

export default {
  assignSearchParams: assignSearchParamsThunk,
  updateSearchQueryParams
};

function assignSearchParamsThunk (params) {
  return (dispatch, getState) => {
    let { routing, search } = getState();
    let updatedParams = truthy(Object.assign(search, params, { filter: params.filter || {} }));
    if (updatedParams.filter) {
      Object.keys(updatedParams.filter).forEach(key => {
        let filterKey = updatedParams.filter[key]
        if (!filterKey.length) {
          delete updatedParams.filter[key];
        }
      })
    }
    let URLParams = { ...updatedParams };
    if (URLParams.filter) { URLParams.filter = JSON.stringify(URLParams.filter); }
    let path = routing.location.pathname;
    let queryString = qs.stringify(URLParams);
    if (queryString) {
      let newURL = `${path}?${queryString}`;
      dispatch(push(newURL));
    }
    dispatch(updateSearchQueryParams(updatedParams));
  };
}

function updateSearchQueryParams(data) {
  return {
    type: types.ASSIGN_SEARCH_QUERY_PARAMS,
    payload: data
  };
}