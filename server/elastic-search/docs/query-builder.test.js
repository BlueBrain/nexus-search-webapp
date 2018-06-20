import makeDocQuery from "./query-builder";

describe("makeDocQuery()", () => {

  it(" makes an elasticSearch agg object, and the proper with @types, terms, and field", () => {
    expect(makeDocQuery()).toMatchSnapshot();
  });

  it(" makes an elasticSearch aggs object with a query if a textQuery argument is provided", () => {
    const textQuery = { q: "mySearchString" };
    expect(makeDocQuery(textQuery)).toMatchSnapshot();
  });

  it(" makes an elasticSearch aggs object with a bool must match term if a type argument is provided", () => {
    const textAndTypeQuery = { q: "mySearchString", type: "prove:Entity" };
    expect(makeDocQuery(textAndTypeQuery)).toMatchSnapshot();
  });

  it(" makes an elasticSearch aggs object even with filters provided!", () => {
    const complexQuery = { q: "mySearchString", type: "prove:Entity", filter: JSON.stringify({ 'sex.labels': [ 'male' ] }) };
    expect(makeDocQuery(complexQuery)).toMatchSnapshot();
  });

  it(" makes an elasticSearch aggs object even with nested filters", () => {
    const nestedQuery = { q: "mySearchString", type: "prove:Entity", filter: JSON.stringify({ 'brainLocation.brainRegion.labels': [ 'Posterior complex of the thalamus' ] }) };
    expect(makeDocQuery(nestedQuery)).toMatchSnapshot();
  });
});
