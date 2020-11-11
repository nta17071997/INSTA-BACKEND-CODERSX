const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, require: true },
  resetToken: String,
  expireToken: Date,
  pic: {
    type: String,
    default:
      'https://res.cloudinary.com/nguyenthanhan/image/upload/v1591158729/17797_lvfrcb.svg',
  },
});

const User = mongoose.model('User', userSchema);
module.exports = User;
