import { routerMiddleware } from 'react-router-redux';
import thunk from 'redux-thunk'
import history from '../../libs/history';
import logging from "./logging";
import routeChanging from "./logging";
import fetching from "./fetching";
import errorReporting from "./errorReporting";

const middleware = [ thunk, routerMiddleware(history), logging, routeChanging, fetching, errorReporting ]

export default middleware;