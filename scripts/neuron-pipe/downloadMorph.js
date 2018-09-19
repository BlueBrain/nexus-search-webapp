import { getProp } from "@libs/utils";
import download from "./download";
import { to } from "@libs/promise";
import path from "path";

const defaultGetMorphologyDistro = doc => doc;

export default (token, short, getMorphologyDistro=defaultGetMorphologyDistro) => async doc => {
  let morphology = getMorphologyDistro(doc);
  const distro = getProp(morphology, "distribution", [{}])[0];
  const { downloadURL, originalFileName } = distro;
  console.log(downloadURL, originalFileName, distro, morphology);
  if (distro.downloadURL) {
    console.log("found morpho: ", originalFileName);
    const destination = path.resolve(__dirname, "../testData/" + short);
    const [fileName, ext] = originalFileName.split(".");
    let [error, result] = await to(download(downloadURL, destination, token, doc.searchID + "." + ext));
    if (error) {
      console.log(error);
      return doc;
    }
  }
  return doc;
};
