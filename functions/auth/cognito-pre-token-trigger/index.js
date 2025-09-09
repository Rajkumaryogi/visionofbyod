const { getDatabase } = require('/opt/mongodb-utils/mongodb-client');

exports.handler = async (event) => {
  try {
    const db = await getDatabase();
    
    // Add patient_id to JWT claims
    const patient = await db.collection('patients').findOne({
      cognito_id: event.request.userAttributes.sub
    });
    
    if (patient) {
      event.response = {
        claimsOverrideDetails: {
          claimsToAddOrOverride: {
            'custom:patient_id': patient._id.toString()
          }
        }
      };
    }
    
    return event;
  } catch (error) {
    console.error('Error in pre-token trigger:', error);
    return event;
  }
};