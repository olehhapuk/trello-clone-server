const router = require('express').Router();

const card = require('./card');
const list = require('./list');
const table = require('./table');

router.use(card);
router.use(list);
router.use(table);

module.exports = router;