import ElasticSearch from "../../elastic-search";
import { to } from "../async";

export default function generateRoutes(router) {
  Object.keys(ElasticSearch).forEach(endpointName => {
    // regex is basically match all points such as /docs or /instances
    // as well as matching /docs/UUID and /instances/UUID
    router.get(`/${endpointName}(\/:id)?`, async (req, res) => {
      let [error, hits] = await to(ElasticSearch[endpointName](req.query, req.params, req.headers));
      if (error) {
        console.log(error);
        return res.status(500).send();
      }
      return res.json(hits);
    });
  });
  return router;
}
