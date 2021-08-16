import { EachMessagePayload, Kafka } from "kafkajs";
import { TRON_KAFKA_BROKERS, TRON_KAFKA_GROUP_ID, TRON_KAFKA_TOPIC } from "./config";
import { contracteventConsumer } from "./contractevent.consumer";

const tronKafka = new Kafka({
    brokers: [TRON_KAFKA_BROKERS],
    ssl: false,
    sasl: undefined,
    connectionTimeout: 5000,
    requestTimeout: 60000,
})

const tronKafkaConsumer = tronKafka.consumer({
    groupId: TRON_KAFKA_GROUP_ID,
    allowAutoTopicCreation: true,
})

const connectTronKafkaConsumer = async () => {
    try {
        await tronKafkaConsumer.connect()

        console.log(`tron kafka consumer connected group`, TRON_KAFKA_GROUP_ID)

        const topic = TRON_KAFKA_TOPIC.contractevent
        await tronKafkaConsumer.subscribe({ topic, fromBeginning: true })

        console.log(`topic ${topic} subscribed`);

        await tronKafkaConsumer.run({
            eachMessage: async (payload: EachMessagePayload) => {
                try {
                    const { topic, message } = payload

                    switch (topic) {
                        case TRON_KAFKA_TOPIC.contractevent:
                            await contracteventConsumer(message)
                            break;

                        default: throw new Error(`consumer for topic ${topic} not found`)
                    }
                } catch (e) {
                    throw e
                }
            }
        })
    } catch (e) {
        console.error(`tron kafka consumer disconnected`)
        throw e
    }
}

export {
    tronKafkaConsumer,
    connectTronKafkaConsumer
}