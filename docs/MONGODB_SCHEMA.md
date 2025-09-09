#### **File 2: `docs/MONGODB_SCHEMA.md`**

Now, open the file `docs/MONGODB_SCHEMA.md` in your code editor and paste the following content into it:

```markdown
# MongoDB Schema Definition

This document describes the collections, document structures, and indexes for the project database.

---

## `patients` Collection

### Description
Stores one document per patient, containing demographic information, authentication identifiers, and a list of their connected devices.

### Document Structure
```json
{
  "_id": "ObjectId",
  "cognito_id": "String",
  "first_name": "String",
  "last_name": "String",
  "birth_date": "ISODate",
  "created_at": "ISODate",
  "connected_devices": [
    {
      "device_id": "String",
      "type": "String",
      "model": "String",
      "serial_number": "String",
      "auth_token": "String",
      "connected_on": "ISODate"
    }
  ]
}

Critical Indexes
{ cognito_id: 1 }

Reason: Ensures fast user lookups after they authenticate via AWS Cognito. cognito_id is the primary key for identifying users from the application side.

observations Collection
Description
Stores time-series health data, with each document representing a single observation (e.g., a day's step count, a single glucose reading). This will be the largest collection.

Document Structure

{
  "_id": "ObjectId",
  "patient_id": "ObjectId",
  "device_id": "String",
  "type": "String",
  "effective_date_time": "ISODate",
  "value": "Number",
  "unit": "String",
  "fhir_resource": {
    // The complete, original FHIR Observation JSON document
  }
}

Critical Indexes
{ patient_id: 1, effective_date_time: -1 }

Reason: This is a compound index perfect for the main dashboard query: "Get the most recent observations for a specific patient". It finds the patient first (patient_id) and then sorts their data by time (effective_date_time: -1 for newest first) very efficiently.

{ type: 1 }

Reason: To efficiently query for all data of a specific type across all patients (e.g., "show me all blood-glucose readings").

---

### ## Step 2 Complete ✅

You have now successfully created the documentation that defines your data structures. These files will serve as a reference as you begin to write the code. You are ready for the next step: provisioning your cloud infrastructure with Terraform.

MONGODB_SECRET_ARN=arn:aws:secretsmanager:us-east-1:713860847276:secret:app/mongodb/password-UF36ry
FITBIT_CLIENT_ID=your_fitbit_client_id
FITBIT_CLIENT_SECRET=your_fitbit_client_secret
NODE_ENV=production