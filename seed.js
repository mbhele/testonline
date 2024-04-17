const mongoose = require('mongoose');
const User = require('./models/user'); // Import your User model

// Connect to MongoDB
mongoose.connect('mongodb+srv://websiteclient:K8K1iBAOzjSMnnIl@cluster0.f7diq.mongodb.net/', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  console.log('Connected to MongoDB');

  // Create a new admin user instance
  const adminUserData = {
    email: 'admin3@example.com', // Change the email to a unique value
    username: 'admin3', // Change the username to a unique value if needed
    password: 'adminpassword', 
    isAdmin: true 
  };
  
  const adminUser = new User(adminUserData);

  // Save the admin user instance to the database
  return adminUser.save();
})
.then(admin => {
  console.log('Admin user created successfully:', admin);
  // It's important to close the connection when you're done
  mongoose.connection.close();
})
.catch(err => {
  console.error('Error during database operation:', err);
  // Close the connection if there is an error as well
  mongoose.connection.close();
});
