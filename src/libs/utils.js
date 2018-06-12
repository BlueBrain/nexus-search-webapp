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
