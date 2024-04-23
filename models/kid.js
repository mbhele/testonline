const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Schema = mongoose.Schema;

const kidSchema = new Schema({
  name: { type: String, required: true },
  age: { type: Number, required: true },
  parent: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  username: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  visitCount: { type: Number, default: 0 },
  progress: [{
    date: Date,
    activity: String,
    score: Number
  }],
  role: { type: String, default: 'kid' }  // Adding a role field
});

// Asynchronously hash the password when setting it
kidSchema.methods.setPassword = async function(password) {
  this.passwordHash = await bcrypt.hash(password, 10);
};

// Compare the provided password with the stored hash
kidSchema.methods.validatePassword = function(password) {
  return bcrypt.compare(password, this.passwordHash);
};

module.exports = mongoose.model('Kid', kidSchema);
