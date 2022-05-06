const bcrypt = require('bcrypt');

const { userModel } = require('../models/user.model');

exports.createUser = async (input) => await userModel.create(input);

exports.validatePassword = async ({ email, password }) => {
  const existingUser = await userModel.findOne({ email });
  const isValid = await bcrypt.compareSync(
    password,
    existingUser.password
  );
  return {
    existingUser,
    isValid,
  };
};
exports.findUser = async (query) => await userModel.find(query).exec();

exports.findUserById = async (id) =>
  await userModel.findById(id).exec();
