const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
const User = require('../models/user');
const Kid = require('../models/Kid');

module.exports = function(passport) {
    // Local strategy for user login
    passport.use(new LocalStrategy({
        usernameField: 'username',
        passwordField: 'password'
    }, async (username, password, done) => {
        try {
            // Try to find the user in the User collection
            let user = await User.findOne({ username });
            let userType = 'User';  // Default user type

            // If not found, check in the Kid collection
            if (!user) {
                user = await Kid.findOne({ username });
                userType = 'Kid';
                if (!user) {
                    return done(null, false, { message: 'No user found with that username.' });
                }
            }

            // User found, now validate the password
            bcrypt.compare(password, user.hash, (err, isMatch) => {
                if (err) return done(err);
                if (isMatch) {
                    return done(null, user, { type: userType }); // Pass user type as part of the authentication callback
                } else {
                    return done(null, false, { message: 'Password incorrect.' });
                }
            });
        } catch (error) {
            return done(error);
        }
    }));

    // Serialize user information into the session
    passport.serializeUser((user, done) => {
        done(null, { id: user.id, type: user.role });
    });

    // Deserialize user information from the session
    passport.deserializeUser(async (userKey, done) => {
        const Model = userKey.type === 'Kid' ? Kid : User;
        try {
            const user = await Model.findById(userKey.id);
            done(null, user);
        } catch (error) {
            done(error, null);
        }
    });
};
