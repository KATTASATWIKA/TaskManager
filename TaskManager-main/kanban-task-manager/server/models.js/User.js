const mongoose = require('mongoose');
const bcrypt = require('bcrypt');


const UserSchema = new mongoose.Schema({
email: { type: String, unique: true, required: true, lowercase: true, index: true },
name: { type: String, required: true },
passwordHash: { type: String, required: true },
}, { timestamps: true });


UserSchema.methods.verifyPassword = function (pwd) {
return bcrypt.compare(pwd, this.passwordHash);
};


module.exports = mongoose.model('User', UserSchema);