import getResources from "./getResources";
import { to, waitForEach } from "libs/promise";
import * as resources from "./resources";
import * as dependencies from "./adjacent-resources";

export default async function fetch(resource, resourceURL, shouldUpload = false) {
  let { url, short:shortName, dependency } = resource;
  let processorFactory = resources[shortName]
  let resolvedDependency;
  if (dependencies[dependency]) {
    let error;
    [error, resolvedDependency] = await to(dependencies[dependency]());
    if (error) {
      console.log("something went wrong while processing dependencies");
      throw new Error(error)
    }
  }
  let [error, docs] = await to(
    waitForEach(getResources(url), processorFactory(resource, resourceURL, shouldUpload, resolvedDependency))
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