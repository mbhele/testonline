
// Import necessary modules and models
const mongoose = require('mongoose');
const Parent = require('./models/parent');
const User = require('./models/user');

// Connect to MongoDB
mongoose.connect('mongodb+srv://websiteclient:K8K1iBAOzjSMnnIl@cluster0.f7diq.mongodb.net/', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  console.log('Connected to MongoDB');
  // Seed parent accounts
  seedParents();
})
.catch(err => {
  console.error('Database connection error', err);
});

// Function to seed parent accounts
async function seedParents() {
  try {
    // Check if any parent accounts exist
    const parentsCount = await Parent.countDocuments();
    if (parentsCount === 0) {
      // Create parent accounts
      const parentsData = [
        { email: 'xabana@example.com', username: 'xabana' },
        { email: 'xaban2@example.com', username: 'xabana2' }
        // Add more parent data as needed
      ];

      // Loop through parent data and register each parent
      for (let parent of parentsData) {
        const newUser = new User(parent);
        const registeredUser = await User.register(newUser, 'password'); // Assuming a default password
        const newParent = new Parent({ email: parent.email, username: parent.username, user: registeredUser._id });
        await newParent.save();
        console.log(`Parent registered: ${parent.username}`);
      }

      console.log('Parent accounts seeded successfully');
    } else {
      console.log('Parent accounts already exist. Skipping seed.');
    }
  } catch (error) {
    console.error('Error seeding parent accounts:', error);
  } finally {
    // Close the database connection after seeding
    mongoose.disconnect();
  }
}
