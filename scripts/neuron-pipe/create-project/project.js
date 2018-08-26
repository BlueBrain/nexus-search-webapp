export default {
  "@context":
    "https://bbp-nexus.epfl.ch/staging/v1/contexts/nexus/core/resource/v0.4.0",
  "@type": "nxv:Project",
  base: "http://created.by.kenny/",
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
    {
      namespace:
        "https://bbp.epfl.ch/nexus/v0/data/bbp/experiment/patchedcell/v0.1.0/",
      prefix: "pc"
    },
    {
      namespace:
        "https://bbp-nexus.epfl.ch/staging/v0/data/somatosensorycortexproject/simulation/emodel/v0.1.1/",
      prefix: "em"
    }
  ]
};
