export default {
  type: "nested",
  properties: {
    strain: {
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
        }
      }
    },
    species: {
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
        }
      }
    }
  }
};
