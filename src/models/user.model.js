const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const UserSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      minlength: 1,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
  },
  {
    timestamps: true,
  }
);

UserSchema.pre('save', async function (next) {
  const user = this;
  try {
    if (!user.isModified('password')) {
      return next();
    }
    const salt = await bcrypt.genSaltSync(10);
    const hashedPassword = await bcrypt.hashSync(user.password, salt);
    user.password = hashedPassword;

    return next();
  } catch (error) {
    next(error);
  }
});

const userModel = mongoose.model('User', UserSchema);

module.exports = { userModel };
