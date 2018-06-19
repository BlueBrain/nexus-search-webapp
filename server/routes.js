import ElasticSearch from "./elastic-search";
import { to } from "./libs/async";

export default function generateRoutes(app) {
  Object.keys(ElasticSearch).forEach(endpointName => {
    app.get(`/${endpointName}`, async (req, res) => {
      let [error, hits] = await to(ElasticSearch[endpointName](req.query));
      if (error) {
        console.log(error);
        return res.status(500);
      }
      return res.json(hits);
    });
  });
}
