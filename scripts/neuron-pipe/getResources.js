import { getInstancesList, getURIPartsFromNexusURL } from "./helpers";
import { to } from "@libs/promise";
import whichToken from "../../server/libs/whichToken"

export default async (resourceURL, options={}, cb) => {
  let token = whichToken(resourceURL);
  let [base, ...uriParts] = getURIPartsFromNexusURL(resourceURL);
  const nexusRequestOptions = {
    deprecated: false,
    fields: "all",
    size: 999999
  };
  let fetchAllResults = true;
  let [error, docs] = await to(
    getInstancesList(
      uriParts,
      Object.assign(nexusRequestOptions, options),
      base,
      fetchAllResults,
      token,
      cb
    )
  );
  if (error) {
    throw error;
  }
  return docs.results;
};
