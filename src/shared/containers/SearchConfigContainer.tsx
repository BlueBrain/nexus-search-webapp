import * as React from 'react';

export type SearchConfig = {
  key: string;
  label: string;
  view: string;
};

const fakeSearchConfigs: SearchConfig[] = [
  {
    key: '1',
    label: 'Minds Search',
    view: 'lasdjhflasdjhfalh',
  },
  {
    key: '2',
    label: 'Literature Search',
    view: 'lasdjhflasdjhfalh',
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
