const { getDatabase, ObjectId } = require('/opt/mongodb-utils/mongodb-client');

exports.handler = async (event) => {
  try {
    const db = await getDatabase();
    const payload = JSON.parse(event.body);
    
    // Validate required fields
    if (!payload.patient_id || !payload.fhir_resource) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: 'Missing required fields: patient_id or fhir_resource' })
      };
    }
    
    // Prepare document for insertion
    const observationDoc = {
      patient_id: new ObjectId(payload.patient_id),
      device_id: payload.device_id || 'unknown',
      type: payload.fhir_resource.code?.coding?.[0]?.display || 'unknown',
      effective_date_time: new Date(payload.fhir_resource.effectiveDateTime),
      value: payload.fhir_resource.valueQuantity?.value,
      unit: payload.fhir_resource.valueQuantity?.unit,
      fhir_resource: payload.fhir_resource,
      ingested_at: new Date()
    };
    
    // Insert into database
    const result = await db.collection('observations').insertOne(observationDoc);
    
    return {
      statusCode: 201,
      headers: { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
        'Access-Control-Allow-Methods': 'POST,OPTIONS'
      },
      body: JSON.stringify({ 
        message: 'Observation created successfully',
        id: result.insertedId 
      })
    };
  } catch (error) {
    console.error('Error ingesting observation:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ 
        message: 'Failed to ingest observation',
        error: error.message 
      })
    };
  }
};