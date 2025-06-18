const User = require('../models/User');
const bcrypt = require('bcrypt');

async function createUser(data) {
  const { email, password } = data;
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new Error('Utilisateur déjà existant');
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = new User({ email, password: hashedPassword });
  return newUser.save();
}

async function getAllUsers() {
  return User.find({}, '-password');
}

async function getUserByEmail(email) {
  return User.findOne({ email }, '-password');
}

async function updateUser(email, data) {
  const user = await User.findOne({ email });
  if (!user) return null;

  if (data.password) {
    user.password = await bcrypt.hash(data.password, 10);
  }

  return user.save();
}

async function deleteUser(email) {
  return User.findOneAndDelete({ email });
}

module.exports = {
  createUser,
  getAllUsers,
  getUserByEmail,
  updateUser,
  deleteUser,
};
