const KAFKA_HOST = "kafka-2.kafka.bbp-nexus-staging.svc.cluster.local:9092";
const GROUP = 'SearchTestGroup999';
const ID = "SearchTestIngestor9999999";
const TOPIC = "v0-events";

const { Kafka, logLevel } = require('kafkajs')

// Create the client with the broker list

const go = async () => {
  const kafka = new Kafka({
    clientId: ID,
    brokers: [KAFKA_HOST],
    // logLevel: logLevel.DEBUG
  })

  const consumer = kafka.consumer({
    groupId: GROUP,
    minBytes: 100,
    maxWaitTimeInMs: 30000
  })

  await consumer.connect()


  // Subscribe can be called several times

  await consumer.subscribe({ topic: TOPIC, fromBeginning: true })



  // It's possible to start from the beginning:
  // await consumer.subscribe({ topic: 'topic-name', fromBeginning: true })

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      console.log("help me!");
      console.log({
        key: message.key.toString(),
      })
    },
  })

  // consumer.seek({ topic: TOPIC, offset: 0, partition: 0 })


  // before you exit your app
  await consumer.disconnect()

  return "hello";
}

void (async function main() {
  try {
    let string = await go();
    console.log(string);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
})();
