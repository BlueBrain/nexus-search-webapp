import React from "react";
import { WithStore } from "@bbp/nexus-react";
import { auth } from "../store/actions";
import { Menu, Dropdown, Icon } from "antd";
import CopyToClipboard from "./CopyToClipboard";
import { Link } from "react-router-dom";

const userMenu = (logout, token) => (
  <Menu>
    <Menu.Item key="0" disabled={true}>
      <CopyToClipboard text={"copy token to clipboard"} value={token}>
        <a target="_blank" rel="noopener noreferrer">
          <Icon type="copy" /> copy token{" "}
        </a>
      </CopyToClipboard>
    </Menu.Item>
    <Menu.Divider />
    <Menu.Item key="3">
      <a href="#" onClick={logout}>
        <Icon type="logout" /> logout
      </a>
    </Menu.Item>
  </Menu>
);

const Login = () => (
  <div className="login-block">
    <WithStore
      mapStateToProps={({ auth, config }) => ({
        name: auth.tokenOwner,
        token: auth.token,
        loginURI: config.loginURI
      })}
      mapDispatchToProps={{
        authenticate: auth.authenticate,
        logout: () => {
          auth.logout();
          location.reload();
        }
      }}
    >
      {({ name, loginURI, logout, token }) => {
        if (token) {
          return (
            <Dropdown overlay={userMenu(logout, token)}>
              <a className="ant-dropdown-link align-center">
                {" "}
                {name} <Icon type="down" />
              </a>
            </Dropdown>
          );
        }
        return (
          <a className="ant-dropdown-link align-center" href={loginURI}>
            Log in <Icon type="login" />
          </a>
        );
      }}
    </WithStore>
  </div>
);

export default Login;
