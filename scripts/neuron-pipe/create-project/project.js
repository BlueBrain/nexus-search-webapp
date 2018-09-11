import { base, resources } from "../consts";

const resourcePrevixMappings = Object.keys(resources).map(key => {
  return {
    namespace: resources[key].url,
    prefix: key
  };
});

export default {
  "@context":
    "https://bbp-nexus.epfl.ch/staging/v1/contexts/nexus/core/resource/v0.4.0",
  "@type": "nxv:Project",
  base,
  name: "Search Project",
  prefixMappings: [
    {
      namespace: "http://example.com/some/person",
      prefix: "person"
    },
    {
      namespace: "https://bluebrain.github.io/nexus/schemas/",
      prefix: "schemas"
    },
    {
      namespace: "https://bluebrain.github.io/nexus/schemas/shacl",
      prefix: "shacl"
    },
    {
      namespace: "https://bluebrain.github.io/nexus/schemas/resource",
      prefix: "resources"
    },
    ...resourcePrevixMappings
  ]
};
