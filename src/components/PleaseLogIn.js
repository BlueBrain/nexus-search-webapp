import React from "react";
import { WithStore } from "@bbp/nexus-react";
import { Layout } from "antd";
import { Card, Icon, Avatar } from "antd";
import Logo from "../../public/img/logo.png";
const { Meta } = Card;

const PleaseLogin = () => (
  <Layout style={{width: '100%'}}>
    <WithStore
      mapStateToProps={({ config }) => ({
        loginURI: config.loginURI
      })}
      mapDispatchToProps={{}}
    >
      {({ loginURI }) => (
        <div className="flex center single-child">
          <Card
            style={{ width: 300, marginTop: "10%" }}
            cover={
              <img
                style={{ padding: "2em 1em", width: 100, margin: "0 auto" }}
                alt="example"
                src={Logo}
              />
            }
            actions={[
              <a key="login" href={loginURI}>
                Login <Icon type="login" />
              </a>
            ]}
          >
            <p style={{textAlign: "center"}}>please login to continue.</p>
          </Card>
        </div>
      )}
    </WithStore>
  </Layout>
);

export default PleaseLogin;
