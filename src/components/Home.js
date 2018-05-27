import React from "react";
import { Instance, WithStore } from "@bbp/nexus-react";
import { navigate } from "../store/actions";
import Workspace from "./Workspace";
import Filters from "./Filters";
import { Layout } from "antd";

function mapStateToInstanceContainerProps({ instance, pick }) {
  if (instance.data) {
    instance.data.metaFields = [
      "distribution",
      "@id",
      "@context",
      "@type",
      "nxv:deprecated",
      "nxv:rev",
      "links",
      "resolvedLinks",
      "metaFields",
      "numFields"
    ];
    instance.data.numFields = Object.keys(instance).filter(
      key => instance.data.metaFields.indexOf(key) < 0
    ).length;
  }
  return {
    ...instance,
    open: !!pick.instance
  };
}

const Home = () => (
  <Layout style={{ padding: "24px 0", background: "#fff" }}>
    <Filters />
    <Workspace />
    <WithStore
      mapStateToProps={mapStateToInstanceContainerProps}
      mapDispatchToProps={{
        goDown: navigate.goDown,
        goToEntityByID: navigate.goToEntityByID
      }}
    >
      {({ data, open, goToEntityByID, goDown }) => (
        <Instance
          goDown={goDown}
          goToEntityByID={goToEntityByID}
          data={data}
          open={open}
        />
      )}
    </WithStore>
  </Layout>
);

export default Home;
