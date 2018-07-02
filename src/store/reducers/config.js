const DEFAULT_SEARCH_API_URI = "http://localhost:9999/search";

const BASE_URI = window.BASE_URI.startsWith("$") ? process.env.BASE_URI : window.BASE_URI;
const APP_PATH = window.BASE_PATH.startsWith("$") ? "" : window.BASE_PATH;
const SEARCH_API_URI = window.SEARCH_API_URI.startsWith("$")
  ? DEFAULT_SEARCH_API_URI
  : window.SEARCH_API_URI;
const API_PATH = `${BASE_URI}/v0`;
const PAGE_SIZE = 20;
const [appLocation] = window.location.href.split("?");
const LOGIN_URI = `${API_PATH}/oauth2/authorize?redirect=${appLocation}`;

const initialState = {
  api: API_PATH,
  pageSize: PAGE_SIZE,
  base: BASE_URI,
  appPath: APP_PATH,
  appLocation,
  loginURI: LOGIN_URI,
  elasticSearchAPI: SEARCH_API_URI,
  uiConfig: require("../../configs")
};

const configReducer = (state = initialState) => state;

export default configReducer;
