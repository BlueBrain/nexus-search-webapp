import React from "react";
import { Auth, WithStore } from "@bbp/nexus-react";
import { auth } from "../store/actions";
import { Avatar, Button, Menu, Dropdown, Icon  } from 'antd';

const userMenu = (logout) => (
  <Menu>
    <Menu.Item key="0" disabled={true}>
      <a target="_blank" rel="noopener noreferrer"><Icon type="setting" />{' '}settings</a>
    </Menu.Item>
    <Menu.Divider />
    <Menu.Item key="3"><a href="#" onClick={logout}><Icon type="logout" />{' '}logout</a></Menu.Item>
  </Menu>
);


const Login = () => (
  <div className="login-block">
    <WithStore
      mapStateToProps={({ auth, config }) => ({
        name: auth.tokenOwner,
        loginURI: config.loginURI
      })}
      mapDispatchToProps={{
        authenticate: auth.authenticate,
        logout: auth.logout
      }}
    >
      {({ name, loginURI, authenticate, logout }) => (
        <Dropdown overlay={userMenu(logout)}>
        <a className="ant-dropdown-link align-center">
          {' '}{name}{' '} <Icon type="down" />
        </a>
      </Dropdown>
      )}
    </WithStore>
  </div>
);

export default Login;
