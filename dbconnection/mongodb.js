// © Copyright 2024 ISTAFFVISION CONSULTING LLP or one of its affiliates.
// This Source is ISTAFFVISION CONSULTING LLP's Copyright and no violation of Copyright is allowed

// iStaffVision Consulting LLP - Paavana UI Test Automation Framework 2024
// File Name : application_registry.js
// Author: Manu.MG
// Date  : 12/27/2024
// Version : 1.1.0
// Code Description: This Code will take values from the ui. It will validate and insert into the config.json as well as the database .



import { MongoClient } from "mongodb";

async function createConnectionMongoose(uri, doc, res, insertionAndEmailAlert, message, status) {
    const client = new MongoClient(uri);
    try {
      await client.connect();
      const database = client.db('PAAVANA_UI_TEST_AUTOMATION_APPLICATION_REGISTRATION_DATABASE');
      const collection = database.collection('PAAVANA_CONFIG_MASTER_COLLECTION');
      const result = await collection.insertOne(doc);
      console.log(`A document was inserted with the _id: ${result.insertedId}`);
      // res.status(201).send('Data inserted successfully');
      console.log('Registration data inserted successfully');
      insertionAndEmailAlert(message, status)
    } catch (error) {
      console.error('Error inserting data:', error);
      res.status(500).send('Error inserting data');
    } finally {
      await client.close();
    }
  }

  export default createConnectionMongoose