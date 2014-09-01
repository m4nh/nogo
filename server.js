var express = require('express');
var passport = require('passport')
  , LocalStrategy = require('passport-local').Strategy;


passport.use(new LocalStrategy(
  function(username, password, done) {
    if(username=="pippo" && password=="poppo"){
	done(null, {username:"pippo",password:"poppo"});	
    }else{
	return done(null, false, { message: 'Incorrect username.' });
    }
  }
));

passport.serializeUser(function(user, done) {
  done(null, user.username);
});

passport.deserializeUser(function(username, done) {
    done(null,  {username:username,password:"poppo"});
});

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  res.send(401);
}

var app = express();
app.use(express.cookieParser());
  app.use(express.bodyParser());
  app.use(express.session({ secret: 'keyboard cat' }));
  app.use(passport.initialize());
  app.use(passport.session());


app.get('/users', function(req, res) {
    res.send([{name:'daniele'}, {name:'pippo'}]);
});
app.get('/users/:id', function(req, res) {
    res.send({id:req.params.id, name: "The Name", description: "description"});
});

app.get('/private',ensureAuthenticated, function(req, res) {
    console.log(req.user);
    res.send({secret:"walahhal"});
});

app.get('/logout',ensureAuthenticated, function(req, res) {
	req.logout();
});


app.post('/login',passport.authenticate('local'),function(req,res,next){

	passport.authenticate('local', function(err, user, info) {
	    if (err) { return next(err) }
	    if (!user) {
	      req.flash('error', info.message);
	      return res.redirect('/login')
	    }
	    req.logIn(user, function(err) {
	      if (err) { return next(err); }
	      return res.redirect('/users/' + user.username);
	    });
	  })(req, res, next);

});

app.listen(3000);
console.log('Listening on port 3000...');
