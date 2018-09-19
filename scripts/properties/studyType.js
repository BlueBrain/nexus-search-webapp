export default {
  type: "nested",
  properties: {
    name: {
      type: "text",
      fields: {
        raw: {
          type: "keyword"
        }
      }
    }
  }
};
