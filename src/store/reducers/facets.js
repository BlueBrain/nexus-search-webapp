import * as types from "../actions/types";

const DEFAULT_FACETS = [
  {
    title: "has Attachments",
    facetOptions: [{
      label: "png",
      value: "png",
      amount: 3
    }]
  }
]

export default function query (
  state = {
    results: DEFAULT_FACETS,
    pending: false,
    error: null,
  },
  action
) {
  switch (action.type) {

    case types.FETCH_FACETS_STARTED:
      return Object.assign({}, state, {
        pending: true,
        error: null,
        results: [],
      });

    case types.FETCH_FACETS_FULFILLED:
      return Object.assign({}, state, {
        pending: false,
        error: null,
        results: action.payload,
      });

    case types.FETCH_FACETS_FAILED:
      return Object.assign({}, state, {
        pending: false,
        results: [],
        error: action.error,
      });

    default:
      return state;
  }
}
