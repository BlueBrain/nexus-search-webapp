const DEFAULT_SEARCH_API_URI = "http://localhost:9999";

const BASE_URI = window.BASE_URI.startsWith("$") ? "" : window.BASE_URI;
const APP_PATH = window.BASE_PATH.startsWith("$") ? "" : window.BASE_PATH;
const SEARCH_API_URI = window.SEARCH_API_URI.startsWith("$")
  ? DEFAULT_SEARCH_API_URI
  : window.SEARCH_API_URI;
const API_PATH = `${BASE_URI}/v0`;
const PAGE_SIZE = 20;
const appLocation = window.location.origin + APP_PATH + "/";
const LOGIN_URI = `${API_PATH}/oauth2/authorize?redirect=${appLocation}`;

const initialState = {
  api: API_PATH,
  pageSize: PAGE_SIZE,
  base: BASE_URI,
  appPath: APP_PATH,
  appLocation,
  loginURI: LOGIN_URI,
  elasticSearchAPI: SEARCH_API_URI,
  staticContentLocation: SEARCH_API_URI + "/data",
  uiConfig: require("../../configs"),
  wholeMouseBrainMeshLocation:
    "https://bbp.epfl.ch/nexus/v0/data/bbp/atlas/brainparcellationmesh/v0.1.0/39a3078c-1e21-4e1c-9015-82a10ba6797e/attachment"
};
const configReducer = (state = initialState) => state;

export default configReducer;
