import fs from "fs";

let properties = {};

fs.readdirSync(__dirname + '/').forEach(file => {
  if (file.match(/\.js$/) !== null && file !== 'index.js') {
    let name = file.replace('.js', '');
    properties[name] = require('./' + file).default;
  }
});

export default properties;