import { Organization, Project, PaginatedList, Resource } from '@bbp/nexus-sdk';
import { FetchableState, createFetchReducer } from './utils';
import {
  FilterActions,
  actionTypes as FilterActionTypes,
  Filter,
} from '../actions/filters';
import {
  DatasetsActions,
  actionTypes as DatasetsActionsTypes,
} from '../actions/datasets';

export interface DatasetsState {
  datasets: FetchableState<PaginatedList<any>>;
  filters: FetchableState<PaginatedList<Filter>>;
}

const initialState: DatasetsState = {
  datasets: {
    isFetching: false,
    data: { total: 0, index: 0, results: [] },
    error: null,
  },
  filters: {
    isFetching: false,
    data: { total: 0, index: 0, results: [] },
    error: null,
  },
};

const datasetsFetchingReducer = createFetchReducer(DatasetsActionsTypes, []);
const filtersReducer = createFetchReducer(FilterActionTypes, []);

export default function datasetsReducer(
  state: DatasetsState = initialState,
  action: FilterActions
) {
  if (action.type.startsWith('@@nexus/FILTERS')) {
    return {
      ...state,
      filters: filtersReducer(state.filters, action),
    };
  }
  if (action.type.startsWith('@@nexus/DATASETS')) {
    return {
      ...state,
      datasets: datasetsFetchingReducer(state.datasets, action),
    };
  }
  return state;
}
