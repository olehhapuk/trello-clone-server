const express = require('express');
const app = express();

require('dotenv').config();

const volleyball = require('volleyball');
const cors = require('cors');

const api = require('./api/index');

const port = 5000;

app.use(express.json());
app.use(volleyball);
app.use(cors({ origin: 'http://localhost:3000' }));
app.use('/api', api);

app.listen(port, () => console.log(`Running on port ${port}`));