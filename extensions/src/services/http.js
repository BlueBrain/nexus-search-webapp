
import axios from 'axios';

/**
 * This will be the wrapper of actual axios library so we can add
 * authorization headers for all the extensions.
 */

const http = axios.create();

function setToken(token) {
  http.defaults.headers.common.Authorization = token;
}

export default {
  setToken,
  http,
};
