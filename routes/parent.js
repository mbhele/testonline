const express = require('express');
const router = express.Router();
const Kid = require('../models/kid'); // Ensure this path is correct
const { isLoggedIn } = require('../middleware'); // Adjust path as necessary



// Route to display the form for adding a child
// Assuming this route is in your 'routes/parent.js' file
router.get('/add-child', isLoggedIn, (req, res) => {
    res.render('parent/addChild', { user: req.user }); // Note the 'parent/' prefix in the path
  });
  

  router.post('/add-child', isLoggedIn, async (req, res) => {
    // Ensure you're correctly extracting the username and password from req.body
    const { childName, age, username, password } = req.body;
    
    try {
        const newKid = new Kid({
            name: childName,
            age,
            username,
            parent: req.user._id, // Assigning the parent ID to the child
        });
        
        
        await newKid.setPassword(password); // Assuming setPassword hashes the password
        await newKid.save();
        res.redirect('/profile');
    } catch (error) {
        console.log('Error adding child:', error);
        // handle error
    }
});



module.exports = router;
