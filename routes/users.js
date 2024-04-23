const bcrypt = require('bcryptjs');
const express = require('express');
const passport = require('passport');
const User = require('../models/user'); // Ensure the import path is correct
const ParentAnswer = require('../models/parent')
const router = express.Router();
const { isLoggedIn, isAdmin, checkRole } = require('../middleware');
// users.js

// Import the calculateScore function from the scoreCalculator.js file
const calculateScore = require('../public/scoreCalculator');

// Now you can use the calculateScore function in this file


router.get('/register', (req, res) => {
    res.render('users/register');
});

router.post('/register', async (req, res) => {
    const { username, email, password, role, secretCode } = req.body;

    // Assuming here that only 'parent' and 'admin' roles are allowed
    if (role !== 'parent' && role !== 'admin') {
        req.flash('error', 'Invalid role selection.');
        return res.redirect('/register');
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({
            username,
            email,
            hash: hashedPassword,
            role
        });
        await newUser.save();
        req.login(newUser, err => {
            if (err) {
                console.error(err);
                return res.redirect('/login');
            }
            switch (newUser.role) {
                case 'parent':
                    return res.redirect('/profile');
                case 'admin':
                    return res.redirect('/admin/dashboard');
                default:
                    return res.redirect('/');
            }
        });
    } catch (e) {
        console.error(e);
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
    switch (req.user.role) {
        case 'parent':
            return res.redirect('/profile');
        case 'admin':
            return res.redirect('/admin/dashboard');
        default:
            return res.redirect('/'); // Default route if role is not recognized
    }
});

router.get('/profile', isLoggedIn, async (req, res) => {
    if (req.user.role !== 'parent') {
        req.flash('error', 'Only parents can access this page.');
        return res.redirect('/');
    }
    try {
        // Fetch user's answers from the database
        const userAnswers = await ParentAnswer.find({ parent: req.user._id });

        // Calculate the score
        const score = calculateScore(userAnswers);

        // Calculate the percentage
        const totalQuestions = userAnswers.length; // Assuming each answer represents one question
        const percentage = (score / totalQuestions) * 100;

        // Render the profile template with fetched data, score, and percentage
        res.render('users/profile', {
            user: req.user,
            userAnswers: userAnswers,
            score: score,
            percentage: percentage // Add the percentage variable to the template data
        });
    } catch (error) {
        console.error('Error accessing the parent profile:', error);
        req.flash('error', 'An error occurred while trying to access the profile.');
        res.redirect('/');
    }
});







router.post('/api/submit-answer', async (req, res) => {
    const { answer } = req.body;
    console.log('Received answer from client:', req.body);

    try {
        // Placeholder validation
        if (!answer || typeof answer !== 'string') {
            return res.status(400).json({ success: false, message: 'Invalid answer format' });
        }

        // Create a new instance of the Answer model
        const newAnswer = new ParentAnswer({
            parent: req.user._id, // Assign the parent's _id to the parent field
            selectedAnswer: answer, // Use selectedAnswer instead of answer
            createdAt: new Date(), // Example: Include creation timestamp
            updatedAt: new Date() // Example: Include update timestamp
        });

        // Save the new answer document to the database
        await newAnswer.save();

        // Respond with a success message
        res.json({ success: true, message: 'Answer submitted successfully' });
    } catch (error) {
        console.error('Error submitting answer:', error);
        // Handle database or other errors
        res.status(500).json({ success: false, message: 'An error occurred while submitting the answer' });
    }
});






router.get('/admin/dashboard', isLoggedIn, (req, res) => {
    if (req.user.role !== 'admin') {
        req.flash('error', 'You do not have permission to view this page.');
        return res.redirect('/');
    }
    res.render('admin/dashboard', { user: req.user });
});

router.get('/logout', (req, res) => {
    req.logout(err => {
        if (err) { return next(err); }
        res.redirect('/');
    });
});

module.exports = router;
