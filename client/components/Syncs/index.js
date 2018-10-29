import React from "react";
import { Layout, BackTop } from "antd";
import AppLayout from "../Layout";

const Syncs = (props) => (
  <AppLayout>
    <Layout>
      <BackTop />
      <section className="column full flex">
        <div className="centered-content">
          <article id="details" style={{ minHeight: "100vh", maxWidth: "980px", margin:"0 auto" }}>
            <h1>Syncs</h1>
          </article>
        </div>
      </section>
    </Layout>
  </AppLayout>
);

export default Syncs;
