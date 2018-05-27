import React from "react";
import { Layout } from 'antd';
import Types from "./Types";
import Facets from "./Facets";
const { Content, Sider } = Layout;

const FiltersComponent = () => (
  <Sider width={200} style={{ background: '#fff' }}>
    <Content>
      <Types />
      <hr />
      <Facets />
    </Content>
  </Sider>
)

export default FiltersComponent;