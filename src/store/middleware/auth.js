import React from "react";
import notifications from "../../libs/notifications";

const authMiddleware = store => next => action => {
  if (action.type === "AUTH_LOGOUT") {
    action.payload.reason
    switch (action.payload.reason) {
      case "expired":
        notifications.messages.loggedOut();
      break;
    }
  }
  return next(action);
}

export default authMiddleware;