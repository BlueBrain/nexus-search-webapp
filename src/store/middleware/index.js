import { routerMiddleware } from 'connected-react-router'
import thunk from 'redux-thunk'
import history from '../../libs/history';
import logging from "./logging";
import routeChanging from "./routeChanging";
import fetching from "./fetching";
import errorReporting from "./errorReporting";
import auth from "./auth";

const middleware = [ thunk, routerMiddleware(history), logging, routeChanging, fetching, auth, errorReporting ]

export default middleware;