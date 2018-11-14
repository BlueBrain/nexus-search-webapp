import getResources from "./getResources";
import { to, waitForEach } from "libs/promise";
import * as resources from "./resources";

export default async function fetch(resource, resourceURL, shouldUpload = false) {
  let { url, short:shortName } = resource;
  let processorFactory = resources[shortName]
  let [error, docs] = await to(
    waitForEach(getResources(url), processorFactory(resource, resourceURL, shouldUpload))
  );
  if (!docs) {
    console.log(error, docs);
    throw new Error(
      "no docs found for some reason, maybe there was an auth error, check your token"
    );
  }
  console.log("found " + docs.length + " docs");
  return docs;
}