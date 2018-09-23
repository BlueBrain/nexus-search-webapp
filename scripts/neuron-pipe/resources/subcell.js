import getConfig from "../config";
import getResources from "../getResources";
import file from "../file";
import { to, waitForEach } from "@libs/promise";
import { getProp } from "@libs/utils";
import processDoc from "../processDoc";
import fetchResourceById from "../fetchResourceById";
import pushToNexus from "../pushToNexus";
import flattenDownloadables from "../flattenDownloadables";
import getRelatedResourceWithFilter from "../getRelatedResourceWithFilterBody";
import { getURIPartsFromNexusURL } from "../helpers";
import { resources } from "../consts";

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
          doc => doc.modelScript["@id"]
        );
        doc.modelScript = [modelScript];
        return doc;
      },
      async doc => {
        let response = await getRelatedResourceWithFilter(
          { token, base, context },
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
      // async doc => {
      //   let generatedFrom = await fetchResourceById(
      //     doc,
      //     easyConfig.token,
      //     doc => doc.generatedFrom
      //   );
      //   doc.software = generatedFrom;
      //   return doc;
      // },
      async doc => {
        let agent = await fetchResourceById(
          doc,
          token,
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
