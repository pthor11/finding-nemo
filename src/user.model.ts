import { IndexDescription, IndexSpecification, ObjectId } from "mongodb";

type User = {
    _id?: ObjectId
    address: string
    createdAt: Date
}

const UserIndexes: IndexDescription[] = [
    { key: { address: 1, type: 1 }, unique: true },
    { key: { createdAt: 1, type: 1 } },
]

export {
    User,
    UserIndexes
}