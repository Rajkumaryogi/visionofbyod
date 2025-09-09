# FHIR Data Mapping

This document outlines how raw data from external APIs is mapped to FHIR Observation resources.

---

## Source: Fitbit API

### 1. Daily Steps Count

**Description:** The total number of steps taken by a user on a given day.

**Raw Fitbit API Data (Example):**
```json
{
  "activities-steps": [
    {
      "dateTime": "2025-09-04",
      "value": "10542"
    }
  ]
}

FHIR Observation Resource (Target):

{
  "resourceType": "Observation",
  "status": "final",
  "category": [
    {
      "coding": [
        {
          "system": "[http://terminology.hl7.org/CodeSystem/observation-category](http://terminology.hl7.org/CodeSystem/observation-category)",
          "code": "activity",
          "display": "Activity"
        }
      ]
    }
  ],
  "code": {
    "coding": [
      {
        "system": "[http://loinc.org](http://loinc.org)",
        "code": "55423-8",
        "display": "Number of steps in 24 hour Measured"
      }
    ]
  },
  "subject": {
    "reference": "Patient/{patient_id}"
  },
  "effectiveDateTime": "2025-09-04T00:00:00Z",
  "valueQuantity": {
    "value": 10542,
    "unit": "steps",
    "system": "[http://unitsofmeasure.org](http://unitsofmeasure.org)",
    "code": "{steps}"
  }
}

Field Mapping:

activities-steps[0].dateTime -> effectiveDateTime

activities-steps[0].value -> valueQuantity.value

Of course. Here is the complete folder structure and the content for each file from scratch.

## Project Setup: Folder and File Creation 📂
First, let's create the basic project structure. For now, we'll create a main project folder and a docs subdirectory to hold our documentation.

1. Folder Structure
Your project structure will look like this:

health-data-mvp/
└── docs/
    ├── FHIR_MAPPING.md
    └── MONGODB_SCHEMA.md
2. Create the Structure (Commands)
Open your terminal or command prompt, navigate to where you want to create your project, and run these commands:

Bash

# Create the main project folder
mkdir health-data-mvp

# Navigate into the new folder
cd health-data-mvp

# Create the docs sub-folder
mkdir docs

# Create the two empty markdown files inside docs
touch docs/FHIR_MAPPING.md
touch docs/MONGODB_SCHEMA.md
Now you have the correct folders and empty files.

## File Content 📝
Copy the content below and paste it into the corresponding empty files you just created.

File 1: docs/FHIR_MAPPING.md
Open the file docs/FHIR_MAPPING.md in your code editor and paste the following content into it:

Markdown

# FHIR Data Mapping

This document outlines how raw data from external APIs is mapped to FHIR Observation resources.

---

## Source: Fitbit API

### 1. Daily Steps Count

**Description:** The total number of steps taken by a user on a given day.

**Raw Fitbit API Data (Example):**
```json
{
  "activities-steps": [
    {
      "dateTime": "2025-09-04",
      "value": "10542"
    }
  ]
}
FHIR Observation Resource (Target):

JSON

{
  "resourceType": "Observation",
  "status": "final",
  "category": [
    {
      "coding": [
        {
          "system": "[http://terminology.hl7.org/CodeSystem/observation-category](http://terminology.hl7.org/CodeSystem/observation-category)",
          "code": "activity",
          "display": "Activity"
        }
      ]
    }
  ],
  "code": {
    "coding": [
      {
        "system": "[http://loinc.org](http://loinc.org)",
        "code": "55423-8",
        "display": "Number of steps in 24 hour Measured"
      }
    ]
  },
  "subject": {
    "reference": "Patient/{patient_id}"
  },
  "effectiveDateTime": "2025-09-04T00:00:00Z",
  "valueQuantity": {
    "value": 10542,
    "unit": "steps",
    "system": "[http://unitsofmeasure.org](http://unitsofmeasure.org)",
    "code": "{steps}"
  }
}
Field Mapping:

activities-steps[0].dateTime -> effectiveDateTime

activities-steps[0].value -> valueQuantity.value



2. Resting Heart Rate
Description: A user's resting heart rate for a given day.

Raw Fitbit API Data (Example):

{
    "activities-heart": [
        {
            "dateTime": "2025-09-04",
            "value": {
                "restingHeartRate": 65
            }
        }
    ]
}

FHIR Observation Resource (Target):

{
  "resourceType": "Observation",
  "status": "final",
  "category": [
    {
      "coding": [
        {
          "system": "[http://terminology.hl7.org/CodeSystem/observation-category](http://terminology.hl7.org/CodeSystem/observation-category)",
          "code": "vital-signs",
          "display": "Vital Signs"
        }
      ]
    }
  ],
  "code": {
    "coding": [
      {
        "system": "[http://loinc.org](http://loinc.org)",
        "code": "8867-4",
        "display": "Heart rate"
      }
    ]
  },
  "subject": {
    "reference": "Patient/{patient_id}"
  },
  "effectiveDateTime": "2025-09-04T00:00:00Z",
  "valueQuantity": {
    "value": 65,
    "unit": "beats/minute",
    "system": "[http://unitsofmeasure.org](http://unitsofmeasure.org)",
    "code": "/min"
  }
}

Field Mapping:

activities-heart[0].dateTime -> effectiveDateTime

activities-heart[0].value.restingHeartRate -> valueQuantity.value