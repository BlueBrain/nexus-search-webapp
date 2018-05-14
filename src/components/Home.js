import React from "react";
import { Instance, WithStore } from "@bbp/nexus-react";
import { navigate } from "../store/actions";

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
  <main className="flex">
    <div className="wrapper">
      <section className="padding column full flex space-between">
        <h1 className="search-feedback border-bottom">
          Welcome to the Search App
        </h1>
        <div className="center grow">
        </div>
      </section>
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
    </div>
  </main>
);

export default Home;
