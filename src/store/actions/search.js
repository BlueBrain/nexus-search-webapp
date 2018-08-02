import * as types from "./types";
import qs from "query-string";
import {truthy} from "../../libs/utils";
import { push } from "connected-react-router";
import { isEmpty } from "underscore";

export default {
  assignSearchParams: assignSearchParamsThunk,
  updateSearchQueryParams
};

function assignSearchParamsThunk (params) {
  return (dispatch, getState) => {
    let { router, search } = getState();
    let updatedParams = truthy(Object.assign(search, params));
    if (updatedParams.filter) {
      Object.keys(updatedParams.filter).forEach(key => {
        let filterKey = updatedParams.filter[key]
        if (!filterKey.length) {
          delete updatedParams.filter[key];
        }
      })
    }
    // if (!isEmpty(updatedParams.filter) && updatedParams.from > 0) {
    //   // every time filter is updated, remove the pagination settings to default
    //   updatedParams.from = 0;
    // }
    let URLParams = { ...updatedParams };
    if (URLParams.filter) { URLParams.filter = JSON.stringify(URLParams.filter); }
    let path = router.location.pathname;
    let queryString = qs.stringify(URLParams);
    if (queryString) {
      let newURL = `${path}?${queryString}`;
      dispatch(push(newURL));
    }
  };
}

function updateSearchQueryParams(data) {
  return {
    type: types.ASSIGN_SEARCH_QUERY_PARAMS,
    payload: data
  };
}