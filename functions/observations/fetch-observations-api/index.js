const { getDatabase } = require('/opt/mongodb-utils/mongodb-client');

exports.handler = async (event) => {
  try {
    // Get patient_id from Cognito claims (added by pre-token trigger)
    const patientId = event.requestContext.authorizer.claims['custom:patient_id'];
    
    if (!patientId) {
      return {
        statusCode: 401,
        body: JSON.stringify({ message: 'Patient not authenticated' })
      };
    }

    const { type, startDate, endDate, limit = 100 } = event.queryStringParameters || {};
    
    const db = await getDatabase();
    
    // Build query
    const query = { patient_id: patientId };
    
    if (type) {
      query.type = type;
    }
    
    if (startDate || endDate) {
      query.effective_date_time = {};
      if (startDate) query.effective_date_time.$gte = new Date(startDate);
      if (endDate) query.effective_date_time.$lte = new Date(endDate);
    }
    
    // Execute query
    const observations = await db.collection('observations')
      .find(query)
      .sort({ effective_date_time: -1 })
      .limit(parseInt(limit))
      .toArray();
    
    return {
      statusCode: 200,
      headers: { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
        'Access-Control-Allow-Methods': 'GET,OPTIONS'
      },
      body: JSON.stringify(observations)
    };
  } catch (error) {
    console.error('Error fetching observations:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Failed to fetch observations', error: error.message })
    };
  }
};