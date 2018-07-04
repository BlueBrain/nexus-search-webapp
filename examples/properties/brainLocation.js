export default {
  type: "nested",
  properties: {
    brainRegion: {
      type: "nested",
      properties: {
        "@id": {
          type: "text",
          fields: {
            raw: {
              type: "keyword"
            }
          }
        },
        label: {
          type: "text",
          fields: {
            raw: {
              type: "keyword"
            }
          }
        },
        shortName: {
          type: "text",
          fields: {
            raw: {
              type: "keyword"
            }
          }
        }
      }
    }
  }
};
