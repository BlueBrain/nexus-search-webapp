import { connect } from 'react-redux';
import { RootState } from '../../store/reducers';
import * as React from 'react';
import { useTransition, animated as a, config } from 'react-spring';
import useMeasure from '../../hooks/useMeasure';
import useMedia from '../../hooks/useMedia';
import './datasets-grid.less';
import { Resource, PaginatedList, PaginationSettings } from '@bbp/nexus-sdk';
import { FetchableState } from '../../store/reducers/utils';
import { Spin, Empty, Pagination, Skeleton } from 'antd';
import { fetchDatasets } from '../../store/actions/datasets';
import InfiniteScroll from '../Animations/InfiniteScroll';
import ListItem from '../Animations/ListItem';

interface DatasetsProps {
  fetchDatasets: (paginationSettings: PaginationSettings) => void;
  fetchableDatasets: FetchableState<PaginatedList<Resource>>;
  pageSize: number;
}

const Datasets: React.FunctionComponent<DatasetsProps> = props => {
  const { fetchDatasets, fetchableDatasets, pageSize } = props;
  const { isFetching, data, error } = fetchableDatasets;
  const paginationSettings = {
    from: (data && data.index) || 0,
    size: pageSize,
  };
  // const [paginationSettings, setPaginationSettings] = React.useState<
  //   PaginationSettings
  // >({
  //   from: (data && data.index) || 0,
  //   size: pageSize,
  // });
  React.useEffect(() => {
    fetchDatasets(paginationSettings);
  }, [paginationSettings.from]);
  return (
    <div className="datasets-list">
      {data && !!data.total && <h1>Found {data.total} Datasets</h1>}
      <Spin spinning={isFetching}>
        {error && <Empty description={error.message} />}
        <InfiniteScroll
          style={{
            maxHeight: '70vh',
            overflowY: 'scroll',
            // backgroundColor: 'pink',
            borderRadius: '4px',
          }}
          makeKey={(id, index) => `${id}-${index}`}
          itemComponent={(id, index: number) => {
            return (
              <ListItem
                label={id}
                // description={description}
                id={`${id}-${index}`}
              />
            );
          }}
          loadNextPage={() => {
            const newPaginationSettings = {
              ...paginationSettings,
              from: paginationSettings.from + 1,
            };
            console.log(
              'new',
              newPaginationSettings,
              paginationSettings.from + 1,
              paginationSettings.from
            );
            fetchDatasets(newPaginationSettings);
          }}
          fetchablePaginatedList={fetchableDatasets}
        />
      </Spin>
    </div>
  );
};

interface TileProps {
  data: any[];
}

const Tiles: React.FunctionComponent<TileProps> = props => {
  const { data } = props;
  const columns = useMedia(
    ['(min-width: 1500px)', '(min-width: 1000px)', '(min-width: 600px)'],
    [5, 4, 3],
    2
  );
  // @ts-ignore
  const [bind, { width }] = useMeasure();
  const [items, set] = React.useState(data);

  // @ts-ignore
  const heights = columns.map(entry => 0); // Each column gets a height starting with zero
  const gridItems = items.map((child, i) => {
    const column = heights.indexOf(Math.min(...heights)); // Basic masonry-grid placing, puts tile into the smallest column using Math.min
    const xy = [
      (width / columns) * column,
      (heights[column] += child.height / 2) - child.height / 2,
    ]; // X = container width / number of columns * column index, Y = it's just the height of the current column
    return { ...child, xy, width: width / columns, height: child.height / 2 };
  });

  // This turns gridItems into transitions, any addition, removal or change will be animated
  const transitions = useTransition(gridItems, item => item.css, {
    from: ({ xy, width, height }) => ({ xy, width, height, opacity: 0 }),
    enter: ({ xy, width, height }) => ({ xy, width, height, opacity: 1 }),
    update: ({ xy, width, height }) => ({ xy, width, height }),
    leave: { height: 0, opacity: 0 },
    config: { mass: 5, tension: 500, friction: 100 },
    trail: 25,
  });

  return (
    <div {...bind} className="list" style={{ height: Math.max(...heights) }}>
      {transitions.map((
        // @ts-ignore
        { item, props: { xy, ...rest }, key } // @ts-ignore
      ) => (
        <a.div
          key={key}
          style={{
            transform: xy.interpolate(
              (x: number, y: number) => `translate3d(${x}px,${y}px,0)`
            ),
            ...rest,
          }}
        >
          <div style={{ backgroundImage: item.css }} />
        </a.div>
      ))}
    </div>
  );
};

const mapStateToProps = (state: RootState) => ({
  fetchableDatasets: (state && state.datasets && state.datasets.datasets) || {
    isFetching: false,
    data: null,
    error: null,
  },
  pageSize: state.uiSettings.pageSizes.defaultPageSize || 20,
});

const mapDispatchToProps = (dispatch: any) => ({
  fetchDatasets: (paginationSettings: PaginationSettings) =>
    dispatch(fetchDatasets(paginationSettings)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Datasets);
