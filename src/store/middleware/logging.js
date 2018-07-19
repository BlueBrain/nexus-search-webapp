const loggingMiddleware = store => next => action => {
  console.log("loggingMiddleware: ", action.type, action)
  next(action);
}

export default loggingMiddleware;