const { registerModel } = require('../models/register.model');
const { userModel } = require('../models/user.model');

exports.createUserSession = async (userId) =>
  await registerModel.create({ user: userId });

exports.createUserAccount = async (input) =>
  await userModel.create(input);

exports.deleteUserAccountById = async (id) =>
  await Acronym.findByIdAndDelete(id).exec();

exports.findRegUser = async (query) => userModel.exists(query);
exports.findUserById = async (id) =>
  await userModel.findById(id).exec();
