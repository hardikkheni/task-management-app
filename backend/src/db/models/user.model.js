const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const { timestamps, defaultOptions } = require('../../constants/db.constant');

const SALT_WORK_FACTOR = 10;

const UserSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String },
    avatar: { type: String },
  },
  {
    ...defaultOptions,
    timestamps,
  }
);

UserSchema.pre('save', function (next) {
  var user = this;

  // only hash the password if it has been modified (or is new)
  if (!user.isModified('password')) return next();

  // generate a salt
  bcrypt.genSalt(SALT_WORK_FACTOR, function (err, salt) {
    if (err) return next(err);

    // hash the password using our new salt
    bcrypt.hash(user.password, salt, function (err, hash) {
      if (err) return next(err);
      // override the cleartext password with the hashed one
      user.password = hash;
      next();
    });
  });
});

UserSchema.methods.comparePassword = function (candidatePassword) {
  return new Promise((res, rej) => {
    bcrypt.compare(candidatePassword, this.password, function (err, isMatch) {
      if (err) return rej(err);
      res(isMatch);
    });
  });
};

const User = mongoose.model('User', UserSchema);

module.exports = User;
