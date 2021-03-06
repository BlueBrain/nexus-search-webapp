import { routerMiddleware } from 'connected-react-router'
import thunk from 'redux-thunk'
import history from '../../libs/history';
import logging from "./logging";
import routeChanging from "./routeChanging";
import searchQueryParams from "./searchQueryParams";
import fetching from "./fetching";
import errorReporting from "./errorReporting";
import auth from "./auth";

const middleware = [ routerMiddleware(history), thunk, logging, routeChanging, searchQueryParams, fetching, auth, errorReporting ]

export default middleware;