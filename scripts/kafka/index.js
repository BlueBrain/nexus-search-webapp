import { Consumer, KafkaClient } from "kafka-node";

try {
  const client = new KafkaClient({
    kafkaHost: 'kafka-2.kafka.bbp-nexus-staging.svc.cluster.local:9092'
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
        groupId: 'search-consumer-3',
        autoCommit: false
      }
    );
  console.log("consumer created");
  consumer.on('message', function (message) {
    console.log(message);
  })
  consumer.on('error', function (err) {
    throw err;
  })
  consumer.on('offsetOutOfRange', function (err) {
    console.log("offsetOutofRange");
    throw err;
  })
} catch (error) {
  console.log(error);
}