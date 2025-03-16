const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new  mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: { 
    type: String, 
    required: true, 
    unique: true 
  },
  password: { 
    type: String, 
    required: true 
  },
  firstName: { 
    type: String, 
    required: true 
  },
  lastName: { 
    type: String, 
    required: true 
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
});

// Method to pre-save hook to hash password
userSchema.pre('save', function (next) {
  if (this.isModified('password') || this.isNew) {
    this.password = bcrypt.hashSync(this.password, 10);
  }
  next();
});

// Method to check if input password matches hashed password
userSchema.methods.comparePassword = function (inputPassword) {
  return bcrypt.compareSync(inputPassword, this.password);
}

module.exports = mongoose.model('User', userSchema);