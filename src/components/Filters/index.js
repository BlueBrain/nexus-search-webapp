import React from "react";
import { Layout } from 'antd';
import Types from "./Types";
import Facets from "./Facets";
const { Content, Sider } = Layout;
import DismissableSider from "../DismissableSider";

const FiltersComponent = () => (
  <DismissableSider id="filters" width={300} style={{ background: '#fff', padding: '1em 0'}}>
    <Content>
      <Types />
      <Facets />
    </Content>
  </DismissableSider>
)

export default FiltersComponent;