
const errorReportingMiddleware = store => next => action => {
  try {
    return next(action);
  } catch (error) {
    console.error(error)
  }
}

export default errorReportingMiddleware;