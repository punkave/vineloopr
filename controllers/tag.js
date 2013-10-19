var passport = require('passport');
var vine = require('vinelib');
var url = require('url');
var config = require('../config');

module.exports = function(req, res) {
	var parts = url.parse(req.url);
	vine.login({
	  username: config.account.username
	  , password: config.account.password
	}, function (login) {
		vine.getTag(req.params[0], function (tags) {
		    res.send(tags);
		})
	});
}



