
import queryString from 'query-string';
import fetch from 'node-fetch';

/**
 * Checks if custom path to API has been added
 * @param {string} API_PATH
 * @returns {string}
 */
function checkPath(API_PATH) {
  if (API_PATH === undefined) {
    return BASE_PATH;
  }
  return API_PATH;
}

/**
 * Returns URL from parts
 * @param {string} base - base path of API
 * @param {Array<string>} parts - array containing URI parts
 * @param {Object} options - Object containing URL params
 * @returns {string}
 */
function buildURI(base, uriParts, options={}) {
  const uri = uriParts
  .filter(uriPart => uriPart !== undefined)
  .reduce((prev, current) => {
    return `${prev}/${current}`;
  }, base);
  const params = queryString.stringify(options);
  return `${uri}?${params}`;
}

/**
 * Retrievs instances by its schema version
 * @param {Array} parts - array containg child entity names for building request
 * @param {object} options - querystring contained in an object form
 * @param {string} API_PATH - custom path for API
 * @param {boolean} fetchAll - whether to fetch all instances or just 1 page
 * @param {string} access_token - access_token recieved via OAuth
 * @returns {Promise<Object>}
 */
function getInstancesList(parts = [], options = {}, API_PATH, fetchAll, access_token) {
  const path = checkPath(API_PATH);
  const uri = buildURI(path, ['data', ...parts], options);
  return fetchWrapper(uri, {}, fetchAll, access_token);
}

/**
 * Wrapper around native fetch to pass all params
 * @param {string} url - actual url for request
 * @param {Object} result - accumulated response by default just an empty object
 * @param {Boolean} fetchAll - bool flag for recursive call up to the end of results
 * @param {string} access_token - access_token recieved via OAuth
 * @returns {Promise<Object>}
 */
function fetchWrapper(url, result, fetchAll, access_token) {
  fetchAll = Boolean(fetchAll);
  return fetchWithToken(url, access_token)
  .then(response => {
    console.log(response.status);
    if (response.ok) {
      return response.json();
    }
    throw new Error(`Error occured while fetching ${url}`);
  })
  .then(({ total, results, links}) => {
    result.total = total;
    result.results = result.results || [];
    result.results = result.results.concat(results);
    result.links = Object.assign({}, result.links, links);
    if (fetchAll && links.next) {
      return fetchWrapper(links['next'], result, fetchAll, access_token);
    }
    return result;
  })
  .catch(err => {
    console.error(err);
  });
}

/**
 * Add Authorization header to fetch request.
 * @param {string} uri - actual url for request
 * @param {string} access_token - access_token recieved via OAuth
 */
function fetchWithToken(uri, access_token) {
  const requestOptions = access_token? { headers: { "Authorization": "Bearer "+ access_token } }: {};
  return fetch(uri, requestOptions);
}

export {
  getInstancesList
}