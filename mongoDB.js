const { MongoClient } = require('mongodb');

// Connection string obtained from MongoDB Atlas
const uri = "mongodb+srv://dev:zbNK0g4Zhw7wvrwq@planhub.9pkfsc2.mongodb.net/?retryWrites=true&w=majority";

// Create a new MongoClient
async function connectToDatabase() {
  const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

  try {
    // Connect to the MongoDB cluster
    await client.connect();
    console.log("Connected to MongoDB Atlas");

    // Return the client so it can be used to access collections
    return client;

  } catch (err) {
    console.error("Error connecting to MongoDB Atlas:", err);
    throw err; // Rethrow the error for handling at a higher level if needed
  }
}

async function accessCollection(client, collectionName) {
  try {
    // Access the specified database and collection
    const database = client.db('planhub_app');
    const collection = database.collection(collectionName);

    // Perform database operations on the collection
    // Example: Retrieve documents from the collection
    const documents = await collection.find({}).toArray();
    console.log(`Documents from ${collectionName}:`, documents);

  } catch (err) {
    console.error(`Error accessing ${collectionName}:`, err);
    throw err; // Rethrow the error for handling at a higher level if needed
  }
}

// Call the main function to initiate the database connection and collection access
async function main() {
  const client = await connectToDatabase();

  const collectionName = 'users';
  await accessCollection(client, collectionName);

  // Close the database connection when done
  await client.close();
}

module.exports = {
  connectToDatabase,
  accessCollection,
  uri
}