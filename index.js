const express = require('express');
const app = express();

require('dotenv').config();

const volleyball = require('volleyball');
const cors = require('cors');

const api = require('./api');

const db = require('monk')(`mongodb+srv://grad:${process.env.DB_PASSWORD}>@cluster0-4x7p6.gcp.mongodb.net/trello-clone?retryWrites=true&w=majority`);

app.use(express.json());
app.use(volleyball);
app.use(cors({ origin: 'http://localhost:3000' }));
app.use('/api', api);

const port = 5000;
app.listen(port, () => console.log(`Running on port ${port}`));