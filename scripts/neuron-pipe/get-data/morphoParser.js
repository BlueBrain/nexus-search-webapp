import { getProp } from "@libs/utils";
import { getDistributionFromInstance } from "../../../src/libs/distributions";
import morphoParser from "../../morpho-service";
import to from "./to";

export default async (doc, config) => {
  try {
    const { token, base, org, domain, context, schema, ver } = config;
    const distro = getDistributionFromInstance(getProp(doc, "morphology"));
    if (distro && doc.morphology) {
      let [id] = doc.morphology["@id"].split("/").slice(-1);
      console.log("found morpho: ", id)
      let [error, result] = await to(morphoParser(distro, token, id))
      if (error) {
        cosnole.log(error);
        return doc
      }
      doc.morphology.savedFile = result.name
    }
    return doc;
  } catch (error) {
    throw error;
  }
};
