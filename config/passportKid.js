const LocalStrategy = require('passport-local').Strategy;
const Kid = require('../models/kid'); // Adjust the path as necessary
const bcrypt = require('bcryptjs');

module.exports = function(passport) {
    passport.use('kid-local', new LocalStrategy({ usernameField: 'username' }, async (username, password, done) => {
        try {
            const kid = await Kid.findOne({ username: username });
            if (!kid) {
                return done(null, false, { message: 'No kid found with that username.' });
            }

            const isMatch = await bcrypt.compare(password, kid.passwordHash);
            if (isMatch) {
                return done(null, kid);
            } else {
                return done(null, false, { message: 'Password incorrect.' });
            }
        } catch (err) {
            return done(err);
        }
    }));

    // Include serialization and deserialization here if not included elsewhere
};
