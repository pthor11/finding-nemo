import { Collection, MongoClient } from "mongodb";
import { MONGO_URI } from "./config";
import { TxIndexes } from "./tx.model";
import { UserIndexes } from "./user.model";

const mongoClient = new MongoClient(MONGO_URI, {
    ignoreUndefined: true
})

const mongoCollections: {
    users: Collection,
    txs: Collection
} = Object.create(null)

const connectMongo = async () => {
    try {
        await mongoClient.connect()

        mongoClient.on('error', async (e) => {
            try {
                await mongoClient.close()
                await connectMongo()
            } catch (e) {
                setTimeout(connectMongo, 1000)
                throw e
            }
        })

        mongoClient.on('timeout', async () => {
            try {
                await mongoClient.close()
                await connectMongo()
            } catch (e) {
                setTimeout(connectMongo, 1000)
                throw e
            }
        })

        mongoClient.on('close', async () => {
            try {
                await connectMongo()
            } catch (e) {
                throw e
            }
        })

        mongoCollections.users = mongoClient.db().collection('users')
        mongoCollections.txs = mongoClient.db().collection('txs')

        // indexing ....

        await Promise.all([
            mongoCollections.users.createIndexes(UserIndexes),
            mongoCollections.txs.createIndexes(TxIndexes),
        ])

        console.log(`🚀 mongodb: connected, dbName ${mongoClient.db().databaseName}`)
        
    } catch (e) {
        console.error(`mongodb: disconnected`)
        await mongoClient?.close(true)
        setTimeout(connectMongo, 1000)
        throw e
    }
}

export {
    mongoClient,
    connectMongo,
    mongoCollections
}