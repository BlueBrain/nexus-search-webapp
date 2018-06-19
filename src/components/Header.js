import React from "react";
import logo from "../../public/img/logo.png";
import Login from "./Login";
import { WithStore } from "@bbp/nexus-react";
import { navigate } from "../store/actions";
import SearchBar from "./SearchBar";

const HeaderComponent = base => (
  <div className="stack-wrap rounded-shadow stack-top">
  <header>
    <div className="logo-block">
      <a className="logo bs-Button" href={base + "/home/"}>
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
            {/* <h1>Search</h1> */}
          </a>
        )}
      </WithStore>
    </div>
    <SearchBar />
    <Login />
  </header>
  </div>
);

export default HeaderComponent;
