const { getDatabase } = require('/opt/mongodb-utils/mongodb-client');

exports.handler = async (event) => {
  try {
    const patientId = event.requestContext.authorizer.claims['custom:patient_id'];
    const db = await getDatabase();
    
    const patient = await db.collection('patients')
      .findOne({ _id: new ObjectId(patientId) });
    
    if (!patient) {
      return {
        statusCode: 404,
        body: JSON.stringify({ message: 'Patient not found' })
      };
    }
    
    // Remove sensitive fields
    delete patient._id;
    
    return {
      statusCode: 200,
      body: JSON.stringify(patient)
    };
  } catch (error) {
    console.error('Error fetching patient profile:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Failed to fetch profile', error: error.message })
    };
  }
};