import React from "react";
import { Instance, WithStore } from "@bbp/nexus-react";
import { navigate } from "../store/actions";
import Workspace from "./Workspace";
import Filters from "./Filters";
import { Layout } from "antd";
import qs from "query-string";

function mapStateToInstanceContainerProps({ instance, routing }) {
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
    open: !!qs.parse(routing.location.search).instance
  };
}

const Home = () => (
  <Layout>
    <Workspace />
    <Filters />
    <WithStore
      mapStateToProps={mapStateToInstanceContainerProps}
      mapDispatchToProps={{
        goToEntityByID: navigate.goToEntityByID
      }}
    >
      {({ data, open, goToEntityByID }) => (
        <Instance
          goDown={() => goToEntityByID()}
          goToEntityByID={goToEntityByID}
          data={data}
          open={open}
        />
      )}
    </WithStore>
  </Layout>
);

export default Home;
