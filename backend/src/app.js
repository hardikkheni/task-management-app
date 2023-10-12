const path = require('path');
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const route = require('./routes');

const app = express();
app.use(
  cors({
    origin: '*',
    methods: ['OPTIONS', 'GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    allowedHeaders: '*',
  })
);
app.set('view engine', 'ejs');
app.set('views', path.resolve(__dirname, 'views'));
app.use(morgan('combined'));
app.use(route);

module.exports = app;
