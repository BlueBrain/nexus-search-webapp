import processDoc from "../processDoc";
import fetchResourceById from "../fetchResourceById";
import getRelatedResourceWithFilter from "../getRelatedResourceWithFilter";
import trimMetaData from "../trimMetaData";
import pushToNexus from "../pushToNexus";
import deprecateFromNexus from "../deprecateFromNexus";
import flattenDownloadables from "../flattenDownloadables";
import { getProp } from "@libs/utils";
import { mTypes } from "@consts";
import { dataTypes } from "../consts";

const PUBLIC_PROJECT = "search-app-staging-public-4";
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
      let subjectResult = await fetchResourceById(doc, doc => subject);
      doc.subject = subjectResult;
      doc.subject.species = getProp(doc, "subject.species.label");
      if (
        doc.subject.species &&
        doc.subject.species.toLowerCase() === "mouse"
      ) {
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
        // Hard Coded! (we know they're all mice)
        doc.subject = {
          species: "Mus musculus"
        };

        doc.dataSource.repository = "Allen Cell Types Database";

        doc.citations = {
          howToCite: "https://alleninstitute.org/legal/citation-policy/",
          citationsList: [
            {
              text:
                "© 2015 Allen Institute for Brain Science. Allen Cell Types Database. Available from: http://celltypes.brain-map.org/",
              location: doc.citation
                ? doc.citation
                : "http://celltypes.brain-map.org/"
            }
          ]
        };

        // PUBLIC
        // allen only ever has one contribution, but we'll let them slide for now
        // with an array. We can hard code in the value.
        let project = PUBLIC_PROJECT;
        doc.resourceURL = `https://bbp.epfl.ch/nexus/v1/resources/webapps/${project}/resource/`;
        doc.dataSource.nexusProject = project;
        let contribution = activity.wasStartedBy.map(() => {
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

        // neuromorpho citations
        doc.citations = {
          howToCite: "http://neuromorpho.org/useterm.jsp",
          citationsList: [
            {
              text:
                "Ascoli GA, Donohue DE, Halavi M. (2007) NeuroMorpho.Org: a central resource for neuronal morphologies.J Neurosci., 27(35):9247-51",
              location: doc.citation
            }
          ]
        };

        let project = PUBLIC_PROJECT;
        doc.resourceURL = `https://bbp.epfl.ch/nexus/v1/resources/webapps/${project}/resource/`;
        doc.dataSource.nexusProject = project;
        // PUBLIC
        let contribution = await Promise.all(
          activity.wasAssociatedWith.map(async wasAssociatedWith => {
            let trimData = false;
            let affiliation = await fetchResourceById(
              doc,
              doc => wasAssociatedWith["@id"],
              trimData
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
            if (
              contrib["@type"] &&
              contrib["@type"].includes("schema:Person")
            ) {
              let agent = trimMetaData(contrib);
              agent.fullName = agent.additionalName
                ? `${agent.givenName} ${agent.additionalName} ${
                    agent.familyName
                  }`
                : `${agent.givenName} ${agent.familyName}`;
              agent.person = agent.fullName;

              if (agent.fullName === "Christiaan de Kock") {
                // DeKock NeoMorpho Data
                // Hard Coded! (we know they're all Humans)
                doc.subject = {
                  species: "Homo sapiens"
                };

                // NEOCORTEX
                let project = NEOCORTEX_PROJECT;
                doc.dataSource.nexusProject = project;
                doc.resourceURL = `https://bbp.epfl.ch/nexus/v1/resources/webapps/${project}/resource/`;
                delete doc.dataSource.repository;
                delete doc.dataSource.source;
                delete doc.license.name;
                doc.citations = {
                  howToCite: null,
                  citationsList: [
                    {
                      text:
                        "Hemanth Mohan, Matthijs B. Verhoog, Keerthi K. Doreswamy, Guy Eyal, Romy Aardse, Brendan N. Lodder, Natalia A. Goriounova, Boateng Asamoah, A.B. Clementine B. Brakspear, Colin Groot, Sophie van der Sluis, Guilherme Testa-Silva, Joshua Obermayer, Zimbo S.R.M. Boudewijns, Rajeevan T. Narayanan, Johannes C. Baayen, Idan Segev, Huibert D. Mansvelder, Christiaan P.J. de Kock; Dendritic and Axonal Architecture of Individual Pyramidal Neurons across Layers of Adult Human Neocortex, Cerebral Cortex, Volume 25, Issue 12, 1 December 2015, Pages 4839–4853, https://doi.org/10.1093/cercor/bhv188",
                      location: "doi: 10.1093/cercor/bhv188"
                    },
                    {
                      text:
                        "Yair Deitcher, Guy Eyal, Lida Kanari, Matthijs B Verhoog, Guy Antoine Atenekeng Kahou, Huibert D Mansvelder, Christiaan P J de Kock, Idan Segev; Comprehensive Morpho-Electrotonic Analysis Shows 2 Distinct Classes of L2 and L3 Pyramidal Neurons in Human Temporal Cortex, Cerebral Cortex, Volume 27, Issue 11, 1 November 2017, Pages 5398–5414, https://doi.org/10.1093/cercor/bhx226",
                      location: "doi: 10.1093/cercor/bhx226"
                    }
                  ]
                };
              }

              // How we judge the ACL's for this data is based on authorship
              if (agent.fullName === "Javier DeFelipe") {
                // NEOCORTEX
                let project = NEOCORTEX_PROJECT;
                doc.dataSource.nexusProject = project;
                doc.resourceURL = `https://bbp.epfl.ch/nexus/v1/resources/webapps/${project}/resource/`;
                // remove citations for neocortex data
                delete doc.citations;
              }
              // we can find the org via email (seems to be only two)
              if (agent.email) {
                if (agent.email.indexOf("bcm.edu") >= 0) {
                  agent.organization = "Baylor College of Medicine";
                }
                if (agent.email.indexOf("mcgill.ca") >= 0) {
                  agent.organization = "McGill University";
                }
              }
              memo.contribution.push(agent);
              return memo;
            }
            if (
              contrib["@type"] &&
              contrib["@type"].includes("nsg:SoftwareAgent")
            ) {
              memo.software = trimMetaData(contrib);
              return memo;
            }
            console.log("nothing matched", { contrib });
            throw new Error("nothing matched ");
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
  async doc => {
    if (!doc.dataSource.nexusProject) {
      throw new Error("there was no nexusProject found");
    }
    if (doc.image && Object.keys(doc.image).length) {
      doc.dataType = {
        morphology: dataTypes.morphology
      };
    }
    return doc;
  },
  async doc => await flattenDownloadables(doc),
  async doc => {
    if (shouldUpload) {
      if (!doc.resourceURL) {
        throw new Error("no resoureceURL found!");
      }
      await pushToNexus(doc, doc.resourceURL);
    }
    return doc;
  }
];
