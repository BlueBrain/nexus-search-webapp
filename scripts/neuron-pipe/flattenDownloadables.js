import { isObject } from "@libs/utils";

const DISTRIBUTION_KEY = "distribution";

function flattenDistributions(doc) {
  return Object.keys(doc).reduce((fileList, key) => {
    let entry = doc[key];
    if (key === DISTRIBUTION_KEY) {
      return fileList.concat(entry);
    }
    if (typeof entry === "string") {
      return fileList;
    }
    if (Array.isArray(entry)) {
      return fileList.concat(
        entry.reduce((list, obj) => list.concat(flattenDistributions(obj)), [])
      );
    }
    if (isObject(entry)) {
      return fileList.concat(flattenDistributions(entry));
    }
    return fileList;
  }, []);
}

export default async doc => {
  let files = flattenDistributions(doc);
  console.log(files.length);
  doc.files = files;
  return doc;
};
