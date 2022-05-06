const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const RegisterSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    valid: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

exports.registerModel = mongoose.model('sessions', RegisterSchema);