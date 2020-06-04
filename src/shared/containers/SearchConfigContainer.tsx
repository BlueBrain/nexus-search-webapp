import * as React from 'react';
import defaultElasticSearchMappings from './defaultElasticSearchMapping';
import buildQuery, { ESQueryParams, Pagination } from '../utils/queryBuilder';
import SearchResultsContainer from './SearchResultsContainer';
import { NexusClient } from '@bbp/nexus-sdk';
import { SearchResponse } from 'elasticsearch';

const defaultSearchResultsContainer = SearchResultsContainer;
const defaultSearchMethod = (
  params: ESQueryParams,
  searchConfig: SearchConfig,
  nexus: NexusClient
) =>
  nexus.View.elasticSearchQuery<SearchResponse<any>>(
    searchConfig.orgLabel,
    searchConfig.projectLabel,
    encodeURIComponent(searchConfig.view),
    buildQuery(params) || {}
  );

export type SearchConfig = {
  key: string;
  label: string;
  orgLabel: string;
  projectLabel: string;
  view: string;
  mappings: any;
  searchMethod: (
    params: ESQueryParams,
    searchConfig: SearchConfig,
    nexus: NexusClient
  ) => Promise<any>;
  resultsComponent: React.FC<{
    results: any;
    searchConfig: SearchConfig;
    pagination: Pagination;
    setPagination: (pagination: Pagination) => void;
  }>;
};

const fakeSearchConfigs: SearchConfig[] = [
  {
    key: 'default',
    label: 'Default Search Example',
    orgLabel: 'public',
    projectLabel: 'graphql-ld',
    view:
      'https://bluebrain.github.io/nexus/vocabulary/defaultElasticSearchIndex',
    mappings: defaultElasticSearchMappings,
    searchMethod: defaultSearchMethod,
    resultsComponent: defaultSearchResultsContainer,
  },
  {
    key: 'minds',
    label: 'Minds Search',
    orgLabel: 'public',
    projectLabel: 'graphql-ld',
    view:
      'https://bluebrain.github.io/nexus/vocabulary/defaultElasticSearchIndex',
    mappings: defaultElasticSearchMappings,
    searchMethod: defaultSearchMethod,
    resultsComponent: defaultSearchResultsContainer,
  },
  {
    key: 'ls',
    label: 'Literature Search',
    orgLabel: 'bbp',
    projectLabel: 'nmc',
    view:
      'https://bluebrain.github.io/nexus/vocabulary/defaultElasticSearchIndex',
    mappings: defaultElasticSearchMappings,
    searchMethod: defaultSearchMethod,
    resultsComponent: defaultSearchResultsContainer,
  },
];

const SearchConfigContainer: React.FC<{
  children: React.FC<{
    loading: boolean;
    error: Error | null;
    data: SearchConfig[] | null;
    selectedSearchConfig?: SearchConfig;
    setSelectedSearchConfig: React.Dispatch<
      React.SetStateAction<SearchConfig | undefined>
    >;
  }>;
}> = ({ children }) => {
  const [selectedSearchConfig, setSelectedSearchConfig] = React.useState<
    SearchConfig | undefined
  >();

  const [{ loading, error, data }, setData] = React.useState<{
    loading: boolean;
    error: Error | null;
    data: SearchConfig[] | null;
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

    // TODO fetch search configs
    setTimeout(() => {
      setData({
        loading: false,
        error: null,
        data: fakeSearchConfigs,
      });
      setSelectedSearchConfig(fakeSearchConfigs[0]);
    }, 500);
  }, []);

  return !!children
    ? children({
        loading,
        error,
        data,
        selectedSearchConfig,
        setSelectedSearchConfig,
      })
    : null;
};

export default SearchConfigContainer;
