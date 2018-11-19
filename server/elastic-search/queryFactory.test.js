import queryFactory from "./queryFactory";

describe("queryFactory()", () => {
  it("returns a function", () => {
    expect(typeof queryFactory()).toBe("function");
  });

  describe("fetchQuery()", () => {
    it("returns a promise", async () => {
      const fakeTypesResults = {
        docs: {
          aggrigations: {
            "@types": {
              buckets: []
            }
          }
        }
      }
      expect.assertions(1);
      const fakeClient = {
        search: () => Promise.resolve(fakeTypesResults)
      };
      const fetchTypes = queryFactory(fakeClient, "my_index");
      const data = await fetchTypes();
      return expect(data).toBe(fakeTypesResults);
    });

    it("calls the es client search function", async () => {
      expect.assertions(1);
      const fakeClient = {
        search: jest.fn()
      };
      const fetchTypes = queryFactory(fakeClient, "my_index");
      await fetchTypes();
      return expect(fakeClient.search.mock.calls.length).toBe(1);
    });

    it("it calls es client search function with params index, type, and doc", async () => {
      const fakeClient = {
        search: jest.fn()
      };
      const fetchTypes = queryFactory(fakeClient, "my_index");
      await fetchTypes();
      expect(fakeClient.search.mock.calls[0][0]).toMatchSnapshot()
    });

    it("it calls the queryBuilder", async () => {
      const fakeClient = {
        search: jest.fn()
      };
      const fakeQueryBuilder = jest.fn();
      const fetchTypes = queryFactory(fakeClient, "my_index", fakeQueryBuilder);
      await fetchTypes();
      expect(fakeQueryBuilder).toBeCalled();
    });

    it("it calls the normalizer", async () => {
      const fakeClient = {
        search: jest.fn()
      };
      const fakeNormalizer = jest.fn();
      const fakeQueryBuilder = jest.fn();
      const fetchTypes = queryFactory(fakeClient, "my_index", fakeQueryBuilder, fakeNormalizer);
      await fetchTypes();
      expect(fakeNormalizer).toBeCalled();
    });

    it("throws an ElasticSearchError if search fails", async () => {
      const fakeClient = {
        search: () => Promise.reject("I exploded")
      };
      const fetchTypes = queryFactory(fakeClient, "my_index");
      expect.assertions(2);
      await expect(fetchTypes()).rejects.toBeInstanceOf(Error);
      await expect(fetchTypes()).rejects.toHaveProperty("name", "ElasticSearchError");
    })

    it("throws an QueryBuilderError if search fails", async () => {
      const fakeClient = {
        search: jest.fn()
      };
      const fakeQueryBuilder = () => Promise.reject(new Error("explode"));
      const fetchTypes = queryFactory(fakeClient, "my_index", fakeQueryBuilder);
      expect.assertions(2);
      await expect(fetchTypes()).rejects.toBeInstanceOf(Error);
      await expect(fetchTypes()).rejects.toHaveProperty("name", "QueryBuilderError");
    })
  });
});
