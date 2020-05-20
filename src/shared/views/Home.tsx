import * as React from 'react';
import { Layout, Menu, Spin } from 'antd';
import SearchConfigContainer from '../containers/SearchConfigContainer';
import Search from 'antd/lib/input/Search';
import SearchTextContainer from '../containers/SearchTextContainer';
import SearchResultsContainer from '../containers/SearchResultsContainer';
import SearchFiltersContainer from '../containers/SearchFiltersContainer';
import SearchQueryContainer from '../containers/SearchQueryContainer';

const { Sider, Content } = Layout;

const Home: React.FC = () => {
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
                    }}
                  >
                    {config.label}
                  </Menu.Item>
                ))}
            </Menu>
          </Sider>
          <div>
            {!!selectedSearchConfig && (
              <SearchQueryContainer searchConfig={selectedSearchConfig}>
                {({ loading, error, data }) => (
                  <Spin spinning={loading}>
                    <Layout>
                      <Sider>
                        <SearchFiltersContainer />
                      </Sider>
                      <section>
                        <h2>{selectedSearchConfig.label}</h2>
                        <SearchTextContainer />
                        <SearchResultsContainer results={data} />
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
