import React from "react";
import { Icon } from "antd";


const description = <div>
  <p style={{fontSize: "1em"}}>Your security token expired, so you've been automatically logged out. </p>
</div>

const loggedOut = {
  message: "Logged Out",
  description,
  icon: <div style={{ width: "2em", marginRight: "1em"}}>
  <Icon type="logout" className="notification-icon" />
</div>
}

export default {
  loggedOut,
}