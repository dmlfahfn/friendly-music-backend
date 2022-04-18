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

      let Title = music.Title;
      let ImageUrl = music.ImageUrl;
      let LikedBy = music.LikedBy;
      let Artist = music.Artist;
      foundMusic.push({Id : Id, Title: Title, ImageUrl : ImageUrl, Artist: Artist, LikedBy : [LikedBy] })
      req.app.locals.db.collection("likedMusic").insertOne({Id : Id, Title: Title, ImageUrl : ImageUrl, Artist: Artist, LikedBy : [LikedBy] })
    }
    
    console.log("remove tagg",req.body);

    let _id = foundMusic[0]._id

    let likedByArray;

   for(let music in foundMusic){
    likedByArray = foundMusic[music].LikedBy
    if (foundMusic[music].LikedBy.includes(req.body.LikedBy)){
    let idx = likedByArray.indexOf(req.body.LikedBy);
    likedByArray.splice(idx, 1);
    } else {
      likedByArray.push(req.body.LikedBy);
    }
  
    req.app.locals.db.collection("likedMusic").updateOne({_id: _id}, {$set:{LikedBy: likedByArray }}, 
      (err) => {
        if (err){
          console.log(err);
        }
      })
    } 
  })

});

router.post('/getlikedmusic', function (req, res) {

  console.log(req.body.user);
  req.app.locals.db.collection("likedMusic").find({LikedBy : {$in : [req.body.user]}}).toArray().then((music) => {
    res.json(music);
  });
});

router.get('/users', function (req, res) {
  req.app.locals.db.collection("users").find().toArray().then((users) => {
    res.json(users);
  });
});

router.post("/followuser", function (req, res, err) {
  console.log(req.body);

  let Id = req.body.Id
  let User = req.body.User
  let Me = req.body.Me

  req.app.locals.db.collection("likedUsers").find({Me : Me}).toArray()
  .then(likedUser => {
    if(likedUser.length === 0){
      console.log("Not following any user");
      likedUser.push({Id : Id, User: [User], Me: Me})
      req.app.locals.db.collection("likedUsers").insertOne({Id : Id, User: [User], Me: Me })
    }

    console.log("User exist");

    let likedUserArray;
    for(let user in likedUser){
      likedUserArray = likedUser[user].User
      if(likedUser[user].User.includes(req.body.User)){
        let ind = likedUserArray.indexOf(req.body.User);
        likedUserArray.splice(ind, 1);
         console.log("likedUserArray");
         console.log("Unfollow!");
      }else {
        likedUserArray.push(User);
        console.log("Follow!");
      }

      req.app.locals.db.collection("likedUsers").updateOne({Me: Me}, {$set:{User: likedUserArray }}, 
        (err) => {
          if (err){
            console.log(err);
          }
        })
    }
  })
})

router.post('/friends', function (req, res) {
  req.app.locals.db.collection("likedUsers").find({Me : {$in : [req.body.user]}}).toArray().then((friend) => {
    res.json(friend);
  });
});

module.exports = router;
