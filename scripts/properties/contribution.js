export default {
  type: "nested",
  properties: {
    role: {
      type: "text",
      fields: {
        raw: {
          type: "keyword"
        }
      }
    },
    name: {
      type: "text",
      fields: {
        raw: {
          type: "keyword"
        }
      }
    },
    organization: {
      type: "text",
      fields: {
        raw: {
          type: "keyword"
        }
      }
    }
  }
};
