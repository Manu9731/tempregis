// © Copyright 2024 ISTAFFVISION CONSULTING LLP or one of its affiliates.
// This Source is ISTAFFVISION CONSULTING LLP's Copyright and no violation of Copyright is allowed

// iStaffVision Consulting LLP - Paavana UI Application Registration 2024
// File Name : application_registry.js
// Author: Manu.MG
// Date  : 12/27/2024
// Version : 1.1.0
// Code Description: This Code will take values from the ui. It will validate and insert into the config.json as well as the database .


import express from 'express';
import { fileURLToPath } from 'url';
import path from "path";
import fs from 'fs';
import bodyParser from 'body-parser';
import cors from "cors";
import { createConnection, createConnectionPg, createConnectionMongoose} from "../dbconnection/dbcon.js"
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';
import { Encrypter } from '../src/utils/cryptoUtil.js';
import sendEmail from '../src/utils/emailAlert.js';
import createPdfDocument from '../src/utils/createPdf.js';
import { updateContents, checkFileExists } from '../src/utils/fileHandle.js';

const swaggerDocument = YAML.load('./swagger.yaml');
// import { stringify } from 'querystring';

const app = express();
app.use(bodyParser.urlencoded({
  extended: true}));
app.use(cors());
app.use(express.json())
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
const port = 3110;
const __filename = fileURLToPath(import.meta.url);
const directoryPath = path.dirname(__filename);

app.use(express.static(path.join(directoryPath,"dist")));

app.get('/app', (req, res) => {
  res.sendFile(path.join(directoryPath, "dist", 'index.html'));
});

