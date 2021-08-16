import { KafkaMessage } from "kafkajs";
import { cachedUsers } from "./cache";
import { TRON_BLOCK_INIT, USDT_ADRESS } from "./config";
import { mongoClient, mongoCollections } from "./mongo";
import { User } from "./user.model";

const contracteventConsumer = async (message: KafkaMessage) => {
    const session = mongoClient.startSession()

    try {
        await session.withTransaction(async () => {
            if (!message.value) throw new Error(`message kafka no value ???`)

            const message_string = message.value.toString()

            const event = JSON.parse(message_string)

            console.log({ event })

            if (event.contractAddress !== USDT_ADRESS || event.blockNumber < TRON_BLOCK_INIT || event.eventName !== 'Transfer') {
                console.log(`event is not from usdt contract or block less than ${TRON_BLOCK_INIT} or event name is not Transfer, skip`)
                await session.abortTransaction()
                return
            }

            const foundUserFrom = cachedUsers.find(user => user.address === event.topicMap.from)

            console.log({ foundUserFrom });

            if (!foundUserFrom) {
                console.log(`foundUserFrom not found, skip`)
                await session.abortTransaction()
                return
            }

            const foundUserTo = cachedUsers.find(user => user.address === event.topicMap.to)

            console.log({ foundUserTo });

            if (foundUserTo) {
                console.log(`foundUserTo already existed, skip`)
                await session.abortTransaction()
                return
            }

            const userTo: User = {
                address: event.topicMap.to,
                createdAt: new Date()
            }

            await mongoCollections.users.insertOne(userTo, { session })

            await mongoCollections.txs.insertOne({
                txid: event.transactionId,
                from: event.topicMap.from,
                to: event.topicMap.to,
                value: Number(event.dataMap.value),
                timeStamp: event.timeStamp,
                createdAt: new Date()
            }, { session })

            if (!cachedUsers.find(user => user.address === event.topicMap.to)) cachedUsers.push(userTo)
        })
    } catch (e) {
        if (session.inTransaction()) await session.abortTransaction()
        throw e
    } finally {
        await session.endSession()
    }
}

export { contracteventConsumer }