export default {
  type: "nested",
  properties: {
    strain: {
      type: "text",
      fields: {
        raw: {
          type: "keyword"
        }
      }
    },
    sex: {
      type: "text",
      fields: {
        raw: {
          type: "keyword"
        }
      }
    },
    species: {
      type: "text",
      fields: {
        raw: {
          type: "keyword"
        }
      }
    }
  }
};
