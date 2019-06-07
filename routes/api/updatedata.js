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
router.post('/editRecordSmetaSettings', async (req, res) => {
    const type = req.body.Type;
    const name = req.body.Name;
    const id = req.body.Id;

    if (type == 'ButRoom') {
        if (!name) {
            let fields = ['nameRoom'];
            res.json({ok: false, text: 'Заполните все поля', fields});
        } else {
            models.Rooms.findByIdAndUpdate(id, {Name: name})
            .then(() => {
                res.json({ok: true});
            })
            .catch(err => {
                res.json({ok: false, text: 'Сервер временно недоступен', err});
            });
        }
        
    } else if (type == 'ButType') {
        if (!name) {
            let fields = ['TypeJob'];
            res.json({ok: false, text: 'Заполните все поля', fields});
        } else {
            models.TypeJobs.findByIdAndUpdate(id, {Name: name})
            .then(() => {
                res.json({ok: true});
            })
            .catch(err => {
                res.json({ok: false, text: 'Сервер временно недоступен', err});
            });
        }
    } else if (type == 'ButObject') {
        if (!name) {
            let fields = ['Object'];
            res.json({ok: false, text: 'Заполните все поля', fields});
        } else {
            models.ObjectJobs.findByIdAndUpdate(id, {Name: name})
            .then(() => {
                res.json({ok: true});
            })
            .catch(err => {
                res.json({ok: false, text: 'Сервер временно недоступен', err});
            });
        }
    } else if (type == 'ButJob') {
        var unitme = req.body.UnitMe;
        var price = req.body.Price;

        if (!name || !price || price == '0' || unitme == 'Еденица измерения') {
            let fields = [];
            if (!name) fields.push('NameJob');
            if (!price || price == '0') fields.push('Price');
            if (unitme == 'Еденица измерения') fields.push('UnitMe');

            res.json({ok: false, text: 'Заполните все поля', fields});
        } else {
            models.JobItems.findByIdAndUpdate(id, {Name: name, Price: price, UnitMe: unitme})
            .then(() => {
                res.json({ok: true});
            })
            .catch(err => {
                res.json({ok: false, text: 'Сервер временно недоступен', err});
            });
        }
    } else {
        res.json({ok: false, text: 'Неизвестный запрос', err: 'ID кнопки не найден'});
    }
});

module.exports = router;