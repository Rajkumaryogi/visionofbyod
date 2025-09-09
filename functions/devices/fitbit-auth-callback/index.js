const { getDatabase } = require('/opt/mongodb-utils/mongodb-client');
const axios = require('axios');

exports.handler = async (event) => {
  try {
    const patientId = event.requestContext.authorizer.claims['custom:patient_id'];
    const { code } = JSON.parse(event.body);
    
    // Exchange code for tokens
    const tokenResponse = await axios.post('https://api.fitbit.com/oauth2/token', 
      `client_id=${process.env.FITBIT_CLIENT_ID}&code=${code}&grant_type=authorization_code`,
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': 'Basic ' + Buffer.from(`${process.env.FITBIT_CLIENT_ID}:${process.env.FITBIT_CLIENT_SECRET}`).toString('base64')
        }
      }
    );
    
    const { access_token, refresh_token, user_id } = tokenResponse.data;
    
    // Store device connection in database
    const db = await getDatabase();
    await db.collection('devices').insertOne({
      patient_id: patientId,
      type: 'fitbit',
      fitbit_user_id: user_id,
      access_token,
      refresh_token,
      connected_at: new Date(),
      last_sync: new Date()
    });
    
    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Fitbit connected successfully' })
    };
  } catch (error) {
    console.error('Error connecting Fitbit:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Failed to connect Fitbit', error: error.message })
    };
  }
};