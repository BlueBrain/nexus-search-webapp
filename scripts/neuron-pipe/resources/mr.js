import getResources from "../getResources";
import { to, waitForEach } from "@libs/promise";
import processDoc from "../processDoc";
import fetchResourceById from "../fetchResourceById";
import pushToNexus from "../pushToNexus";
import flattenDownloadables from "../flattenDownloadables";
import emtc from "../../testData/emtc.json";
import { getProp } from "@libs/utils";

export const processorFactory = (resource, resourceURL, shouldUpload) => [
  processDoc(resource),
  async doc => {
    doc.license = {
      name: "BBP/EPFL",
      availability: "Private"
    };
    doc.subject = {
      species: getProp(doc, "species.label")
    };
    doc.cellName = {
      label: doc.name
    };
    // get traces from trace collection (must be previously prepared)
    doc.traces = emtc[getProp(doc, "cellName.label")];
    doc.brainLocation = {
      brainRegion: getProp(doc, "brainRegion.label")
    };
    delete doc.brainRegion;
    delete doc.species;
    return doc;
  },
  async doc => {

    let modelScript = await fetchResourceById(
      doc,
      doc => doc.wasAttributedTo["@id"]
    );
    let agent = await fetchResourceById(
      doc,
      doc => modelScript.wasAttributedTo["@id"]
    );
    let item1 = await fetchResourceById(
      doc,
      doc => modelScript.wasDerivedFrom[0]["@id"]
    );
    let item2 = await fetchResourceById(
      doc,
      doc => modelScript.wasDerivedFrom[1]["@id"]
    );
    doc.scripts = [item1, item2];
    agent.fullName = agent.fullName = agent.additionalName
      ? `${agent.givenName} ${agent.additionalName} ${agent.familyName}`
      : `${agent.givenName} ${agent.familyName}`;
    agent.person = agent.fullName;
    agent.organization = "Blue Brain Project";
    delete agent["@id"];
    doc.contribution = [agent];
    return doc;
  },
  async doc => await flattenDownloadables(doc),
  async doc => {
    delete doc.distribution;
    delete doc.morphologyIndex;
    return doc;
  },
  async doc => {
    if (shouldUpload) {
      await pushToNexus(doc, resourceURL);
    }
    return doc;
  }
];

async function fetch(resource, resourceURL, shouldUpload=false) {
  let { url } = resource;
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
}

export default fetch;
