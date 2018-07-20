const loggingMiddleware = store => next => action => {
  console.log("loggingMiddleware: ", action.type, action)
  return next(action);
}

export default loggingMiddleware;