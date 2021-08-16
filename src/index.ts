import { cachedUsers } from "./cache"
import { USER_ADDRESS } from "./config"
import { connectTronKafkaConsumer } from "./kafka.tron"
import { connectMongo, mongoCollections } from "./mongo"
import { User } from "./user.model"


const start = async () => {
    try {
        await connectMongo()

        const user = await mongoCollections.users.findOne({ address: USER_ADDRESS })

        if (!user) await mongoCollections.users.insertOne({ address: USER_ADDRESS, createdAt: new Date() })

        const users: User[] = await mongoCollections.users.find({}).toArray()

        cachedUsers.push(...users)

        console.log('cachedUsers', cachedUsers.length);

        await connectTronKafkaConsumer()

    } catch (e) {
        throw e
    }
}


start()