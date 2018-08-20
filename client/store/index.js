import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import { connectRouter } from 'connected-react-router'
import persistState from 'redux-localstorage';
import * as customReducers from './reducers';
import middleware from "./middleware";
import history from "../libs/history";

const reducers = combineReducers({
  ...customReducers
})

const reduxStore = createStore(
  connectRouter(history)(reducers),
  compose(
    persistState('auth'),
    applyMiddleware(
        ...middleware
    )
  )
)

if (module.hot) {
  module.hot.accept('./reducers', () => {
    let customReducers = require('./reducers');
    let finalReducer = {
      ...customReducers
    };
    store.replaceReducer(connectRouter(history)(combineReducers(finalReducer)));
  })
}

export default reduxStore;
