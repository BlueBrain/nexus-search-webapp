import { get } from "https";
import { createWriteStream } from "fs";
import URL from "url";

export default (url, dest, token) => {
  return new Promise((resolve, reject) => {
    const file = createWriteStream(dest);
    console.log(url);
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
        console.log(`successfully downloaded file ${url} to ${dest}`)
        return resolve();
      });
    }).on("error", err => {
      console.log(err);
      return reject(err);
    });
  });
};
