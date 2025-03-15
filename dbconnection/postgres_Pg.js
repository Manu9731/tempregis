// © Copyright 2024 ISTAFFVISION CONSULTING LLP or one of its affiliates.
// This Source is ISTAFFVISION CONSULTING LLP's Copyright and no violation of Copyright is allowed

// iStaffVision Consulting LLP - Paavana UI Test Automation Framework 2024
// File Name : application_registry.js
// Author: Manu.MG
// Date  : 12/27/2024
// Version : 1.1.0
// Code Description: This Code will take values from the ui. It will validate and insert into the config.json as well as the database .


import pkg from 'pg';
const { Client } = pkg;

async function createConnectionPg(host, user, password, port){
    const client = new Client({
      host: host,
      user: user,
      password: password,
      database: 'PAAVANA_UI_TEST_AUTOMATION_APPLICATION_REGISTRATION_DATABASE',
      port: port
    });
  
    return client;
  }

export default createConnectionPg