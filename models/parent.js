const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');

const parentSchema = new Schema({
    // You might not need to explicitly define `username` and `password` fields anymore,
    // as `passport-local-mongoose` will add them for you. But you can keep `email` and `children`.
    email: { type: String, required: true, unique: true },
    children: [{ type: Schema.Types.ObjectId, ref: 'User' }] // Keeps reference to User models
});

// Apply the passportLocalMongoose plugin to the parentSchema.
// This will add a username, hash and salt field to store the username, the hashed password and the salt value.
parentSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('Parent', parentSchema);
