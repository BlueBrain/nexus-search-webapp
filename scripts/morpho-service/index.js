import path from "path";
import download from "./download";
import unzip from "./unzip";
import parseMorph from "./parseMorph";
import fs from "fs";

function deleteDirectoryFiles(directory) {
  return new Promise((resolve, reject) => {
    fs.readdir(directory, (err, files) => {
      if (err) {
        return reject(err);
      }

      for (const file of files) {
        fs.unlink(path.join(directory, file), err => {
          if (err) {
            return reject(err);
          }
          return resolve();
        });
      }
    });
  });
}

function getFilename(url) {
  if (url) {
    let m = url.toString().match(/.*\/(.+?)\./);
    if (m && m.length > 1) {
      return m[1];
    }
  }
  return "";
}

const FILE_FORMAT = "asc";

const morphoServicePromise = function (url) {
  return new Promise((resolve, reject) => {
    try {
      let fileName = getFilename(url);
      let archiveTarget = path.resolve(__dirname, `./temp/${fileName}.zip`);
      let extractTarget = path.resolve(__dirname, "./temp");
      let dataTarget = path.resolve(__dirname, `./data/${fileName}.text`);
      console.log("starting morphology parsing process");
      return download(url, archiveTarget)
        .then(() => {
          console.log("download finished, now unzipping");
          return unzip(archiveTarget, extractTarget);
        })
        .then(() => {
          console.log("unzipping finished, now parseMorph");
          return parseMorph(
            extractTarget + `/${fileName}.${FILE_FORMAT}`,
            dataTarget
          );
        })
        // .then(() => {
        //   console.log("parseMorph finished, now deleteDirectoryFiles");
        //   return deleteDirectoryFiles(extractTarget);
        // })
        .then(() => {
          console.log("parseMorph done, hurray!");
          return resolve({ path: dataTarget, name: fileName });
        })
        .catch(error => {
          console.log("what an error in the promise pipe for morpho-service");
          console.log(JSON.stringify(error, null, 2));
          return reject(error);
        });
    } catch (error) {
      console.trace(error);
      console.log("terrible error in morpho-service");
      return reject(error);
    }
  });
};

export default morphoServicePromise;