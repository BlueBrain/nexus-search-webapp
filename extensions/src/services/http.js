
/**
 * http client module, wrapper for axios client,
 * for available functionality see https://github.com/axios/axios
 * @module http
 */

import axios from 'axios';

const http = axios.create();

/**
 * Set authentication token
 *
 * @param {string} Auth token, should include `Bearer ` prefix
 */
function setToken(token) {
  http.defaults.headers.common.Authorization = token;
}

export default http;
export { setToken };
