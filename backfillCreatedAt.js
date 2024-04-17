const mongoose = require('mongoose');
const User = require('./models/admin'); // This should match your actual file name.
 // Adjust the path to your User model

mongoose.connect('mongodb://127.0.0.1:27017/draglearn', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  // other options if necessary
}).then(() => {
  console.log('Connected to MongoDB');
  backfillCreatedAt(); // Call the backfill function after successful connection
}).catch(err => {
  console.error('Database connection error', err);
});

async function backfillCreatedAt() {
  const usersWithoutCreatedAt = await User.find({ createdAt: { $exists: false } });
  
  for (const user of usersWithoutCreatedAt) {
    user.createdAt = user._id.getTimestamp(); // Use the ObjectId timestamp as the creation date
    await user.save();
  }
  
  console.log(`Backfilled 'createdAt' for ${usersWithoutCreatedAt.length} users.`);
  mongoose.disconnect(); // Disconnect from MongoDB after the operation
}
