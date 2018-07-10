import React from "react";
import Workspace from "./Workspace";
import Lightbox from "./Lightbox";
import MorphologyViewer from "./MorphologyViewer";
import Filters from "./Filters";
import { Layout } from "antd";

const Home = () => (
  <Layout style={{flexDirection: "row"}}>
    <Lightbox>
      <MorphologyViewer />
    </Lightbox>
    <Filters />
    <Workspace />
  </Layout>
);

export default Home;
