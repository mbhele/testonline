// routes/adminRoutes.js
const express = require('express');
const { isLoggedIn } = require('../middleware'); // Update the path as necessary
const router = express.Router();

router.get('/dashboard', isLoggedIn, (req, res) => {
    if (req.user.role !== 'admin') {
        return res.redirect('/');
    }
    res.render('admin/dashboard', { user: req.user });
});

module.exports = router;
