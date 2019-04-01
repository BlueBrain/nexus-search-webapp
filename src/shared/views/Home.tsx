import * as React from 'react';
import { connect } from 'react-redux';
import { RootState } from '../store/reducers';
import Filters from '../components/Filters';

interface HomeProps {}

const Home: React.FunctionComponent<HomeProps> = ({}, context) => {
  return (
    <div>
      <Filters />
    </div>
  );
};

const mapStateToProps = (state: RootState) => ({});

const mapDispatchToProps = (dispatch: any) => ({});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Home);
