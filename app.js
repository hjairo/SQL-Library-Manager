// Packages and routes required
const express = require('express');
const path = require('path');
const { pageErrorHandler, globalHandler } = require('./errorHandlers');
const indexRouter = require('./routes/index');
const bookRouter = require('./routes/books');
const db = require('./models');
const sequelize = db.sequelize;
const app = express();

// Engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use('/static', express.static('public'));
app.use('/', indexRouter);
app.use('/', bookRouter);
app.use(pageErrorHandler);
app.use(globalHandler);

// Testing database connection
(async () => {
  try {
    await sequelize.authenticate();
    console.log('Clickity clackity database connection is happening');
  } catch (err) {
    console.error('Error connecting to the database: ', err);
  }
})();

module.exports = app;