'use strict'

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    fullname: String,
    username: {type: String, required: true, unique: true},
    password: {type: String, required: true}
});

userSchema.set('toJSON', {
    virtuals: true,
    transform: (doc, result) => {
      delete result._id;
      delete result.__v;
      delete result.password;
    }
  });

userSchema.statics.hashPassword = function(password) {
  return bcrypt.hash(password, 10);
}
userSchema.methods.validatePassword = function(password) {
  return bcrypt.compare(password, this.password);
}


  
module.exports = mongoose.model('User', userSchema);

