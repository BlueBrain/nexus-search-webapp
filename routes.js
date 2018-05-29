import palettes from 'distinct-colors';
const index = "test_index_3";

function getTypes(client, query) {
  const params = {
    index,
    type: "doc",
    body: {
      aggs: {
        "@types": {
          terms: {
            field: "@type.raw"
          }
        }
      }
    }
  };
  if (query.q) {
    params.body.query = {
      query_string: {
        query: `(${query.q}* OR ${query.q}~)`
      }
    };
  }
  return client.search(params).then(res => {
    return res.aggregations["@types"].buckets;
  });
}

function getDocs(client, query) {
  let params = {};
  if (query.q) {
    params = {
      query: {
        query_string: {
          query: `(${query.q}* OR ${query.q}~)`
        }
        // highlight: {
        //   require_field_match: true,
        //   fields: ["*Name", "description", "email"]
        // }
      }
    };
  }
  if (query.type) {
    params = {
      query: {
        match: {
          "@type.raw": query.type
        }
      }
    };
  }
  if (query.q && query.type) {
    params = {
      query: {
        bool: {
          filter: {
            match: {
              "@type.raw": query.type
            }
          },
          must: {
              query_string: {
                query: `(${query.q}* OR ${query.q}~)`
              }
          }
        }
      }
    };
  }
  return client
    .search({
      index,
      type: "doc",
      body: params
    })
    .then(resp => {
      return resp.hits;
    });
}

export default function routes(app, elasticSearch) {
  app.get("/types", (req, res) => {
    getTypes(elasticSearch, req.query)
      .then(types => {
        let palette = palettes({count: types.length, chromaMax: 80, lightMin: 70})
        return types.map((type, index) => {

          type.color = palette[index].hex()
          console.log(type);
          return type;
        })
      })
      .then(data => res.status(200).json(data))
      .catch(error => {
        console.log(error);
        res.status(500);
      });
  });

  app.get("/search", (req, res) => {
    getDocs(elasticSearch, req.query)
      .then(hits => res.json(hits))
      .catch(error => {
        console.log(error);
        res.status(500)
      });
  });
}
