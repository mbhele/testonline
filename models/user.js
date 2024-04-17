const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');

const userSchema = new mongoose.Schema({
  // Note: With passport-local-mongoose, you don't need to manually define the username and password fields
  email: {
    type: String,
    required: true,
    unique: true
  },
  role: {
    type: String,
    required: true,
    enum: ['regular', 'parent', 'kid', 'admin']  // Ensuring 'admin' is a valid role
  },
  // Any other fields you have...
}, { timestamps: true });

// Passport-Local Mongoose plugin configuration
userSchema.plugin(passportLocalMongoose);

const User = mongoose.model('User', userSchema);

module.exports = User;
