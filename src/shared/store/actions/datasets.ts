import { ActionCreator, Dispatch } from 'redux';
import { PaginatedList, PaginationSettings, Resource } from '@bbp/nexus-sdk';
import { ThunkAction } from '../';
import { FetchAction, FetchFulfilledAction, FetchFailedAction } from './utils';
import { mindsQuery } from './queries/filters';
import { Filter, Binding } from './filters';
import { makeDatasetQuery } from './queries/datasets';

enum DatasetsActionTypes {
  FETCHING = '@@nexus/DATASETS_FETCHING',
  FULFILLED = '@@nexus/DATASETS_FETCHING_FULFILLED',
  FAILED = '@@nexus/DATASETS_FETCHING_FAILED',
}

export const actionTypes = {
  FETCHING: DatasetsActionTypes.FETCHING,
  FULFILLED: DatasetsActionTypes.FULFILLED,
  FAILED: DatasetsActionTypes.FAILED,
};

const fetchDatasetsAction: ActionCreator<
  FetchAction<DatasetsActionTypes.FETCHING>
> = () => ({
  type: DatasetsActionTypes.FETCHING,
});

const fetchDatasetsFulfilledAction: ActionCreator<
  FetchFulfilledAction<DatasetsActionTypes.FULFILLED, PaginatedList<Resource>>
> = (datasets: PaginatedList<Resource>) => ({
  type: DatasetsActionTypes.FULFILLED,
  payload: datasets,
});

const fetchDatasetsFailedAction: ActionCreator<
  FetchFailedAction<DatasetsActionTypes.FAILED>
> = (error: Error) => ({
  error,
  type: DatasetsActionTypes.FAILED,
});

export type DatasetsActions =
  | FetchAction<DatasetsActionTypes.FETCHING>
  | FetchFulfilledAction<DatasetsActionTypes.FULFILLED, PaginatedList<Resource>>
  | FetchFailedAction<DatasetsActionTypes.FAILED>;

export const fetchDatasets: ActionCreator<ThunkAction> = (
  paginationSettings: PaginationSettings = { from: 0, size: 20 }
) => {
  return async (
    dispatch: Dispatch<any>,
    getState,
    { nexus }
  ): Promise<
    | FetchFulfilledAction<
        DatasetsActionTypes.FULFILLED,
        PaginatedList<Resource>
      >
    | FetchFailedAction<DatasetsActionTypes.FAILED>
  > => {
    dispatch(fetchDatasetsAction());
    try {
      // TODO Make configurable when the aggregate sparql view is available.
      const org = await nexus.getOrganization('bbp');
      const project = await org.getProject('nmc');
      const view = await project.getSparqlView();
      const query = await view.query(makeDatasetQuery(paginationSettings));
      const results =
        query &&
        query.results &&
        query.results.bindings.reduce(
          (memo, binding: Binding) => {
            const [key] = Object.keys(binding);
            if (key === 'total') {
              memo.total = Number(binding[key].value);
            } else {
              const self = binding[key].value;
              if (self) {
                // @ts-ignore
                memo.results.push(self);
              }
            }
            return memo;
          },
          {
            results: [],
            index: paginationSettings.from,
            total: 0,
          }
        );

      let datasets;

      if (results) {
        datasets = {
          ...results,
          results: await Promise.all(
            results.results.map((id: string) => {
              // TODO extract the project and label
              return Promise.resolve(id);
            })
          ),
        };
      } else {
        datasets = {
          results: [],
          index: paginationSettings.from,
          total: 0,
        };
      }

      return dispatch(fetchDatasetsFulfilledAction(datasets));
    } catch (e) {
      // console.error(e);
      return dispatch(fetchDatasetsFailedAction(e));
    }
  };
};
