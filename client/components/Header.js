import React from "react";
import { Icon } from "antd";
import logo from "../../public/img/logo.png";
import Login from "./Login";
import { Link } from "react-router-dom";
import SyncLink from "./Syncs/SyncLink";

const HeaderComponent = () => (
  <div className="stack-wrap rounded-shadow stack-top">
  <header>
    <div className="logo-block">
      <Link
        className="logo bs-Button"
        to={"/"}>
        <img src={logo} />
      </Link>
      <a
        className="fade in slow"
        href={"/"}>
        <h1>Search</h1>
      </a>
    </div>
    <SyncLink />
    <Login />
  </header>
  </div>
);

export default HeaderComponent;
