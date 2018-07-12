import React from "react";
import { Layout } from 'antd';
import Types from "./Types";
import Facets from "./Facets";
import DismissableSider from "../DismissableSider";
const { Content } = Layout;

const FiltersComponent = () => (
  <DismissableSider id="filters">
    <Content style={{ padding: "1em 0 0"}}>
      <Types />
      <Facets />
    </Content>
  </DismissableSider>
)

export default FiltersComponent;