export const toTitleCase = function (str) {
  return str.replace(/\w\S*/g, function(txt){
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
  });
}

export const toSpacedWords = function (str) {
  return str.replace(/([A-Z]+)/g, " $1").replace(/([A-Z][a-z])/g, " $1");
}