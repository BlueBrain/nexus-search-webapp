import { resources } from "../../scripts/neuron-pipe/consts";

const fakeEvent = {
  "_createdAt": Date.now(),
  "status": "pending",
  "resources": [
    {
      "resourceType": resources["mr"],
      "@id": "https://bbp-nexus.epfl.ch/staging/v0/data/thalamusproject/simulation/morphologyrelease/v0.1.2/1cb0b760-2935-4aa8-971a-cdac17d9c4a5",
      "searchID": "mr:1cb0b760-2935-4aa8-971a-cdac17d9c4a5"
    }
  ]
}

export default {
  create: async function create () {

  },

  list: async function list () {
    return [
      fakeEvent,
      fakeEvent,
      fakeEvent,
    ]
  }
}