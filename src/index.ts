import { USER_ADDRESS } from "./config"
import { connectTronKafkaConsumer } from "./kafka.tron"
import { connectMongo, mongoClient, mongoCollections } from "./mongo"


const start = async () => {
    try {
        await connectMongo()

        const user = await mongoCollections.users.findOne({ address: USER_ADDRESS })

        if (!user) await mongoCollections.users.insertOne({ address: USER_ADDRESS, createdAt: new Date() })

        await connectTronKafkaConsumer()

    } catch (e) {
        throw e
    }
}


start()