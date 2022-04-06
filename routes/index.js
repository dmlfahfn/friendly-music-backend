var express = require('express');
const dotenv = require("dotenv");
const path = require("path");
const axios = require("axios");
var router = express.Router();

dotenv.config();
//const { OAuth2Client } = require("google-auth-library");
const bodyParser = require("body-parser");

router.get("/user", (req, res) => {
  req.app.locals.con.connect(function(err){
    if(err){
      console.log(err);
    }

    let sql = `SELECT username, password FROM users`;

    req.app.locals.con.query(sql, function(err, result){
      if(err){
        console.log(err);
      }
      console.log("result", result);
      res.send(result)
    })
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

module.exports = router;
