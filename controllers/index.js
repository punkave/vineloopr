var passport = require('passport');
var vine = require('vinelib')

module.exports = function(req, res) {
  res.render('index.html', { user: req.user });
}