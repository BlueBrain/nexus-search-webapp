import Client from "./client";
import ResourceClient from "./resourceClient";
import config from "../libs/config";
import types from "./types";
import facets from "./facets";
import docs from "./docs";
import * as errors from "./errors";
import queryFactory from "./queryFactory";
import getInstanceFactory from "./getInstance";
import getMappingFactory from "./getMapping";
import getMoreLikeThisFactory from "./getMoreLikeThis";

const index = config.ELASTIC_SEARCH_INDEX;
const host = config.ELASTICSEARCH_CLIENT_URL;
const resourceHost = config.RESOURCE_URL;
const client = new Client({ host });
const resourceClient = new ResourceClient({ host: resourceHost });

if (!index) {
  throw new errors.InvalidConfigError(
    "no ES index defined! please define env ELASTIC_SEARCH_INDEX"
  );
}
if (!host) {
  throw new errors.InvalidConfigError(
    "no ES host defined! please define env ELASTICSEARCH_CLIENT_URL"
  );
}
if (!resourceHost) {
  throw new errors.InvalidConfigError(
    "no Resource host defined! please define env RESOURCE_URL"
  );
}

const ENDPOINTS = {
  types: queryFactory(client, index, types.queryBuilder, types.normalizer),
  facets: queryFactory(client, index, facets.queryBuilder, facets.normalizer),
  docs: queryFactory(client, index, docs.queryBuilder, docs.normalizer),
  instances: getInstanceFactory(resourceClient),
  more: getMoreLikeThisFactory(client, index),
  mapping: getMappingFactory(client, index)
};

export default ENDPOINTS;
