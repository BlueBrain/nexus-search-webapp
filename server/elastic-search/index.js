import elasticsearch from "elasticsearch";
import config from "../config";
import types from "./types";
import facets from "./facets";
import docs from "./docs";
import queryFactory from "./queryFactory";

const index = config.ELASTIC_SEARCH_INDEX;
const client = new elasticsearch.Client({
  host: config.ELASTICSEARCH_CLIENT_URL
});

const ENDPOINTS = {
  types: queryFactory(client, index, types.queryBuilder, types.normalizer),
  facets: queryFactory(client, index, facets.queryBuilder, facets.normalizer),
  docs: queryFactory(client, index, docs.queryBuilder, docs.normalizer)
};

export default ENDPOINTS;