import { getInstancesList, getURIPartsFromNexusURL } from "./helpers";
import { to } from "@libs/promise";

export default async (resourceURL, token) => {
  let [base, ...uriParts] = getURIPartsFromNexusURL(resourceURL);
  const nexusRequestOptions = {
    deprecated: false,
    fields: "all",
    size: 9999
  };
  let fetchAllResults = true;
  let [error, docs] = await to(
    getInstancesList(
      uriParts,
      nexusRequestOptions,
      base,
      fetchAllResults,
      token
    )
  );
  if (error) {
    throw error;
  }
  return docs.results;
};
