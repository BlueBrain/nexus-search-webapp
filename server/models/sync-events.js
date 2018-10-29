import { resources } from "../../scripts/neuron-pipe/consts";

const fakeEvent = {
  "_createdAt": Date.now(),
  "status": "pending",
  "resourceTypesToSync": [
    "mr"
  ],
  "resources": [
    {
      "resourceType": resources["mr"],
      "@id": "https://bbp-nexus.epfl.ch/staging/v0/data/thalamusproject/simulation/morphologyrelease/v0.1.2/1cb0b760-2935-4aa8-971a-cdac17d9c4a5",
      "searchID": "mr:1cb0b760-2935-4aa8-971a-cdac17d9c4a5"
    }
  ]
}
const fakeFailedEvent = {
  "_createdAt": Date.now(),
  "status": "failed",
  "resourceTypesToSync": [
    "mr", "pc", "rwbc"
  ],
  "resources": [
  ],
}
const fakeFulfilledEvent ={
  "_createdAt": Date.now(),
  "status": "fulfilled",
  "resourceTypesToSync": [
    "mr", "pc", "rwbc"
  ],
  "resources": [
    {
      "resourceType": resources["mr"],
      "@id": "https://bbp-nexus.epfl.ch/staging/v0/data/thalamusproject/simulation/morphologyrelease/v0.1.2/1cb0b760-2935-4aa8-971a-cdac17d9c4a5",
      "searchID": "mr:1cb0b760-2935-4aa8-971a-cdac17d9c4a5"
    },
    {
      "resourceType": resources["pc"],
      "@id": "https://bbp-nexus.epfl.ch/staging/v0/data/thalamusproject/simulation/morphologyrelease/v0.1.2/1cb0b760-2935-4aa8-971a-cdac17d9c4a5",
      "searchID": "mr:1cb0b760-2935-4aa8-971a-cdac17d9c4a5"
    },
    {
      "resourceType": resources["rwbc"],
      "@id": "https://bbp-nexus.epfl.ch/staging/v0/data/thalamusproject/simulation/morphologyrelease/v0.1.2/1cb0b760-2935-4aa8-971a-cdac17d9c4a5",
      "searchID": "mr:1cb0b760-2935-4aa8-971a-cdac17d9c4a5"
    }
  ]
}

export default {
  types: async function list () {
    return resources
  },

  create: async function create () {

  },

  list: async function list () {
    return [
      fakeEvent,
      fakeFulfilledEvent,
      fakeFailedEvent,
      fakeFulfilledEvent,
    ]
  }
}