import { MongoClient, ObjectId, ServerApiVersion } from "mongodb";
const uri =
  "mongodb+srv://megalodon4k:geslo-database-mongo@cluster0.bnld4xm.mongodb.net/?retryWrites=true&w=majority";

const client = new MongoClient(uri);
await client.connect();
const db = client.db("social");
export default db;
