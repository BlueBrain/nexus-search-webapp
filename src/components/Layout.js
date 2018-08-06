import React from "react";
import Header from "./Header";
import { version } from "../../package.json";
import { Layout } from "antd";
import Loader from "./Loader";
import { Lines } from "@bbp/nexus-react";

const { Content, Footer } = Layout;

const AppLayout = ({children}) => (
  <Layout>
    <Lines/>
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

export default AppLayout;