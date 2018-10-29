import syncEvents from "../../models/sync-events";
import { to } from "../async";

async function requestSomething(req, res, something) {
  console.log("hello friends");
  let [error, docs] = await to(something(req.body))
  if (error) {
    console.log(error);
    if (error.name === "UnauthorizedError") {
      return res.status(401).send();
    }
    return res.status(500).send();
  }
  console.log(docs);
  return res.json(docs);
}

export default function generateRoutes(router) {
  // list sync-events
  router.get('/events', async (req, res) => await requestSomething(req, res, syncEvents.list));

  // list sync-events
  router.post('/events', async (req, res) => await requestSomething(req, res, syncEvents.create));

  return router;
}
