const express = require('express');
const router = express.Router();

const models = require('../../models');

router.post('/allpeople', (req, res) => {
    models.People.find({}, {fio: 1, telephone: 1, typePeople: 1, status: 1, numberFio: 1})
    .then(p => {
        res.json({ok: true, data: p});
    })
    .catch(e => {
        res.json({ok: false, text: 'Сервер временно недоступен!'});
    });
});
router.post('/findjobs', (req, res) => {
    const subcategory = req.body.subcategory;
    const category = req.body.category;
    const numRoom = req.body.numRoom;

    models.JobItems.find( { $and: [{SubCategories: { "$in": [subcategory] }}, {Categories: { "$in": [category] }}, {RoomNumber: { "$in": [numRoom] }}]}, {Name: 1, Price: 1, UnitMe: 1, } )
    .then(oks => {
        res.json({ok: true, data: oks});
    })
    .catch(err => {
        res.json({ok: false});
    });
});
router.post('/findItemsJobs', (req, res) => {
    models.JobItems.find()
    .then(data => {
        res.json({ok: true, data});
    })
    .catch(err => {
        console.log(err);
        res.json({ok: false, text: 'Сервер временно недоступен', err})
    });
});
router.post('/findAllRooms', (req, res) => {
    models.Rooms.find()
    .then(data => {
        res.json({ok: true, data});
    })
    .catch(err => {
        console.log(err);
        res.json({ok: false, text: 'Сервер временно недоступен', err})
    });
});
router.post('/findAllTypeJobs', (req, res) => {
    models.TypeJobs.find()
    .then(data => {
        res.json({ok: true, data});
    })
    .catch(err => {
        console.log(err);
        res.json({ok: false, text: 'Сервер временно недоступен', err})
    });
});
router.post('/findAllObjectsJob', (req, res) => {
    models.ObjectJobs.find()
    .then(data => {
        res.json({ok: true, data});
    })
    .catch(err => {
        console.log(err);
        res.json({ok: false, text: 'Сервер временно недоступен', err})
    });
})
router.post('/getArchitecture', (req, res) => {
    models.Architecture.find()
    .then(async data => {
        let rooms = await models.Rooms.find({Status: true});
        res.json({ok: true, data, rooms});
    })
    .catch(err => {
        console.log(err);
        res.json({ok: false, text: 'Сервер временно недоступен', err})
    });
})

router.post('/findRoomById', (req, res) => {
    const id = req.body.id;

    models.Rooms.findById(id, {Name: 1})
    .then(val => {
        res.json({ok: true, data: val});
    })
    .catch(err => {
        res.json({ok: false, text: 'Сервер временно недоступен', error: err});
    });
});
router.post('/findTypeJobById', (req, res) => {
    const id = req.body.id;

    models.TypeJobs.findById(id, {Name: 1})
    .then(val => {
        res.json({ok: true, data: val});
    })
    .catch(err => {
        res.json({ok: false, text: 'Сервер временно недоступен', error: err});
    });
});
router.post('/findObjectById', (req, res) => {
    const id = req.body.id;

    models.ObjectJobs.findById(id, {Name: 1})
    .then(val => {
        res.json({ok: true, data: val});
    })
    .catch(err => {
        res.json({ok: false, text: 'Сервер временно недоступен', error: err});
    });
});
router.post('/findNameJobById', (req, res) => {
    const id = req.body.id;

    models.JobItems.findById(id, {Name: 1, Price: 1, UnitMe: 1})
    .then(val => {
        res.json({ok: true, data: val});
    })
    .catch(err => {
        res.json({ok: false, text: 'Сервер временно недоступен', error: err});
    });
});
router.post('/findTypeJobsArch', (req, res) => {
    const type = req.body.type;

    models.Architecture.find({NameRoom: type}, {Room: 1})
    .then(arch => {
        res.json({ok: true, data: arch});
    })
    .catch(err => {
        console.log(err);
        res.json({ok: false});
    });
});

module.exports = router;