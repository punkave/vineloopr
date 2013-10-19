var passport = require('passport');

module.exports = function(req, res) {
  res.render('login.html', { user: req.user, message: req.session.messages });
}

module.exports.post = function(req, res) {
  passport.authenticate('local', function(err, user, info) {
    if (err) { return next(err) }
    if (!user) {
      req.session.messages =  [info.message];
      return res.redirect('/login')
    }
    req.logIn(user, function(err) {
      if (err) { return next(err); }
      return res.redirect('/');
    });
  })(req, res, next);
}