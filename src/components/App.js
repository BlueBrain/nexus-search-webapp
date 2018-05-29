import React, { Component } from "react";
import { bindActionCreators } from "redux";
import PropTypes from "prop-types";
import Header from "./Header";
import { connect } from "react-redux";
import { navigate, loading } from "../store/actions";
import { version } from "../../package.json";
import { Layout } from "antd";
import { Lines } from "@bbp/nexus-react";
import Loader from "./Loader";
import PleaseLogin from "./PleaseLogIn";
import { auth } from "../store/actions";

const { Content, Footer } = Layout;

const AuthenticatedContent = (children, base) => (
  <Layout>
    {Header(base)}
    <Loader />
    <Content className="middle">{children}</Content>
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

class App extends Component {
  constructor(props) {
    super(props);
  }
  componentDidMount() {
    this.props.authenticate(window.location.href);
    this.props.startListeningToRequests();
    this.props.reconcileRoutes();
  }
  componentDidUpdate(props) {
    this.props.reconcileRoutes();
  }
  render() {
    const { base } = this.props.config;
    const content = this.props.isAuthenticated
      ? AuthenticatedContent(this.props.children, base)
      : PleaseLogin();
    return (
      <React.Fragment>
        <Lines />
        {content}
      </React.Fragment>
    );
  }
}

App.propTypes = {
  config: PropTypes.any.isRequired,
  reconcileRoutes: PropTypes.func.isRequired,
  authenticate: PropTypes.func.isRequired,
  startListeningToRequests: PropTypes.func.isRequired,
  children: PropTypes.element,
  isAuthenticated: PropTypes.bool
};

function mapStateToProps(state) {
  return {
    config: state.config,
    location: state.routing.location,
    isAuthenticated: !!state.auth.token
  };
}

function mapDispatchToProps(dispatch) {
  return {
    startListeningToRequests: bindActionCreators(
      loading.startListeningToRequests,
      dispatch
    ),
    authenticate: bindActionCreators(auth.authenticate, dispatch),
    reconcileRoutes: bindActionCreators(navigate.reconcileRoutes, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
