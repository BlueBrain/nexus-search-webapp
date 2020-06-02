import * as React from 'react';
import { Layout, Menu, Spin } from 'antd';
import SearchConfigContainer from '../containers/SearchConfigContainer';
import Search from 'antd/lib/input/Search';
import SearchTextContainer from '../containers/SearchTextContainer';
import SearchResultsContainer from '../containers/SearchResultsContainer';
import SearchFiltersContainer from '../containers/SearchFiltersContainer';
import SearchQueryContainer from '../containers/SearchQueryContainer';
import { FilterParams } from '../utils/queryBuilder';
import SelectedSearchFilters from '../components/SelectedSearchFilters';

const { Sider, Content } = Layout;

const Home: React.FC = () => {
  const [searchText, setSearchText] = React.useState('');
  const [searchFilters, setSearchFilters] = React.useState<FilterParams>({});

  return (
    <SearchConfigContainer>
      {({
        loading,
        error,
        data,
        selectedSearchConfig,
        setSelectedSearchConfig,
      }) => (
        <Layout>
          <Sider width={200}>
            <div className="logo">
              <h2>Search Domains</h2>
            </div>
            <Menu theme="dark" mode="inline" defaultSelectedKeys={['1']}>
              {data &&
                data.map(config => (
                  <Menu.Item
                    key={config.key}
                    onClick={() => {
                      setSelectedSearchConfig(
                        data.find(
                          searchConfig => searchConfig.key === config.key
                        )
                      );
                      // make sure to remove filters and search text when navigating
                      // between the search configs
                      setSearchFilters({});
                      setSearchText('');
                    }}
                  >
                    {config.label}
                  </Menu.Item>
                ))}
            </Menu>
          </Sider>
          <div>
            {!!selectedSearchConfig && (
              <SearchQueryContainer
                searchConfig={selectedSearchConfig}
                searchText={searchText}
              >
                {({ loading, error, data }) => (
                  <Spin spinning={loading}>
                    <Layout>
                      <Sider style={{ backgroundColor: 'white' }}>
                        <SearchFiltersContainer
                          searchConfig={selectedSearchConfig}
                          onChange={setSearchFilters}
                          filters={searchFilters}
                        />
                      </Sider>
                      <section style={{ padding: '1rem' }}>
                        <h2>{selectedSearchConfig.label}</h2>
                        <SearchTextContainer onChange={setSearchText} />
                        <SelectedSearchFilters
                          filters={searchFilters}
                          onChange={setSearchFilters}
                        />
                        <SearchResultsContainer
                          results={data}
                          searchConfig={selectedSearchConfig}
                        />
                      </section>
                    </Layout>
                  </Spin>
                )}
              </SearchQueryContainer>
            )}
          </div>
        </Layout>
      )}
    </SearchConfigContainer>
  );
};

export default Home;
