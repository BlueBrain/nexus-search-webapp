const { Kafka } = require('kafkajs')

// Create the client with the broker list
const kafka = new Kafka({
  clientId: 'search-ingestion',
  brokers: ['localhost:9092']
})

const consumer = kafka.consumer({ groupId: 'search-group' })
let fromBeginning = true;

void (async function main() {
  await consumer.connect()

  // Subscribe can be called several times
  await consumer.subscribe({ topic: 'v0-events', fromBeginning })

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      console.log({
        key: message.key.toString(),
        value: message.value.toString(),
        headers: message.headers,
      })
    },
  })

  await consumer.disconnect()
})();