const { MongoClient } = require('mongodb');

const uri = "mongodb+srv://margix_admin:35oIyiYjVwWSO0lC@cluster0.4qimgil.mongodb.net/?appName=Cluster0";

async function run() {
  try {
    console.log("Connecting to MongoDB...");
    const client = new MongoClient(uri);
    await client.connect();
    console.log("Connected successfully!");
    await client.close();
  } catch (error) {
    console.error("Connection failed:", error);
  }
}

run();
