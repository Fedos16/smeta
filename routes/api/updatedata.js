const express = require('express');
const router = express.Router();
const models = require('../../models');


router.post('/rooms', (req, res) => {
    const id = req.body.id;
    const data = req.body.data;

    models.Documents.findByIdAndUpdate(id, {Rooms: data})
    .then(ok => {
        res.json({ok: true});
    })
    .catch(err => {
        res.json({ok: false, text: "Попробуйте позже!"});
    })
});


module.exports = router;