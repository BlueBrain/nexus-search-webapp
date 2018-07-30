export default {
  type: "nested",
  properties: {
    role: {
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
    fullName: {
      type: "text",
      fields: {
        raw: {
          type: "keyword"
        }
      }
    },
    affiliation: {
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
