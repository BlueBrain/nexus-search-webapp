import { get } from "https";
import { createWriteStream, unlinkSync} from "fs";

export default (url, dest) => {
  return new Promise((resolve, reject) => {
    const file = createWriteStream(dest);
    const request = get(url, response => {
      response.pipe(file);
      file.on("finish", () => {
        file.close();
        console.log(`successfully downloaded file ${url} to ${dest}`)
        return resolve();
      });
    }).on("error", err => {
      console.log(err);
      // unlinkSync(dest);
      return reject(err);
    });
  });
};
