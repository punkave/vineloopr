var passport = require('passport');


module.exports = function (app, options) {  

  app.get('/', require('../controllers/index'));

  app.get('/tag/*', require('../controllers/tag'));

  //user stuff
  app.get('/register', require('../controllers/register'));
  app.post('/register', require('../controllers/register').post);

  app.get('/login', function(req, res){
    res.render('login.html', { user: req.user, message: req.session.messages });
  });

  app.post('/login', function(req, res, next) {
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
  });

  app.get('/logout', function(req, res){
    req.logout();
    res.redirect('/');
  });
}