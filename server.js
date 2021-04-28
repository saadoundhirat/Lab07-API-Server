'use strict';

//to run the server
//1- npm start
//2- node server.js
//3- nodemon


// requiers lib: //Application Depandancies
const express = require('express'); // make the server requier the express framework
require('dotenv').config(); // .env file requier
const cors = require('cors');
const superagent = require('superagent');

//Application Setup
const server = express();
const PORT = process.env.PORT || 5000;
server.use(cors()); //open for any request from any client

// building routes:
// server.get(route , callback function)
server.get('/data', (req, res) => {
  res.status(200).send('Hi from the data page, I am the server !!!');
});

//////////////////// Location
function Location(cityName, locData) {
  this.search_query = cityName;
  this.formatted_query = locData[0].display_name;
  this.latitude = locData[0].lat;
  this.longitude = locData[0].lon;
}
function getLocation(req, res) {
  //fetch the data that inside locaion.json file
  // let locationData = require("./data/location.json");
  let cityName = req.query.city;
  let key = process.env.LOCATION_KEY;
  let locURL = `https://us1.locationiq.com/v1/search.php?key=${key}&q=${cityName}&format=json`;
  superagent
    .get(locURL) //send a request locatioIQ API
    .then((geoData) => {
      // console.log(geoData.body);
      let gData = geoData.body;
      let locationData = new Location(cityName, gData);
      res.send(locationData);
      // console.log('inside superagent');
    })
    .catch((error) => {
      console.log(error);
      res.send(error);
    });

  // res.send(locationRes);
}
server.get('/location', getLocation);

//////////////////// Weather
function Weather(WeaData) {
  this.forecast = WeaData.weather.description;
  this.time = new Date(WeaData.datetime).toString().slice(0, 15);
}
function getWeather(req, res) {
  //fetch the data that inside locaion.json file
  let cityName = req.query.city;
  let key = process.env.WEATHER_KEY;
  let locURL =`https://api.weatherbit.io/v2.0/forecast/daily?city=${cityName}&key=${key}`;
  superagent
    .get(locURL) //send a request locatioIQ API
    .then((WeaData) => {
      // console.log(WeaData);
      let wData = WeaData.body;
      const weatherObj = wData.data.map(function (element) {
        return new Weather(element);
      });
      let weatherObjSpliced = weatherObj.splice(0, 8);// take first 8 days but we can do this with the url using days={integer} to take only the requires number of days
      res.send(weatherObjSpliced);
    })
    .catch((error) => {
      console.log(error);
      res.send(error);
    });
}
server.get('/weather', getWeather);

//////////////////// Parks
function Park(parkData) {
  this.name = parkData.fullName;
  this.address = `${parkData.addresses[0].city} , ${parkData.addresses[0].line1} , ${parkData.addresses[0].line2}`;
  this.fee = parkData.entranceFees[0].cost;
  this.description = parkData.description;
  this.url = parkData.url;
}
function getParks(req, res) {
  //fetch the data that inside locaion.json file
  let cityName = req.query.city;
  let key = process.env.PARKS_KEY;
  // https://developer.nps.gov/api/v1/parks?parkCode=acad&api_key=81njqyR01dxhdADZenFqggIHwwstaiuzg1BKTeR5
  let locURL = `https://developer.nps.gov/api/v1/parks?q=${cityName}&limit=10&api_key=${key}`;
  superagent
    .get(locURL) //send a request locatioIQ API
    .then((parkData) => {
      let pData = parkData.body;
      const parksObj = pData.data.map(function (element) {
        return new Park(element);
      });
      res.send(parksObj);
    })
    .catch((error) => {
      console.log(error);
      res.send(error);
    });
}
server.get('/parks', getParks);

//////////////////// general
function getGeneral(req, res) {
  //fetch the data that inside locaion.json file
  let errObj = {
    status: 500,
    resText: 'sorry! this page not found',
  };
  res.status(500).send(errObj);
}
server.get('*', getGeneral);

//////////////////// listening
server.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
});
