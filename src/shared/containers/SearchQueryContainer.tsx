import * as React from 'react';
import { SearchConfig } from './SearchConfigContainer';
import { useNexus, useNexusContext } from '@bbp/react-nexus';
import { SearchResponse } from 'elasticsearch';
import { FilterParams, ESQueryParams, Pagination } from '../utils/queryBuilder';
import { useSelector } from 'react-redux';

import { RootState } from '../store/reducers';

const SearchQueryContainer: React.FC<{
  searchConfig: SearchConfig;
  searchText?: string;
  pagination: Pagination;
  filters: FilterParams;
  children: React.FC<{
    loading: boolean;
    error: Error | null;
    data: SearchResponse<any>;
  }>;
}> = ({ children, searchConfig, searchText, filters, pagination }) => {
  const { key, searchMethod } = searchConfig;
  const nexus = useNexusContext();
  const basePath =
    useSelector((state: RootState) => state.config.basePath) || '';
  const [{ loading, error, data }, setData] = React.useState<{
    loading: boolean;
    error: Error | null;
    data: any | null;
  }>({
    loading: false,
    error: null,
    data: null,
  });

  React.useEffect(() => {
    setData({
      loading: true,
      error: null,
      data: null,
    });

    const esQueryParams: ESQueryParams = {
      pagination,
      q: searchText,
      filter: filters,
    };
    if (key === 'ls') {
      // TODO: move it to be searchMethod in a config!
      const searchPath = `/litsearch?search=${searchText}&model=USE&start=${pagination.from}&size=${pagination.size}`;
      const fullPath =
        !basePath || basePath === ''
          ? searchPath
          : `/${basePath}/${searchPath}`;
      fetch(fullPath)
        .then(response => {
          return response.json();
        })
        .then(data => {
          setData({
            data,
            error: null,
            loading: false,
          });
        })
        .catch(error => {
          setData({
            error,
            loading: false,
            data: null,
          });
        });
    } else {
      searchMethod(esQueryParams, searchConfig, nexus)
        .then((elasticSearchResponse: any) => {
          setData({
            error: null,
            loading: false,
            data: elasticSearchResponse,
          });
        })
        .catch((error: Error) => {
          setData({
            error,
            loading: false,
            data: null,
          });
        });
    }
  }, [key, searchText, filters, pagination]);

  return !!children
    ? children({
        loading,
        error,
        data,
      })
    : null;
};

export default SearchQueryContainer;
