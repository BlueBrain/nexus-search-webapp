import * as React from 'react';
import { connect } from 'react-redux';
import { RootState } from '../store/reducers';

interface HomeProps {}

const Home: React.FunctionComponent<HomeProps> = ({}) => {
  return <h1>Hello World</h1>;
};

const mapStateToProps = (state: RootState) => ({});

const mapDispatchToProps = (dispatch: any) => ({});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Home);
