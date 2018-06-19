import facetNormalizer from "./facetNormalizer";
import MOCK_ES_RESPONSE from "./mock-facet-response.json";
const SIMPLE_RESPONSE = {
  strain: {
    doc_count: 3,
    "@ids": {
      doc_count_error_upper_bound: 0,
      sum_other_doc_count: 0,
      buckets: [
        { key: "C57BL/6J", doc_count: 1 },
        { key: "GAD67-eGFPxPValb-CrexR26-LSL-tdTomato", doc_count: 1 },
        { key: "http://purl.obolibrary.org/obo/RS_0001833", doc_count: 1 }
      ]
    },
    labels: {
      doc_count_error_upper_bound: 0,
      sum_other_doc_count: 0,
      buckets: [
        { key: "C57BL/6J", doc_count: 1 },
        { key: "GAD67-eGFPxPValb-CrexR26-LSL-tdTomato", doc_count: 1 },
        { key: "Wistar Han", doc_count: 1 }
      ]
    }
  }
};
const NESTED_RESPONSE = {
  brainLocation: {
    doc_count: 2,
    brainRegion: {
      doc_count: 2,
      "@ids": {
        doc_count_error_upper_bound: 0,
        sum_other_doc_count: 0,
        buckets: [
          {
            key: "http://api.brain-map.org/api/v2/data/Structure/1020",
            doc_count: 1
          },
          {
            key: "http://api.brain-map.org/api/v2/data/Structure/170",
            doc_count: 1
          }
        ]
      },
      labels: {
        doc_count_error_upper_bound: 0,
        sum_other_doc_count: 0,
        buckets: [
          {
            key: "Dorsal part of the lateral geniculate complex",
            doc_count: 1
          },
          { key: "Posterior complex of the thalamus", doc_count: 1 }
        ]
      }
    }
  }
};
describe("facetNormalizer()", () => {
  it("matches the expected output of a simple response example", () => {
    expect(facetNormalizer(SIMPLE_RESPONSE)).toMatchSnapshot();
  });

  it("able to return nested responses", () => {
    expect(facetNormalizer(NESTED_RESPONSE)).toMatchSnapshot();
  });
  it("matches the expected output of a complex example", () => {
    expect(facetNormalizer(MOCK_ES_RESPONSE)).toMatchSnapshot();
  });
});
