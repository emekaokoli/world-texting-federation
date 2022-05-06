const Acronym = require('../models/acronym.model');

const getAll = async () => {
  const count = await Acronym.find({}).count();
  const result = await Acronym.find({});
  return {
    count,
    result,
  };
};

const postAccronym = async (acronym) => await Acronym.create(acronym);

const getOneAccronymById = async (id) =>
  await Acronym.findById(id).exec();

const deleteOneAccronymById = async (id) =>
  await Acronym.findByIdAndDelete(id).exec();

const updateOneAccronymById = async (id, requestBody) => {
  return await Acronym.findByIdAndUpdate(id, requestBody).exec();
};

module.exports = {
  getAll,
  postAccronym,
  getOneAccronymById,
  deleteOneAccronymById,
  updateOneAccronymById,
};
