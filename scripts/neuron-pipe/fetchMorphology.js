import { fetchWithToken } from "./helpers";
import { getProp } from "../../src/libs/utils";
import trimMetaData from "./trimMetaData";

export default async (doc, config) => {
  try {
    const { token, base, org, domain, context, schema, ver } = config;
    let [morphoCellName] = doc.name.split("-");
    console.log({ morphoCellName });
    let queryURL =
      base +
      "/data/" +
      org +
      `/morphology/reconstructedcell/v0.1.0/?q=${morphoCellName}&fields=all`;
    let response = await fetchWithToken(queryURL, token);
    let resource = await response.json();
    console.log(resource.total);
    if (!resource.results) {
      return doc;
    }
    if (resource.results.length === 1) {
      doc.morphology = resource.results.map(morpho =>
        trimMetaData(morpho.source)
      )[0];
    }
    return doc;
  } catch (error) {
    throw error;
  }
};
