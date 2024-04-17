const express = require('express');
const passport = require('passport');
const User = require('../models/user');
const Kid = require('../models/kid'); // Ensure the path matches your project structure

const router = express.Router();
const { isLoggedIn, isAdmin, checkRole } = require('../middleware');
// Registration Route
router.get('/register', (req, res) => {
    res.render('users/register'); // Make sure you have a view template for registration
});

router.post('/register', async (req, res, next) => { // 'next' is added to handle errors in req.login
    console.log(req.body); // Debugging purpose
    const { username, email, password, role, secretCode } = req.body;

    // First, validate the role and secret code if needed
    if (!checkRole(role, secretCode)) {
        req.flash('error', 'Invalid role selection or secret code.');
        return res.redirect('/register');
    }

    try {
        // Assuming you have a User model set up to handle registration logic,
        // including password hashing. Adjust according to your setup.
        const newUser = new User({ username, email, role });

        // Replace this with your user registration logic if different.
        // This example assumes you have a method to handle registration and hashing.
        await User.register(newUser, password);

        // Automatically log in the user after registration
        req.login(newUser, (err) => {
            if (err) return next(err); // Properly handle the error

            // Redirect based on the user's role
            switch (newUser.role) {
                case 'parent':
                    return res.redirect('/profile');
                case 'kid':
                    return res.redirect('/kid/profile');
                case 'admin':
                    return res.redirect('/admin/dashboard');
                default:
                    return res.redirect('/');
            }
        });
    } catch (e) {
        console.error(e); // Error logging
        req.flash('error', e.message);
        return res.redirect('/register');
    }
});
// Login Routes
router.get('/login', (req, res) => {
    res.render('users/login');
});

router.post('/login', passport.authenticate('local', {
    failureRedirect: '/login',
    failureFlash: true
}), (req, res) => {
    // Redirect based on the user's role
    switch(req.user.role) {
        case 'parent':
            return res.redirect('/profile'); // Parent's profile page
        case 'kid':
            return res.redirect('/kid/profile'); // Kid's profile page
        case 'admin':
            return res.redirect('/admin/dashboard'); // Admin dashboard
        case 'regular':
        default:
            return res.redirect('/'); // Homepage or regular user's dashboard if exists
    }
});

// Parent Profile Route
router.get('/profile', isLoggedIn, async (req, res) => {
    // Ensure user is a parent
    if (req.user.role !== 'parent') {
        return res.redirect('/');
    }
    try {
        const kids = await Kid.find({ parent: req.user._id }).lean();
        res.render('users/profile', { user: req.user, kids });
    } catch (error) {
        console.error('Error:', error);
        res.redirect('/');
    }
});


// Kid login routes
router.get('/kid/login', (req, res) => {
    // Check if there's a flash message for errors (incorrect username/password)
    const message = req.flash('error');
    
    // Render the login form with any flash messages
    res.render('kidLogin', { message }); // Assuming your EJS file is named kidLogin.ejs
});

router.post('/kid/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        const kid = await Kid.findOne({ username }).exec();
        if (!kid) {
            req.flash('error', 'Username not found.');
            return res.redirect('/kid/login');
        }

        if (!(await kid.validatePassword(password))) {
            req.flash('error', 'Incorrect password.');
            return res.redirect('/kid/login');
        }

        req.logIn(kid, (err) => {
            if (err) {
                req.flash('error', 'Error logging in');
                return res.redirect('/kid/login');
            }
            return res.redirect('/kid/profile');
        });
    } catch (error) {
        console.error('Login error:', error);
        req.flash('error', 'An error occurred.');
        res.redirect('/kid/login');
    }
});





// Route for rendering the kid's profile page
router.get('/kid/profile', isLoggedIn, async (req, res) => {
    if (!req.session.kidId) {
      req.flash('error', 'Not authorized.');
      return res.redirect('/login');
    }
    
    try {
      const kid = await Kid.findById(req.session.kidId);
      if (!kid) {
        req.flash('error', 'Profile not found.');
        return res.redirect('/kid/login');
      }
      res.render('kid/profile', { kid });
    } catch (error) {
      console.error('Fetching kid profile failed:', error);
      req.flash('error', 'An error occurred while fetching the profile.');
      res.redirect('/kid/login');
    }
  });
  

router.get('/admin/dashboard', isLoggedIn, (req, res) => {
    // Ensure user is an admin
    if (req.user.role !== 'admin') {
        req.flash('error', 'You do not have permission to view this page.');
        return res.redirect('/');
    }
    // Pass the logged-in user to the dashboard template
    res.render('admin/dashboard', { user: req.user });
});


// Logout Route
router.get('/logout', (req, res, next) => {
    req.logout(function(err) {
        if (err) { return next(err); }
        res.redirect('/');
    });
});

module.exports = router;