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
        doc.brainLocation = {
          brainRegion: getProp(doc, "brainLocation.brainRegion.label")
        };
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
          if (doc.subject.species && doc.subject.species.toLowerCase() === "mouse") {
            doc.subject.species = "Mus Musculus";
          }
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
            doc.dataSource.repository = "Allen Cell Types Database";
            // allen only ever has one contribution, but we'll let them slide for now
            // with an array. We can hard code in the value.
            let contribution =
              activity.wasStartedBy.map(() => {
                return {
                  organization: "Allen Institute for Brain Science"
                };
              });
            doc.contribution = contribution;

            // license for Allen
            doc.license = {
              name: "Allen Institute License",
              availability: "Private"
            };
          }
          if (activity.wasAssociatedWith) {
            // we know its neuromorpho
            doc.dataSource.repository = "NeuroMorpho.org";
            let contribution = await Promise.all(
              activity.wasAssociatedWith.map(async wasAssociatedWith => {
                let response = await fetchWithToken(wasAssociatedWith["@id"], token);
                let json = await response.json();
                return json;
              })
            );

            doc.license = {
              name: "NeuroMorpho License",
              availability: "Private"
            };

            // we can seperate the software form the people using types
            contribution = contribution.reduce(
              (memo, contrib) => {
                if (contrib["@type"].includes("schema:Person")) {
                  let agent = trimMetaData(contrib);
                  agent.fullName = agent.additionalName
                    ? `${agent.givenName} ${agent.additionalName} ${agent.familyName}`
                    : `${agent.givenName} ${agent.familyName}`;
                  agent.person = agent.fullName;
                  // we can find the org via email (seems to be only two)
                  if (agent.email) {
                    if (agent.email.indexOf("bcm.edu") >= 0) {
                      agent.organization = "Baylor College of Medicine"
                    }
                    if (agent.email.indexOf("mcgill.ca") >= 0) {
                      agent.organization = "McGill University"
                    }
                  }
                  memo.contribution.push(agent);
                  return memo;
                }
                if (contrib["@type"].includes("nsg:SoftwareAgent")) {
                  memo.software = trimMetaData(contrib);
                  return memo;
                }
                return memo;
              },
              { contribution: [], software: {} }
            );
            doc = Object.assign(doc, { ...contribution });
          }
        }
        let mType = getProp(doc, "mType.label");
        doc.cellType = {
          mType: mType ? mTypes[mType.toLowerCase()] : null
        };
        delete doc.mType;
        return doc;
      },
      // downloadMorph(token, short),
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
