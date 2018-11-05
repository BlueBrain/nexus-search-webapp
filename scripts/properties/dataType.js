export default {
  type: "nested",
  properties: {
    morphology: {
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
    },
    mType: {
      type: "text",
      fields: {
        raw: {
          type: "keyword"
        }
      }
    }
  }
};
