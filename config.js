import { MongoClient, ObjectId, ServerApiVersion } from "mongodb";
import "dotenv/config";
const uri = process.env.URI;

const client = new MongoClient(uri);
await client.connect();
const db = client.db("social");
export default db;
