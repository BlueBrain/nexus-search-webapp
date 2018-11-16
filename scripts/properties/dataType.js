export default {
  type: "nested",
  properties: {
    electrophysiology: {
      type: "text",
      fields: {
        raw: {
          type: "keyword"
        }
      }
    },
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
