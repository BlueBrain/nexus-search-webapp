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
    person: {
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
