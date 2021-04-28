'use strict';

//to run the server
//1- npm start
//2- node server.js
//3- nodemon


// requiers lib: //Application Depandancies
const express = require('express'); // make the server requier the express framework
require('dotenv').config(); // .env file requier
const cors = require('cors');

//Application Setup
const server = express();
const PORT = process.env.PORT || 5000;
server.use(cors()); //open for any request from any client

// building routes:
// server.get(route , callback function)

server.get('/location', locationHandler);
server.get('/weather', weatherHandler);
// server.get('/park' , parkHandler);
server.get('*', generalHandler);


// routes function handlers:
function locationHandler(request , responce){
  // need the get the location data from locatioIQ API server
  // send a request using superagent library to locationIQ
  // console.log(req.query); //{ city: 'amman' }
  // to connect with any api server you must meet the requirment (key , url)
  // => set up the data requirment to connect with api server
//   /home/saadoun/ASAC/Lab07-API-Server/data/location.json
  let locationData = require('./data/location.json');
  let locationObject = new Location(locationData);
  responce.send(locationObject);
}



function weatherHandler(request , responce){
  // to connect with any api server you must meet the requirment
  let wetherData = require('./data/weather.json');
  let newWeatherObjects = [];
  console.log(wetherData.data);
  wetherData.data.forEach((object) =>{
    let newObject = new Weather(object);
    newWeatherObjects.push(newObject);
  });
  responce.send(newWeatherObjects);
}
function generalHandler (request , responce){
  let errorObject = {
    status: 404 ,
    responcetext: 'sorry! this page is not found ' +'saadoun',
  };
  responce.status(404).send(errorObject);
}


// constructors

// location constructor
function Location (locationData){
  this.search_query = 'amman';
  this.formatted_query = locationData[0].display_name;
  this.latitude = locationData[0].lat;
  this.longitude = locationData[0].lobn;
}
// weather constructor
function Weather (weatherdata){
  this.forecast = weatherdata.weather.description;
  this.time = weatherdata.valid_date;
}
server.listen(PORT,()=>{
  console.log(`listening on PORT:${PORT}`);
});
