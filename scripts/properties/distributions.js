export default {
  type: "nested",
  properties: {
    repository: {
      type: "text",
      fields: {
        raw: {
          type: "keyword"
        }
      }
    },
    source: {
      type: "text",
      fields: {
        raw: {
          type: "keyword"
        }
      }
    }
  }
};
