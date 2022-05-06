const createError = require('http-errors');
const {
  getAll,
  postAccronym,
  getOneAccronymById,
  deleteOneAccronymById,
  updateOneAccronymById,
} = require('../services/acronym.service');
const { findUserById } = require('../services/user.service');

const handleGet = async (req, res, next) => {
  const { symbolName } = req.body;
  const { from, limit } = req.query;
  const pageNumber = parseInt(from, 10) || 1;
  const limitNumber = parseInt(limit, 10) || 10;
  const startIndex = (pageNumber - 1) * limitNumber;
  const endIndex = pageNumber * limitNumber;

  try {
    const { result: dbResult, count } = await getAll();

    const result = {};

    if (endIndex < count) {
      result.next = {
        from: from + 1,
        limit: limit,
      };
    }

    if (startIndex > 0) {
      result.previous = {
        from: from - 1,
        limit: limit,
      };
    }
    const results = dbResult.slice(startIndex, endIndex) || [];
    if (symbolName) {
      result.results =
        results.filter(
          (acronym) => acronym.symbolName === symbolName
        ) || [];
    }

    res.set({
      'Access-Control-Expose-Headers': 'Content-Range',
      'Content-Range': `X-Total-Count: ${startIndex + 1} - ${
        endIndex > count ? count : endIndex
      } / ${count}`,
    });

    return res.status(200).send({
      success: true,
      data: results,
    });
  } catch (error) {
    return next(error);
  }
};

const handlePost = async (req, res, next) => {
  const body = req.body;
  let user = req.user;

  const payload = {
    ...body,
    user: req.user,
  };

  try {
    const results = await postAccronym({ ...payload });
    return res.status(201).send({
      success: true,
      message: 'post success',
      data: results,
    });
  } catch (error) {
    return next(error);
  }
};

const handleGeById = async (req, res, next) => {
  const { acronym } = req.params;

  try {
    const results = await getOneAccronymById(acronym);
    if (!results) {
      return next(createError(404, 'id not found'));
    }
    return res.status(200).send({
      success: true,
      data: results,
    });
  } catch (error) {
    return next(error);
  }
};

const handleDeleteById = async (req, res, next) => {
  const acronymId = req.params.acronym;
  const userId = req.user._id;

  try {
    const symbols = await findUserById(acronymId);
    if (!symbols) {
      return next(createError(404, 'id not found'));
    }
    if (symbols.user !== userId) {
      return next(
        createError(
          403,
          'Unauthorized, you can only delete acronym you created'
        )
      );
    }

    const results = await deleteOneAccronymById({ _id: acronym._id });

    res.status(200).send({
      success: true,
      data: results,
    });
  } catch (error) {
    return next(error);
  }
};

const handleUpdate = async (req, res, next) => {
  const { acronym } = req.params;
  const { _id } = res.locals.user;
  const { symbolName, description } = req.body;

  try {
    const symbols = await findUserById({ acronym });
    if (!results) {
      return next(createError(404, 'id not found'));
    }

    if (symbols.user !== userId) {
      return next(
        createError(
          403,
          'Unauthorized user, you can only update acronym you created'
        )
      );
    }
    const results = await updateOneAccronymById(
      id,
      {
        $set: {
          symbolName,
          description,
        },
      },
      { new: true }
    );

    return res.status(200).send({
      success: true,
      data: results,
    });
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  handleGet,
  handlePost,
  handleGeById,
  handleDeleteById,
  handleUpdate,
};
