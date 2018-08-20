import React from "react";
import { Layout } from "antd";
import SVG from "react-svg";
import icons from "./Icons";
import { Link } from "react-router-dom";
import logo from "../../public/img/logo.png";

const NotFound = props => (
  <Layout style={{flexDirection: "row"}}>
    <div className="center grow full full-height column">
      <div className="no-results">
        <SVG
          path={icons.notFound}
          svgClassName="nothing-found-svg"
          className="nothing-found-icon"
        />
        <h3>There seems to be nothing here...</h3>
        <Link
          className="fade in slow"
          to={"/"}>Go to main page
         </Link>
      </div>
    </div>
  </Layout>
);

export default NotFound;
