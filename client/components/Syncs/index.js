import React from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { Layout, BackTop, Button, Row, Col } from "antd";
import AppLayout from "../Layout";
import SyncsList from "./SyncsList";
import { syncs } from "../../store/actions";

const SyncsContainer = ({ triggerSync }) => (
  <AppLayout>
    <Layout>
      <BackTop />
      <section className="column full flex">
        <article id="sync-events">
          <h1>Data Synchronizations</h1>
          <Row>


          <Col span={16}>
          <p>
            Here you can find all the moments when Nexus Search has attempted to synchronize it's data from Nexus.
            Data will be automatically synchronized after targeted resources have been updated or created, or you can trigger
            a synchronization yourself.
          </p>
          </Col>
          <Col span={8} style={{ textAlign: "center"}}>
          <Button type="primary" onClick={triggerSync}>
            Force Sync
          </Button>
          </Col>
          </Row>
          <SyncsList />
        </article>
      </section>
    </Layout>
  </AppLayout>
);

function mapStateToProps({ syncs, config }) {
  return {
    ...syncs
  };
}

function mapDispatchToProps(dispatch) {
  return {
    triggerSync: bindActionCreators(syncs.triggerSync, dispatch),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SyncsContainer);
