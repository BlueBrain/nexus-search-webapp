export default {
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
    distribution: {
      type: "nested",
      properties: {
        mediaType: {
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
