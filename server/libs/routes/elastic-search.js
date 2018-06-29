import ElasticSearch from "../../elastic-search";
import { to } from "../async";

export default function generateRoutes(router) {
  Object.keys(ElasticSearch).forEach(endpointName => {
    router.get(`/${endpointName}`, async (req, res) => {
      let [error, hits] = await to(ElasticSearch[endpointName](req.query));
      if (error) {
        console.log(error);
        return res.status(500).send();
      }
      return res.json(hits);
    });
  });
  return router;
}
