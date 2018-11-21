import { getProp } from "@libs/utils";
import processDoc from "../processDoc";
import fetchResourceById from "../fetchResourceById";
import pushToNexus from "../pushToNexus";
import flattenDownloadables from "../flattenDownloadables";
import getRelatedResourceWithFilter from "../getRelatedResourceWithFilterBody";
import { resources } from "../consts";

export default (resource, resourceURL, shouldUpload, dependencies) => [
  processDoc(resource),
  async doc => {
    doc.license = {
      name: "BBP/EPFL",
      availability: "Private"
    };
    doc.subject = {
      species: getProp(doc, "species.label")
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
      doc => doc.modelScript["@id"]
    );
    doc.modelScript = [modelScript];
    return doc;
  },
  async doc => {
    let { context } = resource;
    let response = await getRelatedResourceWithFilter(
      context,
      doc["@id"],
      "prov:SoftwareAgent",
      (startingResourceURI, targetResourceType, context) => {
        const query = {
          "@context": context,
          filter: {
            op: "and",
            value: [
              {
                path: "rdf:type",
                op: "eq",
                value: "nsg:EModel"
              },
              {
                path: "nsg:subCellularMechanism",
                op: "eq",
                value: startingResourceURI
              },
              {
                path: "nxv:deprecated",
                op: "eq",
                value: false
              }
            ]
          }
        };
        return query;
      }
    );
    doc.usedBy = response.results.map(({ resultId, name }) => {
      let resourceList = Object.keys(resources)
        .map(key => resources[key])
        .filter(resource => {
          return resultId.indexOf(resource.url) >= 0;
        });
      let targetResource = resourceList.length ? resourceList[0] : null;
      return {
        "@id": resultId,
        searchId: resultId.replace(
          targetResource.url,
          `${targetResource.short}:`
        ),
        name: name,
        type: targetResource.type
      };
    });
    return doc;
  },
  async doc => {
    let agent = await fetchResourceById(
      doc,
      doc => doc.wasAttributedTo["@id"]
    );
    agent.fullName = agent.fullName = agent.additionalName
      ? `${agent.givenName} ${agent.additionalName} ${agent.familyName}`
      : `${agent.givenName} ${agent.familyName}`;
    agent.person = agent.fullName;
    // must delete the @id or the get by ID API won't give the entire content
    // and instead just offer the @id
    delete agent["@id"];
    agent.organization = "Blue Brain Project";
    doc.contribution = [agent];
    return doc;
  },
  async doc => {
    doc.dataSource.nexusProject = resource.project;
    return doc;
  },
  async doc => await flattenDownloadables(doc),
  async doc => {
    if (shouldUpload) {
      await pushToNexus(doc, resourceURL);
    }
    return doc;
  }
];
