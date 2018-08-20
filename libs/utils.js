export const guidGenerator = function() {
  var S4 = function() {
    return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
  };
  return (
    S4() +
    S4() +
    "-" +
    S4() +
    "-" +
    S4() +
    "-" +
    S4() +
    "-" +
    S4() +
    S4() +
    S4()
  );
};

export const truthy = function(obj) {
  for (let i in obj) {
    if (!obj[i] || (Array.isArray(obj[i]) && !obj[i].length)) {
      delete obj[i];
    }
  }
  return obj;
};

export const mapObj = function(obj, cb) {
  return Object.keys(obj).map(key => cb(obj[key], key));
}

/**
 * getProp utility - an alternative to lodash.get
 * @author @harish2704, @muffypl, @pi0
 * @param {Object} object
 * @param {String|Array} path
 * @param {*} defaultVal
 */
export const getProp = function getPropertyWithPath (object, path, defaultVal=null) {
  const _path = Array.isArray(path)
    ? path
    : path.split('.').filter(i => i.length)

  if (!_path.length) {
    return object === undefined ? defaultVal : object
  }

  let newObj = object[_path.shift()];
  if (!newObj) { return defaultVal; }
  return getPropertyWithPath(newObj, _path, defaultVal)
}