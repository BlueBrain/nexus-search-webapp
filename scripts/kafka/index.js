import { Consumer, KafkaClient, ConsumerGroupStream } from "kafka-node";
import { Transform } from "stream";

const KAFKA_HOST = "kafka-0.kafka.bbp-nexus-staging.svc.cluster.local:9092";
const GROUP = 'SearchTestGroup';
const ID = "SearchTestIngestor2";
const TOPIC = "v0-events";

const ZOOKEEPER_HOST = "zookeeper-0.zookeeper.bbp-nexus-staging.svc:2181";

// const consumerOptions = {
//   // kafkaHost: HOST,
//   host: ZOOKEEPER_HOST,
//   groupId: GROUP,
//   sessionTimeout: 15000,
//   protocol: ['roundrobin'],
//   asyncPush: false,
//   autoCommit: false,
//   id: ID,
//   fromOffset: 'earliest'
// };

// const consumerGroup = new ConsumerGroupStream(consumerOptions, TOPIC);

// const messageTransform = new Transform({
//   objectMode: true,
//   decodeStrings: true,
//   transform (message, encoding, callback) {
//     console.log(message);
//     if (message.key.indexOf("thalamusproject") >= 0) {
//       console.log(`Received message ${message.key} ${message.offset}`);
//     }
//   }
// });

// consumerGroup.pipe(messageTransform);

const FILTER_KEY = "thalamusproject/simulation/morphologyrelease/v0.1.2/";
const FILTER_TYPE = "InstanceCreated";

const client = new KafkaClient({
  kafkaHost: KAFKA_HOST
});
console.log("client created");
let consumer = new Consumer(
  client,
  [
    {
      topic: 'v0-events',
      partition: 0,
      offset: 0,
    }
  ],
  {
    groupId: 'search-consumer-5',
    autoCommit: false,
    fromOffset: true,
    fetchMaxBytes: 5 * 1024 * 1024,
  }
);

try {
  console.log("consumer created");
  console.log("key to seek", FILTER_KEY)
  consumer.on('message', function (message) {
    let { value, key, offset } = message;
    let valueObj = JSON.parse(value);
    console.log(offset)
    if (key.indexOf("thalamusproject") >= 0) {
      console.log(message)
    }
    // let { type } = valueObj;
    // if (type.indexOf(FILTER_TYPE) >= 0) {
    //   console.log("bleep", key);
    // }
  })
  consumer.on('error', function (err) {
    console.log("ERORR", err);
    throw err;
  })
  consumer.on('offsetOutOfRange', function (err) {
    console.log("offsetOutofRange");
    throw err;
  })
} catch (error) {
  console.log(error);
}

process.stdin.resume();//so the program will not close instantly

function exitHandler(options, exitCode) {
  if (options.cleanup) {
    consumer.close(() => {
      console.log("consumer closed");
    });
    console.log('clean');
  }
  if (exitCode || exitCode === 0) console.log(exitCode);
  if (options.exit) {
    consumer.close(() => {
      console.log("consumer closed");
      process.exit();
    });
  }
}

//do something when app is closing
process.on('exit', exitHandler.bind(null, { cleanup: true }));

//catches ctrl+c event
process.on('SIGINT', exitHandler.bind(null, { exit: true }));

// catches "kill pid" (for example: nodemon restart)
process.on('SIGUSR1', exitHandler.bind(null, { exit: true }));
process.on('SIGUSR2', exitHandler.bind(null, { exit: true }));

//catches uncaught exceptions
process.on('uncaughtException', exitHandler.bind(null, { exit: true }));