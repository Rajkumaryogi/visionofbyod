const { getDatabase } = require('/opt/mongodb-utils/mongodb-client');

exports.handler = async (event) => {
  try {
    const db = await getDatabase();
    
    // Create patient profile in MongoDB
    const patient = {
      cognito_id: event.request.userAttributes.sub,
      email: event.request.userAttributes.email,
      first_name: event.request.userAttributes.given_name || '',
      last_name: event.request.userAttributes.family_name || '',
      birth_date: event.request.userAttributes.birthdate || '',
      created_at: new Date(),
      updated_at: new Date()
    };
    
    await db.collection('patients').insertOne(patient);
    
    return event;
  } catch (error) {
    console.error('Error creating patient profile:', error);
    return event;
  }
};