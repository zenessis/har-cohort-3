const express = require('express');

const app = express();

// holds count of requests
let numberOfRequestsForUser = {};

// stores interval id
let resetInterval;


// mw to rate limit
app.use((req, res, next) => {
  const userID = req.header('user-id');

  if(!userID){
    res.status(404).json({ error: "user-id is required!"});
  }

  const currentTime = Math.floor(Date.now() / 1000); // current second timelapse

  // if user data is not already present

  if(!numberOfRequestsForUser[userID]){
    numberOfRequestsForUser[userID] = { count: 0, lastRequestTime: currentTime };
  }

  const userData = numberOfRequestsForUser[userID];

  if(currentTime == userData.lastRequestTime){
    userData.count += 1;
  }
  else{
    userData.count = 1;
    userData.lastRequestTime = currentTime
  }

  if(userData.count > 5){
    return res.status(429).json({ error: "Too many requests"});
  }

  //continue to next handler
  next();
})
 resetInterval = setInterval(() => {
    numberOfRequestsForUser = {};
}, 1000);

app.get('/user', function(req, res) {
  res.status(200).json({ name: 'john' });
});

app.post('/user', function(req, res) {
  res.status(200).json({ msg: 'created dummy user' });
});