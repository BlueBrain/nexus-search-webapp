import React from "react";
import notifications from "../../libs/notifications";

const errorReportingMiddleware = store => next => action => {
  try {
    return next(action);
  } catch (error) {
    notifications.errors.somethingWentWrongError();
    console.error(error)
  }
}

export default errorReportingMiddleware;