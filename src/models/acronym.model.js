const joi = require('joi');
const mongoose = require('mongoose');

const { Schema } = mongoose;

const AcronymSchema = new Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  symbolName: {
    type: String,
    required: [true, 'Name is required'],
    minlength: 1,
    unique: true,
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    minlength: 1,
  },
});

const Acronym = mongoose.model('Accronym', AcronymSchema);

module.exports = Acronym;