app.post('/submit', async(req, res) => {
    // console.log(req.body);
    
    // console.log(req.body.appname);
  const { appname, env, baseurl, basepath, decryptionkey, jiraIntegration, jirahost, jiraemail, jiraapi, emailnotify, emailfrom, emailpassword, mailservice, emailto, dbconnection, dbtype, dbhost, dbuser, dbpassword, dbport, appversion} = req.body;
  const appenv = appname.split(" ")[0]

  if (!fs.existsSync(basepath)) {
    return res.status(400).send('Base path does not exist' );
  }
  
  const predefinedStructure = {
    "//comment": {
      "© Copyright 2024 ISTAFFVISION CONSULTING LLP or one of its affiliates.": "",
      "This Source is ISTAFFVISION CONSULTING LLP's Copyright and no violation of Copyright is allowed": "",
      "iStaffVision Consulting LLP - Paavana UI Test Automation Framework 2024": "",
      "//File Name": "config.json",
      "//Author": "Manu M G",
      "//Date": "05/26/2024",
      "//Version": "1.00",
      "//Code Description": "exchanging the data and store the data into the file. "
    },
  };
  
  const shortAppName = appname.split(" ")[0]
  const id = "_001"
  predefinedStructure[appenv + env]={
    "appId" : shortAppName + id,
    "baseUrl" : baseurl,
    "appName" : appname,
    "basePath" : basepath,
    "env" : env,
    "decryptionKey" : decryptionkey,
    "Jira_Connection" : jiraIntegration,
    "JiraConnection" : jiraIntegration ==="Yes" 
      ?{
        "host": jirahost,
        "user": jiraemail,
        "apikey": jiraapi,
      }:{
        "host": "",
        "user": "",
        "apikey": "",
      },
      "Email_Connection" : emailnotify,
      "EmailConnection" : emailnotify === "Yes"
      ?{
        "emailFrom": emailfrom,
        "password":  new Encrypter(decryptionkey).encrypt(emailpassword),
        "service":mailservice,
        "emailTo":emailto
      }:{
        "emailFrom": "",
        "password": "",
        "service": "",
        "emailTo": ""
      },
    "DB_Connection":dbconnection,
  }

  // predefinedStructure[appenv + env]["DBTYPE"] = dbtype


  if(dbconnection==="No"){
    predefinedStructure[appenv + env]["DataBaseConnection"]={
      "host": "",
      "user": "",
      "password": "",
      "port": Number(3306)
    }
  }else if(dbtype === "MONGODB"){
    predefinedStructure[appenv + env][`${dbtype}DataBaseConnection`] = {
      "host": dbhost,
      "user": dbuser,
      "password":  "",
      "port": Number(dbport)
    }
  }else{
    predefinedStructure[appenv + env][`${dbtype}DataBaseConnection`] = {
      "host": dbhost,
      "user": dbuser,
      "password": dbpassword,
      "port": Number(dbport)
    }
  }

  predefinedStructure[appenv + env]["appversion"] = appversion
  // dbtype = ""

  const dataToWrite = {
    ...predefinedStructure,
  };

  const jsonString = JSON.stringify(dataToWrite, null, 2);
  const paths = path.join(basepath, "config.json");
  // console.log(paths);
  async function insertion(message, status){
    setTimeout(async() => {
      const ifFileExists = await checkFileExists(paths)
      if (ifFileExists) return await updateContents(paths, jsonString, res, status, message)
      
      fs.writeFile(paths, jsonString + "\n", (err) => {
        if (err) {
          return res.status(500).send('Error appending to file');
        }
        return res.status(status).send(message);
      });
    }, 1000); // Adding a delay of 1 second
  }

  async function insertionAndEmailAlert(message, status){
    if(emailnotify === "Yes"){
      const filename = "config.json";
      const completePath = path.join(basepath, filename)
      // await sendEmail(emailfrom, emailpassword, emailto, res);
      insertion(message, status);
      await createPdfDocument({basePath:basepath, jsonString:jsonString});
      // await sendEmail(emailfrom, emailpassword, emailto, res, {attachments: [{filename, path: completePath}, {filename : "config.pdf", path : path.join(basepath, "config.pdf")}]});
      await sendEmail(shortAppName + id, appname, env, emailfrom, emailpassword, emailto, res, {attachments: [{filename : "config.pdf", path : path.join(basepath, "config.pdf")}]});
    }else{
      insertion(message, status);
    }
  }

  if(dbconnection==="No"){
    await insertionAndEmailAlert("Form successfully inserted into config.json", 201)
  }

  //Db connection

  //Mysql

  if (dbconnection === "Yes" && dbtype === "MYSQL") {
    const connection = await createConnection(dbhost, dbuser, dbpassword, dbport, res);
  
    const colums = [shortAppName + id, appenv + env, baseurl, appname, basepath, env, decryptionkey, jiraIntegration, jirahost, jiraemail, jiraapi, emailnotify, emailfrom, emailpassword, mailservice, emailto, dbconnection, dbtype, dbhost, dbuser, dbpassword, dbport, appversion]
    // Insert data into the database
    const sql = 'INSERT INTO PAAVANA_CONFIG_MASTER_TABLE (ISV_APP_ID, ISV_CONFIG_MASTER_APP_ENV, ISV_CONFIG_MASTER_BASEURL, ISV_CONFIG_MASTER_APPNAME, ISV_CONFIG_MASTER_BASEPATH, ISV_CONFIG_MASTER_ENV, ISV_CONFIG_MASTER_DECRYPTIONKEY, ISV_JIRA_CONNECTION, ISV_JIRA_HOST, ISV_JIRA_EMAIL, ISV_JIRA_PASSWORD_APIKEY, ISV_EMAIL_NOTIFICATION_CONNECTION, ISV_FROM_EMAIL, ISV_EMAIL_NOTIFICATION_PASSWORD, ISV_SERVICE, ISV_TO_EMAIL , ISV_DB_CONNECTION, ISV_CONFIG_MASTER_DB_TYPE,ISV_CONFIG_MASTER_DB_HOST, ISV_CONFIG_MASTER_DB_USER, ISV_CONFIG_MASTER_DB_PASSWORD, ISV_CONFIG_MASTER_DB_PORT, ISV_APP_VERSION) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
    try{
      await connection.query(sql, colums)
      insertionAndEmailAlert(`Form successfully inserted into config.json and MYSQL database`, 201)
      console.log('Registration data inserted successfully');
    }catch(error){
      console.error('Error inserting data:', error);
      return res.status(500).send('Error inserting data');
    }finally{
      connection.end();
    }
  }


  //Postgres

  if (dbconnection === "Yes" && dbtype === "POSTGRES") {
    const connection = await createConnectionPg(dbhost, dbuser, dbpassword, dbport);

    connection.connect((err) => {
      if (err) {
          console.error('Error connecting to database:', err);
          return res.status(400).send('Error connecting to POSTGRESS database');
      }
      console.log('Connected to POSTGRES database');
    });
  

    const colums = [shortAppName + id, appenv + env, baseurl, appname, basepath, env, decryptionkey, jiraIntegration, jirahost, jiraemail, jiraapi, emailnotify, emailfrom, emailpassword, mailservice, emailto, dbconnection, dbtype, dbhost, dbuser, dbpassword, dbport, appversion]
    // Insert data into the database
    const sql = 'INSERT INTO PAAVANA_CONFIG_MASTER_TABLE(ISV_APP_ID, ISV_CONFIG_MASTER_APP_ENV, ISV_CONFIG_MASTER_BASEURL, ISV_CONFIG_MASTER_APPNAME, ISV_CONFIG_MASTER_BASEPATH, ISV_CONFIG_MASTER_ENV, ISV_CONFIG_MASTER_DECRYPTIONKEY, ISV_JIRA_CONNECTION, ISV_JIRA_HOST, ISV_JIRA_EMAIL, ISV_JIRA_PASSWORD_APIKEY, ISV_EMAIL_NOTIFICATION_CONNECTION, ISV_FROM_EMAIL, ISV_EMAIL_NOTIFICATION_PASSWORD, ISV_SERVICE, ISV_TO_EMAIL , ISV_DB_CONNECTION, ISV_CONFIG_MASTER_DB_TYPE,ISV_CONFIG_MASTER_DB_HOST, ISV_CONFIG_MASTER_DB_USER, ISV_CONFIG_MASTER_DB_PASSWORD, ISV_CONFIG_MASTER_DB_PORT, ISV_APP_VERSION) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23)';
    connection.query(sql, [...colums], (err, result) => {
        if (err) {
            console.error('Error inserting data:', err);
            return res.status(500).send('Error inserting data');
        }
        insertionAndEmailAlert(`Form successfully inserted into config.json and POSTGRESS database`, 201)
        console.log('Registration data inserted successfully');
        connection.end();
    });
  }


  //mongodb
  
  if (dbconnection === "Yes" && dbtype === "MONGODB") {
    const document = {
      ISV_APP_ID : shortAppName+id,
      ISV_CONFIG_MASTER_APP_ENV: appenv+env,
      ISV_CONFIG_MASTER_APPNAME: appname,
      ISV_CONFIG_MASTER_ENV: env,
      ISV_CONFIG_MASTER_BASEURL: baseurl,
      ISV_CONFIG_MASTER_BASEPATH: basepath,
      ISV_CONFIG_MASTER_DECRYPTIONKEY: decryptionkey,
      ISV_JIRA_CONNECTION: jiraIntegration,
      ISV_JIRA_HOST: jirahost,
      ISV_JIRA_EMAIL:  jiraemail ,
      ISV_JIRA_PASSWORD_APIKEY: jiraapi,
      ISV_EMAIL_NOTIFICATION_CONNECTION: emailnotify,
      ISV_FROM_EMAIL: emailfrom,
      ISV_EMAIL_NOTIFICATION_PASSWORD: emailpassword,
      ISV_SERVICE : mailservice,
      ISV_TO_EMAIL: emailto,
      ISV_CONFIG_MASTER_DB_HOST: dbhost,
      ISV_DB_CONNECTION: dbconnection,
      ISV_CONFIG_MASTER_DB_TYPE: dbtype,
      ISV_CONFIG_MASTER_DB_URI: `${dbuser}://${dbhost}:${dbport}`,
      ISV_APP_VERSION: appversion,
      ISV_TIME: new Date().toLocaleString(),

    };
    // const uri = 
    await createConnectionMongoose(`${dbuser}://${dbhost}:${dbport}/`, document, res, insertionAndEmailAlert, `Form successfully inserted into config.json and MONGODB database`, 201)
    // createConnectionMongoose1(`${dbuser}://${dbhost}:${dbport}/`, document, res)
  }

});



app.listen(port, () => {
    console.log(`Example app listening on port http://localhost:${port}`);
});
