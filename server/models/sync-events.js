import { to, waitForEach } from "@libs/promise";
import { resources } from "../../scripts/neuron-pipe/consts";
import * as resourceProcessors from "./resources";
import Listen from "../libs/listen";
import whichToken from "../libs/whichToken";
import config from "../libs/config";
// TODO use this interface as references when creating sync resources
// const fakeEvent = {
//   "_createdAt": Date.now(),
//   "status": "pending",
//   "resourceTypesToSync": [
//     "mr"
//   ],
//   "resources": [
//     {
//       "resourceType": resources["mr"],
//       "@id": "https://bbp-nexus.epfl.ch/staging/v0/data/thalamusproject/simulation/morphologyrelease/v0.1.2/1cb0b760-2935-4aa8-971a-cdac17d9c4a5",
//       "searchID": "mr:1cb0b760-2935-4aa8-971a-cdac17d9c4a5"
//     }
//   ]
// }
// const fakeFailedEvent = {
//   "_createdAt": Date.now(),
//   "status": "failed",
//   "resourceTypesToSync": [
//     "mr", "pc", "rwbc"
//   ],
//   "resources": [
//   ],
// }
// const fakeFulfilledEvent = {
//   "_createdAt": Date.now(),
//   "status": "fulfilled",
//   "resourceTypesToSync": [
//     "mr", "pc", "rwbc"
//   ],
//   "resources": [
//     {
//       "resourceType": resources["mr"],
//       "@id": "https://bbp-nexus.epfl.ch/staging/v0/data/thalamusproject/simulation/morphologyrelease/v0.1.2/1cb0b760-2935-4aa8-971a-cdac17d9c4a5",
//       "searchID": "mr:1cb0b760-2935-4aa8-971a-cdac17d9c4a5"
//     },
//     {
//       "resourceType": resources["pc"],
//       "@id": "https://bbp-nexus.epfl.ch/staging/v0/data/thalamusproject/simulation/morphologyrelease/v0.1.2/1cb0b760-2935-4aa8-971a-cdac17d9c4a5",
//       "searchID": "mr:1cb0b760-2935-4aa8-971a-cdac17d9c4a5"
//     },
//     {
//       "resourceType": resources["rwbc"],
//       "@id": "https://bbp-nexus.epfl.ch/staging/v0/data/thalamusproject/simulation/morphologyrelease/v0.1.2/1cb0b760-2935-4aa8-971a-cdac17d9c4a5",
//       "searchID": "mr:1cb0b760-2935-4aa8-971a-cdac17d9c4a5"
//     }
//   ]
// }

const mockServiceIndex = {};

export default {
  listen: async function listen() {
    let listener = new Listen(resources["mr"]);
    listener.on("updated", this.createSingleton.bind(this));
  },

  types: async function list() {
    return resources
  },

  // create a new sync event
  create: async function create(docs) {
    let id = Object.keys(mockServiceIndex).length;
    mockServiceIndex[id] = {
      "_createdAt": Date.now(),
      "status": "pending",
      "resourceTypesToSync": docs.map(doc => doc.resourceShort),
      "resources": docs.map(doc => ({
        "resourceType": resources[doc.resourceShort],
        "@id": doc["@id"],
        "searchID": doc["searchID"]
      }))
    }
    return id;
  },

  update: async function update(id, status) {
    mockServiceIndex[id].status = status;
    this.onUpdate(mockServiceIndex[id]);
  },

  // update a single resource emitted from event
  createSingleton: async function createSingleton(resource, value) {
    let pFactory = resourceProcessors[resource.short].processorFactory;
    let resourceURL = config.RESOURCE_URL;
    let shouldUpload = true;
    let token = whichToken(resource.url);
    let processor = pFactory(resource, resourceURL, shouldUpload);
    // CREATE SYNC EVENT HERE
    let id = await this.create([{ resourceShort: resource.short, ...value }]);
    let [error, docs] = await to(waitForEach(Promise.resolve([value]), processor));
    if (docs && !error) {
      // UPDATE SYNC EVENT HERE
      return await this.update(id, "fulfilled")
    }
    // UPDATE SYNC EVENT WITH ERROR
    console.log("ERROR SYNC-EVENT MODEL::CREATE_SINGLETON: ", error);
    await this.update(id, "failed")
  },

  // list all the sync events
  list: async function list() {
    // FETCH SYNC EVENTS FROM NEXUS
    // RETREIVE INDIVIDUALS BY ID
    return Object.values(mockServiceIndex).sort((a,b) =>{
      // Turn your strings into dates, and then subtract them
      // to get a value that is either negative, positive, or zero.
      return new Date(b._createdAt) - new Date(a._createdAt);
    });
  },

  onUpdate: function () {
    // overwriteMe
  }
}