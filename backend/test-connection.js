const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://chathura:31401814@cluster0.4t3kxpl.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    await client.connect();
    await client.db("admin").command({ ping: 1 });
    console.log("✅ Successfully connected to MongoDB!");
  } catch (error) {
    console.error("❌ Connection failed:", error);
  } finally {
    await client.close();
  }
}

run();