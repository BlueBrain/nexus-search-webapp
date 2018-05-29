import React from "react";
import { Layout } from 'antd';
import Types from "./Types";
import Facets from "./Facets";
const { Content, Sider } = Layout;

const FiltersComponent = () => (
  <Sider id={'filters'} width={300} style={{ background: '#fff', padding: '1em 0'}}>
    <Content>
      <Types />
      {/* <Facets /> */}
    </Content>
  </Sider>
)

export default FiltersComponent;