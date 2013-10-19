var express = require('express')
  , routes = require('./router')
  , nunjucks = require('nunjucks')
  , http = require('http')
  , path = require('path')
  , passport = require('passport')
  , LocalStrategy = require('passport-local').Strategy
  , User = require('./models/user');


//passport setup
passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function (err, user) {
    done(err, user);
  });
});

passport.use(new LocalStrategy(function(username, password, done) {
  User.findOne({ username: username }, function(err, user) {
    if (err) { return done(err); }
    if (!user) { return done(null, false, { message: 'Unknown user ' + username }); }
    user.comparePassword(password, function(err, isMatch) {
      if (err) return done(err);
      if(isMatch) {
        return done(null, user);
      } else {
        return done(null, false, { message: 'Invalid password' });
      }
    });
  });
}));


//nunjucks setup
var env = new nunjucks.Environment(new nunjucks.FileSystemLoader(__dirname + '/views'), { 
    dev: true, 
    autoescape: true 
});

env.addFilter('shorten', function(str, count) {
  if(str.length > count) {
    return str.slice(0, count)+'...';
  } else {
    return str;
  }
});

env.addFilter('json', function(data) {
  return JSON.stringify(data);
});

env.addFilter('date', function(date){
  return moment(date).format('MM/DD h:mma')
})

var app = express();
app.configure(function(){
  app.set('views', __dirname + '/views');
  // app.set('view engine', 'ejs');
  
  //feed app to nunjucks environment
  env.express(app);

  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser('your secret here'));
  app.use(express.session());

  app.use(passport.initialize());
  app.use(passport.session());


  app.use(app.router);
  app.use(require('less-middleware')({ src: __dirname + '/public' }));
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

// Connect mongoose
var options = {};
var mongo = require('./db/mongo-store');

mongo({});

// Setup routes
routes(app, mongo);

http.createServer(app).listen(3000, function(){
  console.log("Express server listening");
});
