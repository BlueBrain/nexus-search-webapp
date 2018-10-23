import getResources from "../getResources";
import file from "../file";
import { to, waitForEach } from "@libs/promise";
import processDoc from "../processDoc";
import fetchResourceById from "../fetchResourceById";
import pushToNexus from "../pushToNexus";
import flattenDownloadables from "../flattenDownloadables";
import getRelatedResourceWithFilter from "../getRelatedResourceWithFilterBody";
import { getURIPartsFromNexusURL, fetchWithToken } from "../helpers";
import pc from "../../testData/pc.json";
import emtc from "../../testData/emtc.json";
import downloadMorph from "../downloadMorph";
import { getProp } from "@libs/utils";
import { mTypes } from "@consts";

async function fetch(resource, token, shouldUpload, resourceURL) {
  let { short, source, url, context } = resource;
  let [base, ...urlParts] = getURIPartsFromNexusURL(url);
  let [error, docs] = await to(
    waitForEach(getResources(url, token), [
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
          token,
          doc => doc.wasAttributedTo["@id"]
        );
        let agent = await fetchResourceById(
          doc,
          token,
          doc => modelScript.wasAttributedTo["@id"]
        );
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
        if (shouldUpload) {
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
  console.log("found " + docs.length + " docs");
  console.log("finished, writing to file");
  file.write(short, docs);
}

export default fetch;
