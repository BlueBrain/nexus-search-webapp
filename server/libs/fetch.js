import fetch from "node-fetch";
import { ExternalServiceError, NotFoundError, UnauthorizedError } from "./errors"
import { resolveMessages } from "../libs/logger";

export default async function fetchToJSONWithLogging (url, options) {
  console.log(url, options)
  let res = await fetch(url, options);
  let message = resolveMessages(res.status, res.statusText)
  console.log(message);
  if (res.status === 401) {
    throw(new UnauthorizedError());
  }
  if (res.status === 400) {
    throw(new NotFoundError());
  }
  if (res.status >= 500) {
    throw(new ExternalServiceError());
  }
  let results = await res.json();
  console.log(results)
  return results;
}