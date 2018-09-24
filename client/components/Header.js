import React from "react";
import logo from "../../public/img/logo.png";
import Login from "./Login";
import { Link } from "react-router-dom";
import SearchBar from "./SearchBar";

const HeaderComponent = () => (
  <div className="stack-wrap rounded-shadow stack-top">
  <header>
    <div className="logo-block">
      <Link
        className="logo bs-Button"
        to={"/home"}>
        <img src={logo} />
      </Link>
      <a
        className="fade in slow"
        href={"/"}>
        <h1>Search</h1>
      </a>
    </div>
    {/* <SearchBar /> */}
    <Login />
  </header>
  </div>
);

export default HeaderComponent;
