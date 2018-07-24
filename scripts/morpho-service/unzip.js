import unzip from "unzip";
import fs from "fs";

export default (archivePath, outputPath) => {
  return new Promise((resolve, reject) => {
    try {
      if (!fs.existsSync(archivePath)) {
        throw new Error(`unzip: archivePath does not exist at path ${archivePath}`)
      }
      fs.createReadStream(archivePath)
        .pipe(unzip.Extract({ path: outputPath }))
        .on("entry", entry => {
          console.log(`starting unzip! ${archivePath}`)
        })
        .on("close", resolve)
        .on("error", reject);
    } catch (error) {
      reject(error);
    }
  });
};