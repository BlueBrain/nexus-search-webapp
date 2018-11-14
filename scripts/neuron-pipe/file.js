import fs from "fs";
import path from "path";

export default {
  write (name, data) {
    fs.writeFileSync(
      path.resolve(__dirname, `../test-data/${name}.json`),
      JSON.stringify(data, null, 2),
      "utf-8"
    );
  },
  read (name) {
    fs.readFileSync(
      path.resolve(__dirname, `../test-data/${name}.json`),
      "utf-8"
    );
  }
};