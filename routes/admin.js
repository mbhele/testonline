const express = require('express');
const router = express.Router();
const { isAdmin } = require('../middleware'); // Make sure this path is correct
const User = require('../models/user');

router.get('/users', async (req, res) => {
  try {
    const users = await User.find({}).sort({ createdAt: 1 });
    
    // Check if users have 'createdAt' and use a placeholder if not
    const userDataForGraph = {
      labels: users.map(user => 
        user.createdAt ? user.createdAt.toISOString().substring(0, 10) : 'No Date'
      ),
      data: users.map((user, index) => index + 1) // Assuming you want to count users
    };

    res.render('admin/users', { users, userDataForGraph });
  } catch (error) {
    console.error('Error fetching users:', error);
    req.flash('error', 'Unable to fetch users.');
    res.redirect('/admin');
  }
});



// DELETE route to handle user deletion
router.delete('/users/:id', async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    req.flash('success', 'User deleted successfully.');
    res.redirect('/admin/users');
  } catch (error) {
    console.error('Error deleting user:', error);
    req.flash('error', 'Unable to delete user.');
    res.redirect('/admin/users');
  }
});

module.exports = router;
