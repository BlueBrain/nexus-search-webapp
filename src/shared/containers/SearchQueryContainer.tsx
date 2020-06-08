import * as React from 'react';
import { SearchConfig } from './SearchConfigContainer';
import { useNexus, useNexusContext } from '@bbp/react-nexus';

const SearchQueryContainer: React.FC<{
  searchConfig: SearchConfig;
  searchText?: string;
  filters?: any;
  children: React.FC<{
    loading: boolean;
    error: Error | null;
    data: any;
  }>;
}> = ({
  children,
  searchConfig: { orgLabel, projectLabel, view, key },
  searchText,
  filters,
}) => {
  const nexus = useNexusContext();
  const [{ loading, error, data }, setData] = React.useState<{
    loading: boolean;
    error: Error | null;
    data: any | null;
  }>({
    loading: false,
    error: null,
    data: null,
  });

  const size = filters && filters.size ? filters.size : 5;
  const start = filters && filters.start ? filters.start : 0;

  React.useEffect(() => {
    setData({
      loading: true,
      error: null,
      data: null,
    });

    // Update me
    if (key === 'ls') {
      fetch(
        `http://localhost:8000/litsearch?search=${searchText}&model=USE&size=${size}&start=${start}`
      )
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
      nexus.View.elasticSearchQuery(
        orgLabel,
        projectLabel,
        encodeURIComponent(view),
        // We need to combine the props
        // to create a beautiful ES query
        {
          ...(searchText
            ? {
                query: {
                  query_string: {
                    query: searchText,
                  },
                },
              }
            : {}),
        }
      )
        .then(elasticSearchResponse => {
          setData({
            error: null,
            loading: false,
            data: elasticSearchResponse,
          });
        })
        .catch(error => {
          setData({
            error,
            loading: false,
            data: null,
          });
        });
    }
  }, [key, searchText]);

  return !!children
    ? children({
        loading,
        error,
        data,
      })
    : null;
};

export default SearchQueryContainer;
