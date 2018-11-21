import processDoc from "../processDoc";
import fetchResourceById from "../fetchResourceById";
import pushToNexus from "../pushToNexus";
import flattenDownloadables from "../flattenDownloadables";
import { getProp } from "@libs/utils";

export default (resource, resourceURL, shouldUpload) => [
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
    console.log({modelScript});
    // for some reason, some data links to this person is a model script?
    let agent
    if (modelScript["@id"].indexOf("person") >= 0 && !modelScript.wasAttributedTo) {
      agent = modelScript;
    }
    if (modelScript.wasAttributedTo) {
      agent = await fetchResourceById(
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
    }
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
    doc.dataSource.nexusProject = resource.project;
    return doc;
  },
  async doc => {
    if (shouldUpload) {
      await pushToNexus(doc, resourceURL);
    }
    return doc;
  }
];