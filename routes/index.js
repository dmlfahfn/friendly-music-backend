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
    // console.log(response.data);
    res.send(response.data);
  }).catch(function (error) {
    console.error(error);
  });
});

router.post("/write", function (req, res, err) {
   let music = req.body;
   let Id = music.Id;

   req.app.locals.db.collection("likedMusic").find({Id : Id}).toArray()
   .then(foundMusic => {
    if(foundMusic.length === 0){
      console.log("No music found");

      let Title = music.Title;
      let ImageUrl = music.ImageUrl;
      let LikedBy = music.LikedBy;
      foundMusic.push(req.body)
      req.app.locals.db.collection("likedMusic").insertOne({Id : Id, Title: Title, ImageUrl : ImageUrl, LikedBy : [LikedBy] })
    }
    
    console.log("exist");
    console.log("id", foundMusic[0].Id);
    let _id = foundMusic[0].Id

    let likedByArray = foundMusic[0].LikedBy;
    console.log("indexOf", likedByArray.indexOf(req.body.LikedBy));
    
    if (foundMusic.includes(req.body.LikedBy)){
    let idx = likedByArray.indexOf(req.body.LikedBy);
    likedByArray.splice(idx, 1);
     console.log("likedByArray",likedByArray);
     console.log("Unlike!", foundMusic.includes(req.body.LikedBy));
    } else {
      likedByArray.push(req.body.LikedBy);
      console.log("Like!", foundMusic.includes(req.body.LikedBy));
    }

    req.app.locals.db.collection("likedMusic").updateOne({_id: _id}, {$set:{LikedBy: likedByArray }}, 
      (err) => {
        if (err){
          console.log(err);
        }
      })
  })

  });

module.exports = router;
