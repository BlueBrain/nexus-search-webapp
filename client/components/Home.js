import React from "react";
import Workspace from "./Workspace";
import Lightbox from "./Lightbox";
import MorphologyViewer from "./MorphologyViewer";
import Filters from "./Filters";
import { Layout, BackTop } from "antd";
import AppLayout from "./Layout";

const Home = (props) => (
  <AppLayout>
    <Layout style={{flexDirection: "row"}}>
      <BackTop />
      <Lightbox>
        <MorphologyViewer />
      </Lightbox>
      <Filters />
      <Workspace />
    </Layout>
  </AppLayout>
);

export default Home;
