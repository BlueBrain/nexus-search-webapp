import JSZip from "jszip";
import { getProp } from "@libs/utils";
import fetchProtectedData from "../../libs/fetchProtectedData";
import saveAs from "./saveAs";

export default (files, name, token) =>
  new Promise((resolve, reject) => {
    let zip = new JSZip();
    Promise.all(
      files.map(file =>
        fetchProtectedData.asBase64(getProp(file, "downloadURL"), token)
      )
    )
      .then(base64DataResults => {
        files.forEach((file, index) =>
          zip.file(getProp(file, "originalFileName"), base64DataResults[index])
        );
        return zip.generateAsync({ type: "base64" });
      })
      .then(content => {
        saveAs("data:text/plain;base64," + content, name + ".zip");
        resolve();
      })
      .catch(reject);
  });
