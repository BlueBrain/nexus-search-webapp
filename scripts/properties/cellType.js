export default {
  type: "nested",
  properties: {
    mType: {
      type: "text",
      fields: {
        raw: {
          type: "keyword"
        }
      }
    },
    eType: {
      type: "text",
      fields: {
        raw: {
          type: "keyword"
        }
      }
    }
  }
};
