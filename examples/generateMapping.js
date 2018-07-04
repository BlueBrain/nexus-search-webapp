import fs from "fs";
import path from "path";
import properties from "./properties";
const FILE_NAME = "mapping.json";

const indexMapping = {
  mappings: {
    doc: {
      properties
    }
  }
};

fs.writeFileSync(
  path.resolve(__dirname, `./${FILE_NAME}`),
  JSON.stringify(indexMapping, null, 2),
  "utf-8"
);
