const { getDatabase } = require('/opt/mongodb-utils/mongodb-client');

exports.handler = async (event) => {
  try {
    const patientId = event.requestContext.authorizer.claims['custom:patient_id'];
    const db = await getDatabase();
    
    const devices = await db.collection('devices')
      .find({ patient_id: patientId })
      .toArray();
    
    return {
      statusCode: 200,
      body: JSON.stringify(devices)
    };
  } catch (error) {
    console.error('Error listing devices:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Failed to list devices', error: error.message })
    };
  }
};