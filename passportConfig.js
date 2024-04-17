// In passportConfig.js
const LocalStrategy = require('passport-local').Strategy;
const User = require('./models/user'); // Adjust path as necessary

module.exports = function(passport) {
  passport.use(new LocalStrategy(User.authenticate()));
  passport.serializeUser(User.serializeUser());
  passport.deserializeUser(User.deserializeUser());
};
