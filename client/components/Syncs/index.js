import React from "react";
import { Layout, BackTop } from "antd";
import AppLayout from "../Layout";
import SyncsList from "./SyncsList";

const Syncs = (props) => (
  <AppLayout>
    <Layout>
      <BackTop />
      <section className="column full flex">
        <article id="sync-events">
          <h1>Data Synchronizations</h1>
          <p style={{ width: "70%"}}>
            Here you can find all the moments when Nexus Search has attempted to synchronize it's data from Nexus.
            Data will be automatically synchronized after targeted resources have been updated or created, or you can trigger
            a synchronization yourself.
          </p>
          <SyncsList />
        </article>
      </section>
    </Layout>
  </AppLayout>
);

export default Syncs;
