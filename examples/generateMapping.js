import properties from "./properties";

const indexMapping = {
  mappings: {
    doc: {
      properties
    }
  }
};

console.log(JSON.stringify(indexMapping, null, 2));