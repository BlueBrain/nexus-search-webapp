import { ActionCreator, Dispatch } from 'redux';
import { PaginatedList, PaginationSettings } from '@bbp/nexus-sdk';
import { ThunkAction } from '../';
import { FetchAction, FetchFulfilledAction, FetchFailedAction } from './utils';
import { mindsQuery } from './queries/filters';

enum FiltersActionTypes {
  FETCHING = '@@nexus/FILTERS_FETCHING',
  FULFILLED = '@@nexus/FILTERS_FETCHING_FULFILLED',
  FAILED = '@@nexus/FILTERS_FETCHING_FAILED',
}

export const actionTypes = {
  FETCHING: FiltersActionTypes.FETCHING,
  FULFILLED: FiltersActionTypes.FULFILLED,
  FAILED: FiltersActionTypes.FAILED,
};

const fetchFiltersAction: ActionCreator<
  FetchAction<FiltersActionTypes.FETCHING>
> = () => ({
  type: FiltersActionTypes.FETCHING,
});

const fetchFiltersFulfilledAction: ActionCreator<
  FetchFulfilledAction<FiltersActionTypes.FULFILLED, PaginatedList<Filter>>
> = (datasets: PaginatedList<Filter>) => ({
  type: FiltersActionTypes.FULFILLED,
  payload: datasets,
});

const fetchFiltersFailedAction: ActionCreator<
  FetchFailedAction<FiltersActionTypes.FAILED>
> = (error: Error) => ({
  error,
  type: FiltersActionTypes.FAILED,
});

export interface Binding {
  [filterName: string]: { type: string; value: string };
}

export interface Filter {
  name: string;
  values: {
    id: string;
    label: string;
  }[];
}

export type FilterActions =
  | FetchAction<FiltersActionTypes.FETCHING>
  | FetchFulfilledAction<FiltersActionTypes.FULFILLED, PaginatedList<Filter>>
  | FetchFailedAction<FiltersActionTypes.FAILED>;

export const fetchFilters: ActionCreator<ThunkAction> = (
  paginationSettings?: PaginationSettings
) => {
  return async (
    dispatch: Dispatch<any>,
    getState,
    { nexus }
  ): Promise<
    | FetchFulfilledAction<FiltersActionTypes.FULFILLED, PaginatedList<Filter>>
    | FetchFailedAction<FiltersActionTypes.FAILED>
  > => {
    dispatch(fetchFiltersAction());
    try {
      // TODO Make configurable when the aggregate sparql view is available.
      const org = await nexus.getOrganization('bbp');
      const project = await org.getProject('nmc');
      const view = await project.getSparqlView();
      const query = await view.query(mindsQuery);
      const results =
        query &&
        query.results &&
        query.results.bindings.reduce((memo: Filter[], entry: Binding) => {
          const [filterIDData, filterLabelData] = Object.keys(entry);
          const filterName = filterIDData.replace('ID', '');
          const filter: Filter | undefined = memo.find(
            (entry: any) => entry.name === filterName
          );
          const filterValue = {
            id: entry[filterIDData].value,
            label: filterLabelData
              ? entry[filterLabelData].value
              : entry[filterIDData].value,
          };
          if (filter) {
            filter.values.push(filterValue);
          } else {
            memo.push({
              name: filterName,
              values: [filterValue],
            });
          }
          return memo;
        }, []);
      const datasets: PaginatedList<Filter> = {
        results: results || [],
        index: 0,
        total: 0,
      };
      return dispatch(fetchFiltersFulfilledAction(datasets));
    } catch (e) {
      console.error(e);
      return dispatch(fetchFiltersFailedAction(e));
    }
  };
};
