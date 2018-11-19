import processDoc from "../processDoc";
import fetchResourceById from "../fetchResourceById";
import getRelatedResourceWithFilter from "../getRelatedResourceWithFilter";
import trimMetaData from "../trimMetaData";
import pushToNexus from "../pushToNexus";
import flattenDownloadables from "../flattenDownloadables";
import { getProp } from "@libs/utils";
import { mTypes } from "@consts";

const PUBLIC_PROJECT = "search-app-staging-public";
const NEOCORTEX_PROJECT = "search-app-staging-neocortex";

export default (resource, resourceURL, shouldUpload, dependencies) => [
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
        doc => subject
      );
      doc.subject = subjectResult;
      doc.subject.species = getProp(doc, "subject.species.label");
      if (doc.subject.species && doc.subject.species.toLowerCase() === "mouse") {
        doc.subject.species = "Mus musculus";
      }
      doc.subject.sex = getProp(doc, "subject.sex.label");
      doc.subject.strain = getProp(doc, "subject.strain.label");
    }
    return doc;
  },
  async doc => {
    let { context } = resource;
    let response = await getRelatedResourceWithFilter(
      context,
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
        // PUBLIC
        // allen only ever has one contribution, but we'll let them slide for now
        // with an array. We can hard code in the value.
        let project = PUBLIC_PROJECT;
        doc.resourceURL = `https://bbp.epfl.ch/nexus/v1/resources/webapps/${project}/resource/`;
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
        let project = PUBLIC_PROJECT;
        doc.resourceURL = `https://bbp.epfl.ch/nexus/v1/resources/webapps/${project}/resource/`;
        // PUBLIC
        let contribution = await Promise.all(
          activity.wasAssociatedWith.map(async wasAssociatedWith => {
            let affiliation = await fetchResourceById(
              doc,
              doc => wasAssociatedWith["@id"]
            );
            return affiliation;
          })
        );

        doc.license = {
          name: "NeuroMorpho License",
          availability: "Private"
        };

        // we can seperate the software form the people using types
        contribution = contribution.reduce(
          (memo, contrib) => {
            console.log({contrib})
            if (!contrib["@type"]) {
              // probably a software
              memo.software = trimMetaData(contrib);
              return memo;
            }
            if (contrib.affiliation) { contrib = contrib.affiliation };
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

    // if no contribution has been found yet, that's because they're
    // a DAT file which didn't have contributors uploaded to NEXUS
    // TODO subject to change!
    if (!doc.contribution) {
      // NEOCORTEX
      let project = NEOCORTEX_PROJECT;
      doc.resourceURL = `https://bbp.epfl.ch/nexus/v1/resources/webapps/${project}/resource/`;
      doc.contribution = [{
        "email": "defelipe@cajal.csic.es",
        "familyName": "DeFelipe",
        "givenName": "Javier",
        "nxv:deprecated": false,
        "fullName": "Javier DeFelipe",
        "person": "Javier DeFelipe",
        "organization": "Center for Biomedical Technology Technical University of Madrid"
      }]
    }

    return doc;
  },
  async doc => await flattenDownloadables(doc),
  async doc => {
    if (shouldUpload) {
      await pushToNexus(doc, doc.resourceURL);
    }
    return doc;
  }
];