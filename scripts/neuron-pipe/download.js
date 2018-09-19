import { get } from "https";
import { createWriteStream, existsSync, mkdirSync } from "fs";
import URL from "url";

export default (url, dest, token, fileName) => {
  return new Promise((resolve, reject) => {
    if (!existsSync(dest)){
      mkdirSync(dest);
    }
    const file = createWriteStream(dest + "/" + fileName);
    let { protocol, hostname, path } = URL.parse(url);
    const options = token ? {
      protocol,
      hostname,
      path,
      headers: {
        Authorization: `Bearer ${token}`
      }
    } : {};
    get(options, response => {
      response.pipe(file);
      file.on("finish", () => {
        file.close();
        console.log(`successfully downloaded file ${fileName} to ${dest}`)
        return resolve();
      });
    }).on("error", err => {
      console.log(err);
      return reject(err);
    });
  });
};
