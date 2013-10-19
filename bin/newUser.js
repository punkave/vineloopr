var mongo = require('../db/mongo-store')()
  , User = require('../models/user');

var user = new User({ username: 'admin', password: 'password' });

user.save(function(err) {
  if(err) {
    console.log(err);
  } else {
    console.log('user: ' + user.username + " saved.");
  }
});