import { fetchWithToken} from "./helpers";
import { getProp } from "../../src/libs/utils";

const DEFAULT_PATH = "wasDerivedFrom.@id"

export default async (doc, name, replace, token, path=DEFAULT_PATH) => {
  let resourceID = getProp(doc, path);
  if (!resourceID) { return doc };
  let resource = await fetchWithToken(resourceID);
  doc[name] = resource;
  delete doc[replace]
  return doc
}