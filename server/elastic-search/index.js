import elasticsearch from "elasticsearch";
import config from "../libs/config";
import types from "./types";
import facets from "./facets";
import docs from "./docs";
import * as errors from "./errors";
import queryFactory from "./queryFactory";

const index = config.ELASTIC_SEARCH_INDEX;
const host = config.ELASTICSEARCH_CLIENT_URL;
const client = new elasticsearch.Client({ host });

if (!index) { throw new errors.InvalidConfigError('no ES index defined! please define env ELASTIC_SEARCH_INDEX')}
if (!host) { throw new errors.InvalidConfigError('no ES host defined! please define env ELASTICSEARCH_CLIENT_URL')}

const ENDPOINTS = {
  types: queryFactory(client, index, types.queryBuilder, types.normalizer),
  facets: queryFactory(client, index, facets.queryBuilder, facets.normalizer),
  docs: queryFactory(client, index, docs.queryBuilder, docs.normalizer)
};

export default ENDPOINTS;