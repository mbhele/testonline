const mongoose = require('mongoose');
const prompt = require('prompt-sync')(); // Import prompt-sync package
const User = require('./models/user'); // Replace with the actual path

// Connect to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/draglearn', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const adminUserData = {
  email: 'admin@mbuso.com',
  username: 'admin',
  isAdmin: true // Admin flag set to true
};

// Prompt for the admin password
const password = prompt('Enter a secure admin password: ', { echo: '*' });

// Register the admin user with the provided password
User.register(adminUserData, password, (err, user) => {
  if (err) {
    console.error('Error registering admin user:', err);
    process.exit(1); // Exit the script with an error code
  } else {
    console.log('Admin user successfully registered:', user);
    process.exit(0); // Exit the script successfully
  }
});
