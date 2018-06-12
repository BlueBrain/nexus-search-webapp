import ElasticSearch from "./elastic-search";

export default function generateRoutes(app) {
  Object.keys(ElasticSearch).forEach(endpointName => {
    app.get(`/${endpointName}`, (req, res) => {
      ElasticSearch[endpointName](req.query)
        .then(hits => res.json(hits))
        .catch(error => {
          console.log(error);
          res.status(500);
        });
    });
  });
}
