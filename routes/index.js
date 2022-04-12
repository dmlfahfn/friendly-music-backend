var express = require('express');
const dotenv = require("dotenv");
const path = require("path");
const axios = require("axios");
var router = express.Router();
const cors = require("cors");

router.use(cors({credentials: true, origin: 'http://localhost:3000'}));
dotenv.config();
//const { OAuth2Client } = require("google-auth-library");
const bodyParser = require("body-parser");

router.get("/user", (req, res) => {

  req.app.locals.db.collection("users").find().toArray()
    .then(results => {
      res.send(results)
    })
});

const API_HOST_KEY = process.env.React_App_songs_host
const API_KEY = process.env.React_App_songs_key

// get all projects
router.get("/api", (req, res) => {

  let options = {
    method: 'GET',
    url: 'https://spotify23.p.rapidapi.com/search/',
    params: {
      q: '<REQUIRED>',
      type: 'multi',
      offset: '0',
      limit: '10',
      numberOfTopResults: '5'
    },
    headers: {
      'x-rapidapi-host': API_HOST_KEY,
      'x-rapidapi-key': API_KEY
    }
  };
  
  axios.request(options).then(function (response) {
    console.log(response.data);
    res.send(response.data);
  }).catch(function (error) {
    console.error(error);
  });
});

// router.post("/change", (req, res) => {
//   let user = req.body;

//   req.app.locals.db.collection("users").updateOne({"username": user.username,}, {$set:{"subscription": user.subscription }})
// res.json({"SALAM": "hello"})
// })

module.exports = router;
