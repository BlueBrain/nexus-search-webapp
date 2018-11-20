import properties from "../../properties";

export default {
  "@type": [
    "Alpha",
    "View",
    "ElasticView"
  ],
  "resourceSchemas": [
    // It's strange to have this result from the API:
    // https://bluebrain.github.io/nexus/schemas/resource.json
    "https://bluebrain.github.io/nexus/schemas/resource.json"
  ],
  "includeMetadata": false,
  "mapping": {
    properties
  }
};
