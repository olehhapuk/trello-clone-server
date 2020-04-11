const express = require('express');
const router = express.Router();

const db = require('monk')(`mongodb+srv://grad:${process.env.DB_PASSWORD}@cluster0-4x7p6.gcp.mongodb.net/trello-clone?retryWrites=true&w=majority`);

const TableSchema = require('../schemas/TableSchema');

const tables = db.get('tables');

function sendError(res, code, message) {
    res.status(code).send(message);
}

router.get('/tables', (req, res) => {
    tables.find().then(tables => {
        res.json(tables);
    });
});

router.get('/tables/:id', (req, res) => {
    tables.find({ _id: req.params.id }).then(tables => {
        res.json(tables);
    });
});

router.post('/tables', (req, res) => {
    const {error} = TableSchema.validate(req.body);

    if (!error) {
        tables.insert(req.body).then(newTable => {
            res.json(newTable);
        });
    } else {
        sendError(res, 400, error.details[0].message);
    }
});

router.patch('/tables/:id', (req, res) => {
    const {error} = TableSchema.validate(req.body);

    if (!error) {
        tables.update(
            { _id: req.params.id },
            { $set: { title: req.body.title } },
            (err, doc, next) => {
                if (!err) {
                    tables.find({ _id: req.params.id }).then(table => {
                        res.json(table);
                    });
                } else {
                    sendError(res, 400, err);
                }
            }
        );
    } else {
        sendError(res, 400, error.details[0].message);
    }
});

router.delete('/tables/:id', (req, res) => {
    tables.remove({ _id: req.params.id }, err => {
        if (!err) {
            res.json({ message: `Table with id ${req.params.id} successfully removed` });
        } else {
            sendError(res, 400, err);
        }
    });
});

module.exports = router;