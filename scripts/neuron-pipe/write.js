import fs from "fs";
import path from "path";

export default (name, data) => {
  fs.writeFileSync(
    path.resolve(__dirname, `./${name}.json`),
    JSON.stringify(data, null, 2),
    "utf-8"
  );
};
