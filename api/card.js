const express = require('express');
const router = express.Router();

const db = require('monk')(`mongodb+srv://grad:${process.env.DB_PASSWORD}@cluster0-4x7p6.gcp.mongodb.net/trello-clone?retryWrites=true&w=majority`);

const CardSchema = require('../schemas/CardSchema');

const cards = db.get('cards');

function sendError(res, code, message) {
    res.status(code).send(message);
}

router.get('/cards', (req, res) => {
    cards.find().then(cards => {
        res.json(cards);
    });
});

router.get('/cards/:id', (req, res) => {
    cards.find({ _id: req.params.id }).then(cards => {
        res.json(cards);
    });
});

router.get('/lists/:id/cards', (req, res) => {
    cards.find({ parentList: req.params.id }).then(cards => {
        res.json(cards);
    });
});

router.post('/cards', (req, res) => {
    const {error} = CardSchema.validate(req.body);

    if (!error) {
        cards.insert(req.body).then(newCard => {
            res.json(newCard);
        });
    } else {
        sendError(res, 400, error.details[0].message);
    }
});

router.patch('/cards/:id', (req, res) => {
    const {error} = CardSchema.validate(req.body);

    if (!error) {
        cards.update(
            {_id: req.params.id},
            {$set: {title: req.body.title, body: req.body.body}},
            (err, doc, next) => {
                if (!err) {
                    cards.find({_id: req.params.id}).then(card => {
                        res.json(card);
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

router.delete('/cards/:id', (req, res) => {
    cards.remove({_id: req.params.id}, err => {
        if (!err) {
            res.json({message: `Card with id ${req.params.id} successfully removed`});
        } else {
            sendError(res, 400, err);
        }
    });
});

module.exports = router;