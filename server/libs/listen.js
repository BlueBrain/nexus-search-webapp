import { Consumer, KafkaClient } from "kafka-node";
import config from "./config";

const {KAFKA_HOST, KAFKA_TOPIC} = config;

function returnRelevantURLDataPath (url) {
  let dataPath = "/data/"
  let indexOfData = url.indexOf(dataPath);
  let resourcePath = url.slice(indexOfData + dataPath.length);
  return resourcePath
}

function processEventIntoInstance (resource, event) {
  let id = resource.url + event.id.split("/").pop();
  return {
    "@id": id,
    "_rev": event.rev,
    "_eventType": event.type,
    "source": {
      "@id": id,
      ...event.value
    }
  }
}

export default class Listen {
  constructor(resource) {
    let { url, name } = resource;
    this.resource = resource;
    this.urlKey = returnRelevantURLDataPath(url);
    this.name = name;
    console.log(`listener created for ${name} (${this.urlKey})`);

    let client = this.client = new KafkaClient({
      kafkaHost: KAFKA_HOST
    });
    let consumer = this.consumer = new Consumer(
      client,
      [
        {
          topic: KAFKA_TOPIC,
          partition: 0,
          fromOffset: -1,
        }
      ],
      {
        groupId: `search-synchronizer-${name.toLowerCase().replace(" ", "-")}-${process.env.NODE_ENV}`,
        autoCommit: true,
        fetchMaxBytes: 5 * 1024 * 1024,
      }
    );

    consumer.on('error', function (err) {
      console.log("LISTENER: CONSUMER ERORR", err);
    })
    consumer.on('offsetOutOfRange', function (err) {
      console.log("LISTENER: offsetOutofRange", err);
    })

    consumer.on('message', message => {
      let { value, key, offset } = message;
      let valueObj = processEventIntoInstance(this.resource, JSON.parse(value));
      if (key.indexOf(this.urlKey) >= 0) {
        this.onUpdate(this.resource, valueObj);
      }
    })
   }

   on (name, callback) {
    switch (name) {
      case "updated":
        this.onUpdate = callback;
      break;
    }
   }

   onUpdate () {
     // empty, to be assigned by user
   }
}