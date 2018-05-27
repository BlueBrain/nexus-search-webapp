import React, { Component } from "react";
import { bindActionCreators } from "redux";
import PropTypes from "prop-types";
import Header from "./Header";
import { connect } from "react-redux";
import { navigate, loading } from "../store/actions";
import { version } from "../../package.json";
import { Layout, Menu, Breadcrumb, Icon } from 'antd';
const { SubMenu } = Menu;
const { Content, Footer, Sider } = Layout;
import Loader from "./Loader";

class App extends Component {
  constructor(props) {
    super(props);
  }
  componentDidMount() {
    this.props.startListeningToRequests();
    this.props.reconcileRoutes();
  }
  componentDidUpdate() {
    this.props.reconcileRoutes();
  }
  render() {
    const { base } = this.props.config;
    return (
      <Layout>
        <Loader />
        <Content style={{ padding: '0 50px' }}>
        {Header(base)}
          {this.props.children}
        </Content>
        <Footer>
          Version {version} &nbsp;|&nbsp;<a
            target="_blank"
            rel="noopener noreferrer"
            href="https://github.com/BlueBrain/nexus-search-webapp/issues"
          >
            {" "}
            Submit an issue
          </a>
        </Footer>
      </Layout>
    );
  }
}

App.propTypes = {
  config: PropTypes.any.isRequired,
  reconcileRoutes: PropTypes.func.isRequired,
  startListeningToRequests: PropTypes.func.isRequired,
  children: PropTypes.element
};

function mapStateToProps(state) {
  return {
    config: state.config,
    location: state.routing.location
  };
}

function mapDispatchToProps(dispatch) {
  return {
    startListeningToRequests: bindActionCreators(
      loading.startListeningToRequests,
      dispatch
    ),
    reconcileRoutes: bindActionCreators(navigate.reconcileRoutes, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
