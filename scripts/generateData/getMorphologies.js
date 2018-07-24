import morphologyService from "../morpho-service";
import fs from "fs";
import path from "path";

const MORPHOLOGY_TRACKER_DIR = process.env.MORPHOLOGY_TRACKER_DIR;
const mtDir = path.resolve(MORPHOLOGY_TRACKER_DIR);
const morphoDir = `${mtDir}/reconstructedcell`;

const extractCellName = label => {
  const cellNameMatch = label.match(/[a-z]*([A-Z0-9]*).*/);
  return cellNameMatch[1].substring(0, cellNameMatch[1].length - 2);
};

export default function getMorphologies (documents) {
  return new Promise((resolve, reject) => {
    try {

      if (!fs.existsSync(morphoDir)) {
        throw new Error(`morphoDir does not exist at path ${morphoDir}`)
      }

      const morphoFiles = fs.readdirSync(morphoDir);

      let dataArr = [];
      let promises = [];
      morphoFiles.forEach(morphoFile => {
        const data = require(`${morphoDir}/${morphoFile}`);
        const cellName = extractCellName(data.name);
        if (documents[cellName]) {
          const morphoPath = `https://bbpteam.epfl.ch/public/nmc-portal-data-O1.v6/experimental-morphology-downloads/${
            data.name
          }.zip`;
          promises.push(morphologyService(morphoPath));
          dataArr.push(data);
        }
      });

      console.log(`there are ${dataArr.length} / ${promises.length} morpho with trace matches to process`)
      return Promise.all(promises)
      .then(results => {
        console.log(`there are ${results.length} finished processing`)
        results.forEach(({ name }, index) => {
          let data = dataArr[index];
          let cellName = extractCellName(data.name);
          let doc = documents[cellName];
          if (doc) {
            doc.morphology = {
              "@id": data["@id"],
              name: data.name,
              distribution: {
                mediaType: "application/zip",
                fileName: name,
                url: `https://bbpteam.epfl.ch/public/nmc-portal-data-O1.v6/experimental-morphology-downloads/${
                  data.name
                }.zip`
              }
            };
            console.log(
              `\nProcessed morphology ${data.name} for cell ${name}.\n`
            );
          }
        });
        return resolve(documents);
      })
      .catch(error => {
        return reject(error)
      });
    } catch (error) {
      console.log(error);
      console.log("something happend in getMorphologies");
      return reject(error);
    }
  });
};