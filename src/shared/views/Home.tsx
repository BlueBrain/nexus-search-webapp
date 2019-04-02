import * as React from 'react';
import { connect } from 'react-redux';
import { RootState } from '../store/reducers';
import Filters from '../components/Filters';
import Datasets from '../components/Datasets';
import Toolbar from '../components/Toolbar';

interface HomeProps {}

const Home: React.FunctionComponent<HomeProps> = ({}, context) => {
  return (
    <div className="home-page">
      <Toolbar>
        <Filters />
      </Toolbar>
      <Datasets />
    </div>
  );
};

const mapStateToProps = (state: RootState) => ({});

const mapDispatchToProps = (dispatch: any) => ({});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Home);
