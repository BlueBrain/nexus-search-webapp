import properties from "../../properties";

export default {
  "@type": ["Alpha", "View", "ElasticSearchView"],
  resourceSchemas: [
    "https://bluebrain.github.io/nexus/schemas/unconstrained.json"
  ],
  includeMetadata: false,
  mapping: {
    dynamic: false,
    properties
  }
};
