import React from "react";
import logo from "../../public/img/logo.png";
import SearchBar from "./SearchBar";
import Login from "./Login";
import { WithStore } from "@bbp/nexus-react";
import { navigate } from "../store/actions";
console.log('hello')
const Header = base => (
  <header>
    <div className="logo-block">
      <a className="logo" href={base + "/home/"}>
        <img src={logo} />
      </a>
      <WithStore
        mapStateToProps={() => ({})}
        mapDispatchToProps={{
          navigate: navigate.navigate
        }}
      >
        {({ navigate }) => (
          <a
            href={base}
            onClick={e => {
              e.preventDefault();
              navigate("/");
            }}
          >
            <h1>Search</h1>
          </a>
        )}
      </WithStore>
    </div>
    <SearchBar />
    <Login />
  </header>
);

export default Header;
