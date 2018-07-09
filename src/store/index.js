import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import { routerReducer } from 'react-router-redux';
import persistState from 'redux-localstorage';
import * as customReducers from './reducers';
import middleware from "./middleware";

const reducers = combineReducers({
  ...customReducers,
  routing: routerReducer
})

const reduxStore = createStore(
  reducers,
  compose(
    persistState('auth'),
    applyMiddleware(
        ...middleware
    )
  )
)

export default reduxStore;
