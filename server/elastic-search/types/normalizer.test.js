import normalizer from "./normalizer";

const MOCK_ES_RESPONSE = {
  aggregations: {
    "@types": {
      doc_count_error_upper_bound: 0,
      sum_other_doc_count: 0,
      buckets: [
        {
          key: "prov:Entity",
          doc_count: 30
        },
        {
          key: "nsg:ResponseTrace",
          doc_count: 25
        },
        {
          key: "nsg:Trace",
          doc_count: 25
        },
        {
          key: "nsg:Subject",
          doc_count: 3
        },
        {
          key: "nsg:ReconstructedWholeBrainCell",
          doc_count: 2
        },
        {
          key: "prov:Agent",
          doc_count: 1
        },
        {
          key: "schema:Dataset",
          doc_count: 1
        }
      ]
    }
  }
};

describe("normalizer()", () => {
  it("returns a list of buckets", () => {
    expect(Array.isArray(normalizer(MOCK_ES_RESPONSE))).toBe(true);
  });

  it("matches the expected output with colors added", () => {
    expect(normalizer(MOCK_ES_RESPONSE)).toMatchSnapshot();
  });
});
