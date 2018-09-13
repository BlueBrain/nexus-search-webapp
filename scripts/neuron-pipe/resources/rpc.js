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
import { getURIPartsFromNexusURL, fetchWithToken } from "../helpers";

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
        doc.brainRegion = doc.brainLocation.brainRegion;
        delete doc.brainLocation;
        return doc;
      },
      async doc => {
        let subject = getProp(doc, "wasDerivedFrom.@id");
        if (subject) {
          let subjectResult = await fetchResourceById(
            doc,
            token,
            doc => subject
          );
          doc.subject = subjectResult;
          doc.subject.species = getProp(doc, "subject.species.label");
          doc.subject.sex = getProp(doc, "subject.sex.label");
          doc.subject.strain = getProp(doc, "subject.strain.label");
        }
        return doc;
      },
      async doc => {
        let response = await getRelatedResourceWithFilter(
          { token, base, context },
          doc["@id"],
          "nsg:ReconstructedCell",
          function makeQuery(startingResourceURI, targetResourceType) {
            const query = {
              op: "and",
              value: [
                {
                  op: "eq",
                  path: "prov:generated",
                  value: startingResourceURI
                },
                {
                  op: "eq",
                  path: "rdf:type",
                  value: "prov:Activity"
                }
              ]
            };
            return query;
          }
        );
        let activity =
          response.results && response.results.length
            ? response.results[0].source
            : null;

        if (activity) {
          // TODO change repos to URLS
          if (activity.wasStartedBy) {
            // we know its allen
            doc.distributions.repository = "Allen";
            // allen only ever has one contribution, but we'll let them slide for now
            // with an array
            let contributions = await Promise.all(
              activity.wasStartedBy.map(async wasStartedBy => {
                let response = await fetchWithToken(wasStartedBy["@id"], token);
                let json = await response.json();
                json.fullName = json.name;
                return trimMetaData(json);
              })
            );
            doc.contributions = contributions;
          }
          if (activity.wasAssociatedWith) {
            // we know its neuromorpho
            doc.distributions.repository = "NeuroMorpho";
            let contributions = await Promise.all(
              activity.wasAssociatedWith.map(async wasAssociatedWith => {
                let response = await fetchWithToken(wasAssociatedWith["@id"], token);
                let json = await response.json();
                return json;
              })
            );

            // we can seperate the software form the people using types
            contributions = contributions.reduce(
              (memo, contrib) => {
                if (contrib["@type"].includes("schema:Person")) {
                  contrib.fullName = contrib.givenName + " " + contrib.familyName;;
                  memo.contributions.push(trimMetaData(contrib));
                  return memo;
                }
                if (contrib["@type"].includes("nsg:SoftwareAgent")) {
                  memo.software = trimMetaData(contrib);
                  return memo;
                }
                return memo;
              },
              { contributions: [], software: {} }
            );
            doc = Object.assign(doc, { ...contributions });
          }
        }
        doc.cellTypes = {
          mType: getProp(doc, "mType.label")
        };
        delete doc.mType;
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
