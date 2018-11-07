import config from "../libs/config";

// TODO this is unfortunate, but this hardcoded provider
// is necessary until relevant data lives in one environment

const {
  SEARCH_APP_SERVICE_TOKEN_PROD: prodToken,
  SEARCH_APP_SERVICE_TOKEN_STAG: stagingToken
} = config;

export default function whichToken(url) {
  if (url.indexOf("https://bbp.epfl.ch") >= 0) {
    return prodToken
  }
  return stagingToken
}