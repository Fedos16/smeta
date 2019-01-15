const express = require('express');
const router = express.Router();
const path = require('path');
const models = require('../../models');
const Sharp = require('sharp');
const multer = require('multer');
const mkdirp = require('mkdirp');
const fs = require('fs');

var Excel = require('exceljs');

const bcrypt = require('bcrypt-nodejs');

const config = require('../../config');
const diskStorage = require('../../utils/diskStorage');

const rs = () =>
  Math.random()
    .toString(36)
    .slice(-3);

var storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const dir = '/' + rs();
        req.dir = dir;

        mkdirp(config.DESTINATION + dir, err => cb(err, config.DESTINATION + dir));
        // cd(null, config.DESTINATION + dir);
    },
    filename: function (req, file, cb) {
        let ext = ''; // set default extension (if any)
        if (file.originalname.split(".").length>1) // checking if there is an extension or not.
            ext = file.originalname.substring(file.originalname.lastIndexOf('.'), file.originalname.length);
        cb(null, Date.now() + ext)
    }
})
var upload = multer({ storage: storage });

// SAVE IMAGE
router.post('/saveexcel', upload.single("file"), async (req, res) => {

    var filename = path.join(__dirname, req.file.path)
    res.json({ok: true, path: req.file.path});

});
router.post('/savedatafromexcel', async (req, res) => {
    const path_s = req.body.path;

    var filename = path.join(appRoot, path_s);
    var workbook = new Excel.Workbook();
    var data = await workbook.xlsx.readFile(filename);

    var arr = [];
    var rooms = [];
    var categories = {};
    var subcategories = {};
    var jobsDB = [];

    var worksheet = workbook.getWorksheet(data.worksheets[0].name); 
    worksheet.eachRow({ includeEmpty: true }, function(row, rowNumber) { 
        arr.push(row.values);
        if (row.values[8] != null){
            rooms.push({
                Name: row.values[9].charAt(0).toUpperCase() + row.values[9].substring(1),
                Number: row.values[8],
                Status: true
            });
        } else if (row.values[3] != null && row.values[4] != null){
            // Категория
            try{
                var value = row.values[3].richText[0].text;
            } catch(e) {
                var value = row.values[3];
            }
            // Комната
            try{
                var room_v = String(row.values[5].richText[0].text).split(',').join('.').split('.');
            } catch(e){
                var room_v = String(row.values[5]).split(',').join('.').split('.');
            }
            // Количество для Категорий
            try{
                var colvo = categories[value].col+1;
            } catch(e) {
                var colvo = 1;
            }
            // Команты для Категорий
            try{
                var arrRoom = categories[value].room;
                for (var x=0; x < room_v.length; x++){
                    if (arrRoom.indexOf(room_v[x]) == -1 && String(room_v[x]).length <= 2){
                        arrRoom.push(room_v[x]);
                    }
                }
            } catch(e) {
                var arrRoom = room_v;
            }

            //Подкатегория
            try{
                var subcategory = row.values[4].richText[0].text;
            } catch(e){
                var subcategory = row.values[4];
            }
            //Категория
            try{
                var category = row.values[3].richText[0].text;
            } catch(e){
                var category = row.values[3];
            }
            // Количество для Подкатегорий
            try{
                var colSubcat = subcategories[subcategory].col+1;
            } catch(e) {
                var colSubcat = 1;
            }
            // Команты для Подкатегорий
            try{
                if (Object.keys(subcategories).indexOf(subcategory) != -1){
                    var arrRoomSub = subcategories[subcategory].room;
                    for (var x=0; x < room_v.length; x++){
                        if (arrRoomSub.indexOf(room_v[x]) == -1 && String(room_v[x]).length <= 2){
                            arrRoomSub.push(room_v[x]);
                        }
                    }
                }
            } catch(e) {
                var arrRoomSub = room_v;
            }
            //console.log(subcategory + " = " + arrRoomSub.join(', '));
            // Категории для Подкатегорий
            try{
                var arrCat = subcategories[subcategory].category;
                if (arrCat.indexOf(category) == -1){
                    arrCat.push(category);
                }
            } catch(e) {
                var arrCat = [category];
            }

            categories[value] = {
                col: colvo,
                room: arrRoom
            }
            subcategories[subcategory] = {
                col: colSubcat,
                room: arrRoomSub,
                category: arrCat
            }

            if (row.values[6] != null || row.values[6] != "цена"){
                // Название работ
                try{
                    var job_j = row.values[1].richText[0].text;
                } catch(e){
                    var job_j = row.values[1];
                }
                // Категория
                try{
                    var value_j = row.values[3].richText[0].text;
                } catch(e) {
                    var value_j = row.values[3];
                }
                // Комната
                try{
                    var room_v_j = String(row.values[5].richText[0].text).split(',');
                } catch(e){
                    var room_v_j = String(row.values[5]).split(',');
                }
                //Подкатегория
                try{
                    var subcategory_j = row.values[4].richText[0].text;
                } catch(e){
                    var subcategory_j = row.values[4];
                }
                // Единица измерения
                try{
                    var unit_j = row.values[2].richText[0].text;
                } catch(e){
                    var unit_j = row.values[2];
                }
                // Цена
                try{
                    var price = row.values[6].result;
                } catch(e){
                    var price = row.values[6];
                }

                if (job_j != value_j) {

                    jobsDB.push({
                        Name: job_j, 
                        Categories: value_j,
                        SubCategories: subcategory_j,
                        RoomNumber: room_v,
                        Price: price,
                        UnitMe: unit_j
                    });

                }
            }
        }
    });

    var categoriesDB = [];
    var subcategoriesDB = [];

    Object.keys(categories).map(cat => {
        if (categories[cat].col == 1 || cat.length > 30){
            delete categories[cat];
        } else {
            categoriesDB.push({
                Name: cat,
                RoomNumber: categories[cat].room
            });
        }
    })
    Object.keys(subcategories).map(sub => {
        if (subcategories[sub].col == 1 || sub.length > 45){
            delete subcategories[sub];
        } else {
            subcategoriesDB.push({
                Name: sub,
                Categories: subcategories[sub].category,
                RoomNumber: subcategories[sub].room
            });
        }
    })

    await models.Rooms.remove();
    models.Rooms.insertMany(rooms)
    .catch(err => {
        res.json({ok: false, text: 'Ошибка записи Комнат'});
    });

    await models.Categories.remove();
    models.Categories.insertMany(categoriesDB)
    .catch(err => {
        res.json({ok: false, text: 'Ошибка записи Категорий'});
    })

    await models.Subcategories.remove();
    models.Subcategories.insertMany(subcategoriesDB)
    .catch(err => {
        res.json({ok: false, text: 'Ошибка записи Подкатегорий'});
    })

    await models.JobItems.remove();
    models.JobItems.insertMany(jobsDB)
    .catch(err => {
        res.json({ok: false, text: 'Ошибка записи Наименований работ'});
    });

    res.json({ok: true, text: "Данные загружены!", data: jobsDB});

})
router.post('/newpeople', async (req, res) => {
    const fio = req.body.fio;
    var numberFio = req.body.numberFio;
    const telephone = req.body.telephone;
    const birthday = req.body.birthday;
    const typePeople = req.body.typePeople;
    const status = req.body.status;
    const login = req.body.login;
    const password = req.body.password;

    var fields = [];

    var login_in_bd = await models.User.findOne({login});

    if (!fio || !telephone || !birthday || !login || !password){
        if (!fio) fields.push('fio')
        if (!telephone) fields.push('telephone')
        if (!birthday) fields.push('birthday')
        if (!login) fields.push('login_sm')
        if (!password) fields.push('password_sm');

        res.json({ok: false, text: 'Не все поля заполнены', fields});

    } else if (password.length < 5){
        fields.push('password_sm');
        res.json({ok: false, text: 'Длинна пароля должна быть не менее 5 символов', fields});
    } else if (typePeople == 'Тип сметчика'){
        fields.push('typePeople');
        res.json({ok: false, text: 'Нужно указать тип сметчика', fields});
    } else if (login_in_bd){
        fields.push('login_sm');
        res.json({ok: false, text: 'Пользователь с указанным логином уже существует', fields});
    }
     else {

        if (numberFio == 'Номер'){
            numberFio = '';
        }

        try {
            await models.People.create({
                fio,
                numberFio,
                telephone,
                birthday,
                typePeople,
                status
            });
        } catch (e) {
            res.json({ok: false, text: 'Сервер временно не доступен', fields});
        }

        try{
            bcrypt.hash(password, null, null, async (err, hash) => {
                await models.User.create({
                    login,
                    password: hash,
                    typeUser: 'User',
                    status: true
                })
            });
        } catch(e) {
            res.json({ok: false, text: 'Сервер временно не доступен', fields});
        }

        res.json({ok: true, text: 'Данные сохранены!'});
    }
});
router.post('/newdocument', (req, res) => {
    const id = req.body.id;
    const dateCreated = req.body.dateCreated;
    const adress = req.body.adress;
    const name = req.body.name;
    const phone = req.body.phone;

    var fields = [];

    if (!id || !dateCreated || !adress || !name || !phone){

        if (!id) fields.push('idObject');
        if (!dateCreated) fields.push('dateCreateSmeta');
        if (!adress) fields.push('adressObject');
        if (!name) fields.push('nameClient');
        if (!phone) fields.push('phoneClient');

        res.json({ok: false, text: 'Не все поля заполнены!', fields});
    }

    models.Documents.create({
        IdObject: id,
        AddressObject: adress,
        DateCreate: dateCreated,
        NameClient: name,
        Telephone: phone,
        Estimator: req.session.userLogin,

    })
    .then(doc => {
        res.json({ ok: true, text: 'Данные успешно сохранены', data:doc._id});
    })
    .catch(err => {
        res.json({ ok: false, text: 'Ошибка, попробуйте позже!', fields});
    })
});

module.exports = router;