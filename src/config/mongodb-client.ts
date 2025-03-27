import dotenv from 'dotenv';
import { MongoClient, ServerApiVersion } from 'mongodb';
// Load environment variables
dotenv.config();

const PASSWORD_MONGODB = process.env.PASSWORD_MONGODB || "";
const USERNAME_MONGODB = process.env.USERNAME_MONGODB || "";
const uri: string = "mongodb+srv://"+encodeURIComponent(USERNAME_MONGODB)+":"+encodeURIComponent(PASSWORD_MONGODB)+"@cluster0.kddrd.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

const client: MongoClient = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

let isConnected = false;

async function getMongoClient(): Promise<MongoClient> {
  if (!isConnected) {
    await client.connect();
    console.log("Connected to MongoDB!");
    isConnected = true;
  }
  return client;
}

export default getMongoClient;
