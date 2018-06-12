import typesFactory from "./index";
// * necessary to mock custom modules
import * as queryBuilder from "./query-builder"
import * as Errors from "../errors";
const fakeNormalizer = docs => docs

describe("typesFactory()", () => {
  it("returns a function", () => {
    expect(typeof typesFactory()).toBe("function");
  });

  describe("fetchTypes()", () => {
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
      const fetchTypes = typesFactory(fakeClient, "my_index", fakeNormalizer);
      const data = await fetchTypes();
      return expect(data).toBe(fakeTypesResults);
    });

    it("calls the es client search function", async () => {
      const fakeClient = {
        search: jest.fn()
      };
      const fetchTypes = typesFactory(fakeClient, "my_index", fakeNormalizer);
      fetchTypes();
      await expect(fakeClient.search.mock.calls.length).toBe(1);
    });

    it("it calls es client search function with params index, type, and doc", () => {
      const fakeClient = {
        search: jest.fn()
      };
      const fetchTypes = typesFactory(fakeClient, "my_index", fakeNormalizer);
      fetchTypes();
      expect(fakeClient.search.mock.calls[0][0]).toMatchSnapshot()
    });

    it("it calls the types queryBuilder", () => {
      queryBuilder.default = jest.fn();
      const fakeClient = {
        search: jest.fn()
      };
      const fetchTypes = typesFactory(fakeClient, "my_index", fakeNormalizer);
      fetchTypes();
      expect(queryBuilder.default).toBeCalled();
    });

    it("makes an ElasticSearchError if serach fails", async () => {
      const fakeClient = {
        search: () => Promise.reject("I exploded")
      };
      const fetchTypes = typesFactory(fakeClient, "my_index", fakeNormalizer);
      expect.assertions(2);
      await expect(fetchTypes()).rejects.toBeInstanceOf(Error);
      await expect(fetchTypes()).rejects.toHaveProperty("name", "ElasticSearchError");
    })

    it("makes an QueryBuilderError if serach fails", async () => {

    })
  });
});
