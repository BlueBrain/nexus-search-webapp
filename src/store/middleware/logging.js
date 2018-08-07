const loggingMiddleware = store => next => action => {
  console.log("loggingMiddleware: ", action.type, action, store.getState())
  return next(action);
}

export default loggingMiddleware;