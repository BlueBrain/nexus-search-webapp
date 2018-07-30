export default {
  type: "nested",
  properties: {
    label: {
      type: "text",
      fields: {
        raw: {
          type: "keyword"
        }
      }
    }
  }
};
