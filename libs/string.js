export const toTitleCase = function (str) {
  return str.replace(/\w\S*/g, function(txt){
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
  });
}

export const toSpacedWords = function (str) {
  return str.replace(/([A-Z]+)/g, " $1").replace(/([A-Z][a-z])/g, " $1");
}

export const unCamelCase = function (str){
  str = str.replace(/([a-z\xE0-\xFF])([A-Z\xC0\xDF])/g, '$1 $2');
  str = str.toLowerCase(); //add space between camelCase text
  return str;
}

export const isURL = function (s) {
  var regexp = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/
  return regexp.test(s);
}

export const makeSafeID = function (id) {
  if (isURL(id)) {
    return encodeURIComponent(id);
  }
  return id;
}