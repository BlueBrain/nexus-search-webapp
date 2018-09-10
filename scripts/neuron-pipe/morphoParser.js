import { getProp } from "@libs/utils";
import { getDistributionFromInstance } from "../../client/libs/distributions";
import morphoParser from "../morpho-service";
import {to} from "@libs/promise";

export default async (doc, config) => {
  try {
    const { token, base, org, domain, context, schema, ver } = config;
    let morphology = getProp(doc, "morphology", [{}])[0];
    const distro = getDistributionFromInstance(morphology);
    if (distro && morphology) {
      // let [id] = morphology["@id"].split("/").slice(-1);
      let name = morphology.name;
      console.log("found morpho: ", name)
      let [error, result] = await to(morphoParser(distro, token, name))
      if (error) {
        console.log(error);
        return doc
      }
      doc.morphologyFile = result.name
    }
    return doc;
  } catch (error) {
    throw error;
  }
};
