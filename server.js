var express = require('express');
var app = express();
var passport = require('passport');
var NestStrategy = require('passport-nest').Strategy;
var session = require('express-session');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

passport.use(new NestStrategy({
	clientID: process.env.NEST_ID,
	clientSecret: process.env.NEST_SECRET
}));

passport.serializeUser(function(user, done) {
	done(null, user);
});

passport.deserializeUser(function(user, done) {
	done(null, user);
});

app.set('views', __dirname + '/client');
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

app.use(cookieParser('cookie_secret_shh'));
app.use(bodyParser());
app.use(session({secret: 'session_secret_shh'}));
app.use(passport.initialize());
app.use(passport.session());

app.use(express.static(__dirname + '/client'));
app.use('/bower_components', express.static(__dirname + '/bower_components'));

app.get('/auth/nest', passport.authenticate('nest'));

app.get ('/auth/nest/callback',
		passport.authenticate('nest', { }),
		function(req, res) {
			res.cookie('nest_token', req.user.accessToken);
			res.redirect('/');
		}
);

app.use('/', function(req, res) {
	res.render('index');
});

var server = app.listen(3000, function() {
	console.log("Server Started");
});