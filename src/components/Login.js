import React from "react";
import { Auth, WithStore } from "@bbp/nexus-react";
import { auth } from "../store/actions";
import { Avatar, Button, Menu, Dropdown, Icon  } from 'antd';
import { CopyToClipboard as Copy} from 'react-copy-to-clipboard';

const userMenu = (logout, token) => (
  <Menu>
    <Menu.Item key="0" disabled={true}>
      <a target="_blank" rel="noopener noreferrer"><Icon type="setting" />{' '}settings</a>
    </Menu.Item>
    <Menu.Item key="0" disabled={true}>
    <Copy text={token}>
      <a target="_blank" rel="noopener noreferrer"><Icon type="copy" />{' '}copy token{' '}</a>
    </Copy>
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
        token: auth.token,
        loginURI: config.loginURI
      })}
      mapDispatchToProps={{
        authenticate: auth.authenticate,
        logout: auth.logout
      }}
    >
      {({ name, loginURI, authenticate, logout, token }) => (
        <Dropdown overlay={userMenu(logout, token)}>
        <a className="ant-dropdown-link align-center">
          {' '}{name}{' '} <Icon type="down" />
        </a>
      </Dropdown>
      )}
    </WithStore>
  </div>
);

export default Login;
