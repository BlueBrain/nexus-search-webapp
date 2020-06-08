import * as React from 'react';
import { Layout, Menu, Spin } from 'antd';
import SearchConfigContainer from '../containers/SearchConfigContainer';
import SearchTextContainer from '../containers/SearchTextContainer';
import SearchFiltersContainer from '../containers/SearchFiltersContainer';
import SearchQueryContainer from '../containers/SearchQueryContainer';
import { FilterParams, Pagination } from '../utils/queryBuilder';
import SelectedSearchFilters from '../components/SelectedSearchFilters';

const { Sider } = Layout;

const DEFAULT_PAGE_SIZE = 20;

const Home: React.FC = () => {
  const [searchText, setSearchText] = React.useState('');
  const [searchFilters, setSearchFilters] = React.useState<FilterParams>({});
  const [pagination, setPagination] = React.useState<Pagination>({
    size: DEFAULT_PAGE_SIZE,
    from: 0,
  });

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
                pagination={pagination}
                filters={searchFilters}
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
                        <selectedSearchConfig.resultsComponent
                          results={data}
                          pagination={pagination}
                          setPagination={setPagination}
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
