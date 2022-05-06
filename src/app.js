const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('../swagger.json');
const consola = require('consola');

const { connectDB } = require('./utils/db.connect.utils');
const deserializeUser = require('./middleware/deserializeUser.middleware');

connectDB()
  .then(() => consola.info(`database connected!!!`))
  .catch((error) => consola.error(error.message));

const app = express();
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(deserializeUser);

app.use('/api/v1/acronym', require('./routes/acronym.routes'));
app.use('/api/v1/user', require('./routes/acronym.routes'));
app.use(
  '/api/v1/documentation',
  swaggerUi.serve,
  swaggerUi.setup(swaggerDocument)
);

app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(404);
});

app.use((err, req, res, next) =>
  res.status(err.statusCode || 500).send({
    success: false,
    message: err.message,
  })
);

module.exports = app;
