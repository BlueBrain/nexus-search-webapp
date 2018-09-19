export default {
  type: "nested",
  properties: {
    atlas: {
      type: "text",
      fields: {
        raw: {
          type: "keyword"
        }
      }
    },
    brainRegion: {
      type: "text",
      fields: {
        raw: {
          type: "keyword"
        }
      }
    },
    layer: {
      type: "text",
      fields: {
        raw: {
          type: "keyword"
        }
      }
    }
  }
};
