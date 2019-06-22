const express = require('express');
const router = express.Router();
const models = require('../../models');


router.post('/UpdateSmeta', (req, res) => {
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
router.post('/RemoveJobsOfRooms', async (req, res) => {
    const job = req.body.job;
    const type = req.body.type;
    const object = req.body.object;
    const room = req.body.room;

    let roomDB = await models.Architecture.findOne({NameRoom: room}, {Room: 1});
    if (roomDB) {
        let obj = roomDB.Room;
        let jobs = obj[type][object];
        let newJobs = [];
        for (let i=0; i < jobs.length; i++) {
            if (jobs[i].Name != job) {
                newJobs.push(jobs[i]);
            }
        }
        obj[type][object] = newJobs;
        try {
            await models.Architecture.findOneAndUpdate({NameRoom: room}, {Room: obj});
            res.json({ok: true});
        } catch(e) {
            console.log(e);
            res.json({ok: false, text: 'Сервер временно недоступен', err: e});
        }
    } else {
        res.json({ok: false, text: 'Сообщите администратору, срочно!!!', err: 'Удаляемой комнаты не существует'});
    }

});
// eslint-disable-next-line node/no-unsupported-features/es-syntax
router.post('/AppendJobsInRooms', async (req, res) => {
    const job = req.body.job;
    const type = req.body.type;
    const object = req.body.object;
    const room = req.body.room;

    let roomDB = await models.Architecture.findOne({NameRoom: room}, {Room: 1});
    if (roomDB) {
        let jobDB = await models.JobItems.findOne({Name: job});
        let obj = roomDB.Room;
        if (type in obj) {
            if (object in obj) {
                obj[type][object].push({
                    Name: job,
                    UnitMe: jobDB.UnitMe,
                    Price: jobDB.Price,
                    Formula: jobDB.Formula
                })
            } else {
                obj[type][object] = [{
                    Name: job,
                    UnitMe: jobDB.UnitMe,
                    Price: jobDB.Price,
                    Formula: jobDB.Formula
                }];
            }
        } else {
            obj[type] = {};
            obj[type][object] = [{
                Name: job,
                UnitMe: jobDB.UnitMe,
                Price: jobDB.Price,
                Formula: jobDB.Formula
            }]
        }
        try {
            await models.Architecture.findOneAndUpdate({NameRoom: room}, {Room: obj});
            res.json({ok: true});
        } catch(e) {
            console.log(e);
            res.json({ok: false, text: 'Сервер временно недоступен', err: e});
        }
    } else {
        let jobDB = await models.JobItems.findOne({Name: job});
        let obj = {};
        obj[type] = {};
        obj[type][object] = [{
            Name: job,
            UnitMe: jobDB.UnitMe,
            Price: jobDB.Price,
            Formula: jobDB.Formula
        }];
        try {
            await models.Architecture.create({
                Status: true,
                NameRoom: room,
                Room: obj
            });
            res.json({ok: true});
        } catch(e) {
            console.log(e);
            res.json({ok: false, text: 'Сервер временно недоступен', err: e});
        }
    }

});
router.post('/CleadAllTable', async (req, res) => {
    try {
        await models.Architecture.remove();
        await models.Documents.remove();
        await models.JobItems.remove();
        await models.ObjectJobs.remove();
        await models.TypeJobs.remove();
        await models.Rooms.remove();
        res.json({ok: true});
    } catch (e) {
        console.log(e);
        res.json({ok: false, text: 'Сервер временно недоступен', err: e});
    }
});

module.exports = router;