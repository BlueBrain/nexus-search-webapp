import { getInstancesList } from "./helpers";
import {to} from "libs/promise";

export default async config => {
  const { token, base, org, domain, context, schema, ver } = config;
  let instance = null;
  const nexusRequestOptions = {
    deprecated: false,
    fields: "all",
    size: 9999
  };
  const boundary = [org, domain, schema, ver, instance].indexOf("instance");
  const uriParts = [org, domain, schema, ver, instance].slice(0, boundary);
  let [error, docs] = await to(getInstancesList(uriParts, nexusRequestOptions, base, true, token))
  if (error) { throw error; }
  return docs.results;
}