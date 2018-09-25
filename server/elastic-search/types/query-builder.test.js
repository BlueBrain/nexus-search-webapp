import makeTypeQuery from "./query-builder";

describe("makeTypeQuery()", () => {
  it(" makes an object with the property aggs", () => {
    expect(makeTypeQuery().aggs).toBeDefined();
  });


  it(" makes an elasticSearch agg object, and the proper with @types, terms, and field", () => {
    expect(makeTypeQuery()).toMatchSnapshot();
  });

  it(" makes an elasticSearch aggs object with a query if a textQuery argument is provided", () => {
    const textQuery = { q: "mySearchString" };
    expect(makeTypeQuery(textQuery).query).toBeDefined();
    expect(makeTypeQuery(textQuery)).toMatchSnapshot();
  });
});
