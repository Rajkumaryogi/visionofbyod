require('dotenv').config();
const { getDatabase } = require('./layers/mongodb-utils/nodejs/mongodb-client');

// Set environment variables for local testing
process.env.MONGODB_SECRET_ARN = 'app/mongodb/connection';
process.env.AWS_REGION = 'us-east-1';

async function testConnection() {
  try {
    console.log('Testing MongoDB connection...');
    const db = await getDatabase();
    console.log('Connected successfully!');
    
    // Test a simple query
    const collections = await db.listCollections().toArray();
    console.log('Collections:', collections);
    
    process.exit(0);
  } catch (error) {
    console.error('Connection failed:', error);
    process.exit(1);
  }
}

testConnection();