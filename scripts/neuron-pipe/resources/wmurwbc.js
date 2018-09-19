import getResources from "../getResources";
import file from "../file";
import { to, waitForEach } from "libs/promise";
import processDoc from "../processDoc";
import fetchResourceById from "../fetchResourceById";
import getRelatedResourceWithFilter from "../getRelatedResourceWithFilter";
import trimMetaData from "../trimMetaData";
import pushToNexus from "../pushToNexus";
import flattenDownloadables from "../flattenDownloadables";
import { getProp } from "@libs/utils";
import { getURIPartsFromNexusURL } from "../helpers";
import downloadMorph from "../downloadMorph";

async function fetch(resource, token, shouldUpload, resourceURL) {
  let { short, source, url, context } = resource;
  let [base, ...urlParts ] = getURIPartsFromNexusURL(url);
  let [error, docs] = await to(
    waitForEach(getResources(url, token), [
      processDoc(resource),
      async doc => {
        doc.cellName = {
          label: doc.name
        };
        // Hard Coded! There's no mouse data there
        doc.subject = {
          species: "Mus musculus"
        }
        doc.brainRegion = doc.brainLocation.brainRegion;
        doc.cellTypes = { specialDesignation: "Whole Brain"}
        delete doc.brainLocation;
        return doc;
      },
      async doc => {
        let mTypePreprocessed = getProp(doc, "mType.label");
        if (mTypePreprocessed) {
          let [layer, mTypeWithColon] = mTypePreprocessed.split("_");
          let [mType, unknownValue] = mTypeWithColon.split(":");
          doc.brainRegion.layer = layer;
          doc.cellTypes.mType = mType;
        }
        return doc;
      },
      downloadMorph(token, short),
      async doc => await flattenDownloadables(doc),
      async doc => {
        // don't upload if the name starts with AA
        // because it is a duplicate of RWBC found in this same directory!
        // TODO: decide which duplicate to use
        let isMouseLightCell = doc.name.slice(0, 2) === "AA";
        if (shouldUpload && !isMouseLightCell) {
          await pushToNexus(doc, token, resourceURL);
        }
        return doc;
      }
    ])
  );
  if (!docs) {
    console.log(error, docs);
    throw new Error(
      "no docs found for some reason, maybe there was an auth error, check your token"
    );
  }
  // TODO remove filter after duplication is resolved
  docs = docs.filter(doc => {
    let isMouseLightCell = doc.name.slice(0, 2) === "AA";
    return !isMouseLightCell
  });
  console.log("found " + docs.length + " docs");
  console.log("finished, writing to file");
  file.write(short, docs);
}

export default fetch;
