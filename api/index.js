const express = require('express');
const app = express();

const card = require('./card');
const list = require('./list');
const table = require('./table');

app.use(card);
app.use(list);
app.use(table);

module.exports = app;