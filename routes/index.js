// index.js

/*  EXPRESS */

const express = require('express');
const router = express();
const session = require('express-session');

router.set('view engine', 'ejs');

router.use(session({
  resave: false,
  saveUninitialized: true,
  secret: 'SECRET' 
}));

router.get('/', function(req, res, next) {
  res.render('auth');
});

const port = process.env.PORT || 3000;
router.listen(port , () => console.log('App listening on port ' + port));

/*  PASSPORT SETUP  */

const passport = require('passport');
var userProfile;

router.use(passport.initialize());
router.use(passport.session());

router.set('view engine', 'ejs');

router.get('/success', (req, res) => res.send(userProfile));
router.get('/error', (req, res) => res.send("error logging in"));

passport.serializeUser(function(user, cb) {
  cb(null, user);
});

passport.deserializeUser(function(obj, cb) {
  cb(null, obj);
});

/*  Google AUTH  */
 
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const GOOGLE_CLIENT_ID = '89269018402-2p232dpc95p23sennhkpjacs5nhkfvgt.apps.googleusercontent.com';
const GOOGLE_CLIENT_SECRET = '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';
passport.use(new GoogleStrategy({
    clientID: GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:3000/auth/google/callback"
  },
  function(accessToken, refreshToken, profile, done) {
      userProfile=profile;
      return done(null, userProfile);
  }
));
 
router.get('/auth/google', 
  passport.authenticate('google', { scope : ['profile', 'email'] }));
 
router.get('/auth/google/callback', 
  passport.authenticate('google', { failureRedirect: '/error' }),
  function(req, res) {
    // Successful authentication, redirect success.
    res.redirect('/rfid');
  });

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { user: '' });
});

router.get('/rfid', (req, res) => res.render('rfid'));

module.exports = router;
