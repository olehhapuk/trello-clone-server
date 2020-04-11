const express = require('express');
const router = express.Router();

const db = require('monk')(`mongodb+srv://grad:${process.env.DB_PASSWORD}@cluster0-4x7p6.gcp.mongodb.net/trello-clone?retryWrites=true&w=majority`);

const ListSchema = require('../schemas/ListSchema');

const lists = db.get('lists');

function sendError(res, code, message) {
    res.status(code).send(message);
}

router.get('/lists', (req, res) => {
    lists.find().then(lists => {
        res.json(lists);
    });
});

router.get('/lists/:id', (req, res) => {
    lists.find({ _id: req.params.id }).then(lists => {
        res.json(lists);
    });
});

router.get('/tables/:id/lists', (req, res) => {
    lists.find({ parentTable: req.params.id }).then(lists => {
        res.json(lists);
    });
});

router.post('/lists', (req, res) => {
    const {error} = ListSchema.validate(req.body);

    if (!error) {
        lists.insert(req.body).then(newList => {
            res.json(newList);
        });
    } else {
        sendError(res, 400, error.details[0].message);
    }
});

router.patch('/lists/:id', (req, res) => {
    const {error} = ListSchema.validate(req.body);

    if (!error) {
        lists.update(
            { _id: req.params.id },
            { $set: { title: req.body.title } },
            (err, doc, next) => {
                if (!err) {
                    lists.find({ _id: req.params.id }).then(list => {
                        res.json(list);
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

router.delete('/lists/:id', (req, res) => {
    lists.remove({ _id: req.params.id }, err => {
        if (!err) {
            res.json({ message: `List with id ${req.params.id} successfully removed` });
        } else {
            sendError(res, 400, err);
        }
    });
});

module.exports = router;