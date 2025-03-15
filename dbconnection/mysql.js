// © Copyright 2024 ISTAFFVISION CONSULTING LLP or one of its affiliates.
// This Source is ISTAFFVISION CONSULTING LLP's Copyright and no violation of Copyright is allowed

// iStaffVision Consulting LLP - Paavana UI Test Automation Framework 2024
// File Name : application_registry.js
// Author: Manu.MG
// Date  : 12/27/2024
// Version : 1.1.0
// Code Description: This Code will take values from the ui. It will validate and insert into the config.json as well as the database .


import mysql from "mysql2/promise"

async function createConnection(host, user, password, port, res){
    try{
      let connection  = await mysql.createConnection({
        host: host,
        user: user,
        password: password,
        database: 'PAAVANA_UI_TEST_AUTOMATION_APPLICATION_REGISTRATION_DATABASE',
        port: port
      });
      console.log('Connected to MySQL database');
      return connection
    }catch(err){
      console.error('Error connecting to database:', err);
      return res.status(400).send('Error connecting to MYSQL database');
    }
  }

  export default createConnection;