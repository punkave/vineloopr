var passport = require('passport');
var vine = require('vinelib');
var url = require('url');
var config = require('../config');

module.exports = function(req, res) {

	if (req.body.username){
		req.session.username = req.body.username;
	}
	
	if (req.body.password){
		req.session.password = req.body.password;
	}

	vine.login({
	  username: req.session.username,
		password: req.session.password
	}, function (login) {
		vine.getTag(req.body.tag, function (tags) {
		    res.send(tags);
		})
	});
}



