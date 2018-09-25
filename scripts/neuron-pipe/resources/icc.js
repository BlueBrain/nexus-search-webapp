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
import { mTypes } from "@consts";

async function fetch(resource, token, shouldUpload, resourceURL) {
  let { short, source, url, context } = resource;
  let [base, ...urlParts] = getURIPartsFromNexusURL(url);
  let [error, docs] = await to(
    waitForEach(getResources(url, token), [
      processDoc(resource),
      async doc => {
        doc.cellName = {
          label: doc.name
        };
        // Hard Coded! There's no mouse data there
        // doc.subject = {
        //   species: "Mus musculus"
        // }
        doc.license = {
          name: "BBP/EPFL",
          availability: "Private"
        };
        doc.contribution = [
          {
            email: "ranjan.rajnish@epfl.ch",
            familyName: "Ranjan",
            givenName: "Rajnish",
            fullName: "Rajnish Ranjan",
            person: "Rajnish Ranjan",
            organization: "Blue Brain Project"
          }
        ];
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
