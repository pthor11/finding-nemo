import { config } from "dotenv";

config()

if (!process.env.MONGO_URI) throw new Error(`MONGO_URI must be provided`)
const MONGO_URI = process.env.MONGO_URI

if (!process.env.TRON_KAFKA_BROKERS) throw new Error(`TRON_KAFKA_BROKERS must be provided`)
const TRON_KAFKA_BROKERS = process.env.TRON_KAFKA_BROKERS

if (!process.env.TRON_KAFKA_GROUP_ID) throw new Error(`TRON_KAFKA_GROUP_ID must be provided`)
const TRON_KAFKA_GROUP_ID = process.env.TRON_KAFKA_GROUP_ID

const TRON_KAFKA_TOPIC = {
    contractevent: 'contractevent'
}

const TRON_BLOCK_INIT = 32868362

const USDT_ADRESS = 'TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t'

const USER_ADDRESS = 'TZ2qNCFgJ2QvvDPEU28gr1NJYPQ9661Sah'

export {
    MONGO_URI,
    TRON_KAFKA_BROKERS,
    TRON_KAFKA_GROUP_ID,
    TRON_KAFKA_TOPIC,
    TRON_BLOCK_INIT,
    USDT_ADRESS,
    USER_ADDRESS
} 