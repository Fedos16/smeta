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
router.post('/findcategories', async (req, res) => {
    const numRoom = req.body.numRoom;

    var obj = {};

    var categories = await models.Categories.find({RoomNumber: { "$in": [numRoom] }});
    for (var i=0; i < categories.length; i++) {
        var subcat = await models.Subcategories.find( { $and: [ {Categories: { "$in": [categories[i].Name] }}, {RoomNumber: { "$in": [numRoom] }} ]});
        console.log(subcat);
        var arr = [];
        for (var x=0; x < subcat.length; x++){
            arr.push(subcat[x].Name);
        }
        obj[categories[i].Name] = {
            name: arr
        }
    }
    res.json({ok: true, data: obj});
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

module.exports = router;