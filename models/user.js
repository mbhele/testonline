const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  username: { type: String, unique: true, required: true },
  email: { type: String, unique: true, required: true },
  hash: { type: String, required: true }, // Stores the hashed password
  role: { type: String, required: true, enum: ['regular', 'parent', 'admin'] } // Remove 'kid' from the enum
}, { timestamps: true });

// Password hash generating method
userSchema.methods.setPassword = async function(password) {
  this.hash = await bcrypt.hash(password, 10);
};

// Password validation method
userSchema.methods.validatePassword = function(password) {
  return bcrypt.compare(password, this.hash);
};

// Prevent model recompilation if it already exists
const User = mongoose.models.User || mongoose.model('User', userSchema);
module.exports = User;
