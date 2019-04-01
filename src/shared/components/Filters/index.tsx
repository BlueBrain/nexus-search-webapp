import * as React from 'react';
import { connect } from 'react-redux';
import { RootState } from '../../store/reducers';
import { Checkbox, Spin, Skeleton, Collapse } from 'antd';
import SideMenu from './SideMenu';
import './filter-list.less';
import store from '../../store';
import { fetchFilters, Filter } from '../../store/actions/filters';
import { PaginatedList } from '@bbp/nexus-sdk';
import { FetchableState } from '../../store/reducers/utils';
import CollapsePanel from 'antd/lib/collapse/CollapsePanel';

interface FilterProps {
  fetchFilters: VoidFunction;
  filters?: FetchableState<PaginatedList<Filter>>;
}

const Filters: React.FunctionComponent<FilterProps> = props => {
  const { fetchFilters, filters } = props;
  React.useEffect(() => {
    fetchFilters();
  }, []);

  return (
    <SideMenu>
      <div className="filter-list">
        {!filters ||
          (filters.isFetching && !filters.data) ||
          (filters.isFetching &&
            filters.data &&
            !filters.data.results.length && <Skeleton active />)}
        {filters && (
          <Spin spinning={filters.isFetching}>
            <Collapse bordered={false}>
              {filters.data &&
                filters.data.results.map((filter, index) => {
                  const header = (
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                      }}
                    >
                      {filter.name}
                      <div />
                      <div>{filter.values.length}</div>
                    </div>
                  );
                  return (
                    <CollapsePanel header={header} key={`${index}`}>
                      <ul className="checkbox-list">
                        {filter.values.map(value => {
                          return (
                            <li>
                              <Checkbox value={value.id}>
                                {value.label}
                              </Checkbox>
                            </li>
                          );
                        })}
                      </ul>
                    </CollapsePanel>
                  );
                })}
            </Collapse>
          </Spin>
        )}
      </div>
    </SideMenu>
  );
};

const mapStateToProps = (state: RootState) => ({
  filters: (state && state.datasets && state.datasets.filters) || undefined,
});

const mapDispatchToProps = (dispatch: any) => ({
  fetchFilters: () => dispatch(fetchFilters()),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Filters);
