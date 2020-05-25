import * as React from 'react';
import defaultElasticSearchMappings from './defaultElasticSearchMapping';

export type SearchConfig = {
  key: string;
  label: string;
  orgLabel: string;
  projectLabel: string;
  view: string;
  mappings: any;
};

console.log({ defaultElasticSearchMappings });

const fakeSearchConfigs: SearchConfig[] = [
  {
    key: 'default',
    label: 'Default Search Example',
    orgLabel: 'public',
    projectLabel: 'graphql-ld',
    view:
      'https://bluebrain.github.io/nexus/vocabulary/defaultElasticSearchIndex',
    mappings: defaultElasticSearchMappings,
  },
  {
    key: 'minds',
    label: 'Minds Search',
    orgLabel: 'public',
    projectLabel: 'graphql-ld',
    view:
      'https://bluebrain.github.io/nexus/vocabulary/defaultElasticSearchIndex',
    mappings: defaultElasticSearchMappings,
  },
  {
    key: 'ls',
    label: 'Literature Search',
    orgLabel: 'bbp',
    projectLabel: 'nmc',
    view:
      'https://bluebrain.github.io/nexus/vocabulary/defaultElasticSearchIndex',
    mappings: defaultElasticSearchMappings,
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
