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

const AuthenticatedContent = (children) => (
  <Layout>
    {Header()}
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
  componentDidMount () {
    this.props.authenticate(window.location.href)
  }
  render() {
    let content = this.props.isAuthenticated
      ? AuthenticatedContent(this.props.children)
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
  isAuthenticated: PropTypes.bool
};

function mapStateToProps(state) {
  return {
    isAuthenticated: !!state.auth.token
  };
}

function mapDispatchToProps(dispatch) {
  return {
    authenticate: bindActionCreators(auth.authenticate, dispatch),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
