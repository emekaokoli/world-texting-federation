const express = require('express');
const {
  handleGet,
  handlePost,
  handleGetById,
  handleDeleteById,
  handleUpdate,
  handleGeById,
} = require('../controllers/acronym.controller');
const {
  validateRequestBody,
  validateId,
  validateAuth,
  validateRegister,
} = require('../middleware/validate.middleware');
const requireUser = require('../middleware/requireUser.middleware');
const {
  userSessionHandler,
  userRegisterHandler,
} = require('../controllers/register.controller');
const { handleCreateUser } = require('../controllers/user.controller');

const router = express.Router();

router
  .route('/')
  .get(handleGet)
  .post(validateRequestBody, requireUser, handlePost);

router
  .route('/session')
  .post(validateAuth, userSessionHandler);
router
 .route('/login')
 .post(validateAuth, handleCreateUser);
router
 .route('/register')
 .post(validateRegister, userRegisterHandler);

router
  .route('/:acronym')
  .get(validateId,requireUser, handleGeById)
  .delete(validateId, requireUser, handleDeleteById)
  .patch(validateId, handleUpdate);

module.exports = router;
