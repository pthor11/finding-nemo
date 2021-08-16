import { IndexDescription, IndexSpecification, ObjectId } from "mongodb";

type Tx = {
    _id?: ObjectId
    txid: string
    from: string
    to: string
    value: number
    timeStamp: number
    createdAt: Date
}

const TxIndexes: IndexDescription[] = [
    { key: { txid: 1, type: 1 }, unique: true },
    { key: { from: 1, type: 1 } },
    { key: { to: 1, type: 1 } },
    { key: { timeStamp: 1, type: 1 } },
]

export {
    Tx,
    TxIndexes
}