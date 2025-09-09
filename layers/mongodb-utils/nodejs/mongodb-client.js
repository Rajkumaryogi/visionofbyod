const { MongoClient } = require('mongodb');
const AWS = require('aws-sdk');

let cachedDb = null;

async function getDatabase() {
  if (cachedDb) {
    return cachedDb;
  }

  try {
    // Get MongoDB connection details from Secrets Manager
    const secretsManager = new AWS.SecretsManager();
    const secretValue = await secretsManager.getSecretValue({
      SecretId: process.env.MONGODB_SECRET_ARN
    }).promise();
    
    const secret = JSON.parse(secretValue.SecretString);
    
    // Construct the connection string properly
    const connectionString = `mongodb+srv://${encodeURIComponent(secret.username)}:${encodeURIComponent(secret.password)}@${secret.host}/?retryWrites=true&w=majority`;
    
    console.log('Connecting to MongoDB with connection string:', connectionString.replace(/:([^@]*)@/, ':****@'));
    
    const client = new MongoClient(connectionString, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    await client.connect();
    
    cachedDb = client.db('health_data_db');
    console.log('Successfully connected to MongoDB');
    return cachedDb;
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error);
    throw error;
  }
}

module.exports = { getDatabase };