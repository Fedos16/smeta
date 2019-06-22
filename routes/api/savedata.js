/* eslint-disable no-unused-vars */
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

// SAVE EXCEL
// eslint-disable-next-line node/no-unsupported-features/es-syntax
router.post('/saveexcel', upload.single("file"), async (req, res) => {

    var filename = path.join(__dirname, req.file.path)
    res.json({ok: true, path: req.file.path});

});
// eslint-disable-next-line node/no-unsupported-features/es-syntax
router.post('/savedatafromexcel', async (req, res) => {
    const path_s = req.body.path;

    var filename = path.join(appRoot, path_s);
    var workbook = new Excel.Workbook();
    var data = await workbook.xlsx.readFile(filename);

    let nameRooms = {
        '1': 'Комната',
        '2': 'Ванная',
        '3': 'Туалет',
        '4': 'Кухня',
        '5': 'Коридор',
        '6': 'Электрика',
        '7': 'Лоджия/балкон',
        '8': 'Спец. монтаж'
    }

    let arrItemJob = [];
    let arrRooms = [];
    let arrTypeJobs = [];
    let arrObjectJobs = [];
    let arrArch = [];

    let arch = {};

    let objRooms = {};
    let objTypeJobs = {};
    let objObjectJobs = {};

    var worksheet = workbook.getWorksheet(data.worksheets[0].name); 
    worksheet.eachRow({ includeEmpty: true }, function(row, rowNumber) {
        
        // Наименование работ
        try{
            var job_j = row.values[1].richText[0].text;
        } catch(e){
            var job_j = row.values[1];
        }
        // Еденица измерения
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
        // Тип работ
        try{
            var type_j = String(row.values[3].richText[0].text).replace('  ', ' ');
        } catch(e){
            var type_j = String(row.values[3]).replace('  ', ' ');
        }
        // Объект работ
        try{
            var obj_j = row.values[4].richText[0].text;
        } catch(e){
            var obj_j = row.values[4];
        }
        // Буква для формулы расчета
        try {
            var letter = row.values[7].richText[0].text;
        } catch (e) {
            var letter = row.values[7];
        }
        // Номера комнат
        try{
            var room_j = String(row.values[9].richText[0].text).charAt(0).toUpperCase() + String(row.values[9].richText[0].text).substr(1);
        } catch(e){
            var room_j = String(row.values[9]).charAt(0).toUpperCase() + String(row.values[9]).substr(1);
        }
        // Комнаты в которые входит наименование работ
        try {
            var arrRoom_j = row.values[5].richText[0].text;
        } catch(e) {
            // eslint-disable-next-line no-redeclare
            var arrRoom_j = row.values[5];
        }

        if (job_j != null && unit_j != null && price != null && price != "цена" && arrRoom_j != null) {
            objTypeJobs[type_j] = true;
            objObjectJobs[obj_j] = true;

            let formula = 'unknown';
            if (letter == 'а' || letter == 'a' || String(letter).charAt(0) == 'a' || String(letter).charAt(0) == 'а') {
                formula = 'floorArea';
            } else if (letter == 'б') {
                formula = 'wallArea';
            } else if (letter == 'в') {
                formula = 'perimetr';
            } else if (String(letter).indexOf('г') != -1) {
                formula = String(letter).split(' ')[1];
            }

            arrItemJob.push({
                Name: job_j,
                Price: price,
                UnitMe: unit_j,
                Formula: formula,
                Status: true
            });
            

            let arrs = String(arrRoom_j).split(',');
            if (String(arrRoom_j).indexOf('.') != -1) {
                arrs = String(arrRoom_j).split('.');
            }
            for (let z = 0; z < arrs.length; z++) {
                if (arrs[z].length > 1) {
                    console.log(arrs);
                }
                let Name = nameRooms[arrs[z]];
                if (Name in arch) {
                    if (type_j in arch[Name]) {
                        if (obj_j in arch[Name][type_j]) {
                            arch[Name][type_j][obj_j].push({
                                Name: job_j,
                                UnitMe: unit_j,
                                Price: price,
                                Formula: formula
                            });
                        } else {
                            arch[Name][type_j][obj_j] = [{
                                Name: job_j,
                                UnitMe: unit_j,
                                Price: price,
                                Formula: formula
                            }];
                        }
                    } else {
                        arch[Name][type_j] = {};
                        arch[Name][type_j][obj_j] = [{
                            Name: job_j,
                            UnitMe: unit_j,
                            Price: price,
                            Formula: formula
                        }];
                    }
                } else {
                    arch[Name] = {};
                    arch[Name][type_j] = {};
                    arch[Name][type_j][obj_j] = [{
                        Name: job_j,
                        UnitMe: unit_j,
                        Price: price,
                        Formula: formula
                    }];
                }
            }

        }

        if (room_j != null && room_j != 'Undefined') {
            objRooms[room_j] = true;
        }

    });

    let obj = Object.keys(objRooms);
    for (let x=0; x < obj.length; x++) {
        arrRooms.push({
            Name: obj[x],
            Status: true
        });
    }
    obj = Object.keys(objTypeJobs);
    for (let x=0; x < obj.length; x++) {
        arrTypeJobs.push({
            Name: obj[x],
            Status: true
        });
    }
    obj = Object.keys(objObjectJobs);
    for (let x=0; x < obj.length; x++) {
        arrObjectJobs.push({
            Name: obj[x],
            Status: true
        });
    }
    obj = Object.keys(arch);
    for (let x=0; x < obj.length; x++) {
        arrArch.push({
            NameRoom: obj[x],
            Room: arch[obj[x]],
            Status: true
        })
    }

    try {
        await models.JobItems.remove();
        await models.Rooms.remove();
        await models.TypeJobs.remove();
        await models.ObjectJobs.remove();
        await models.Architecture.remove();
    } catch (err) {
        console.log('---------- ОШИБКА ОЧИСТКИ БД ----------');
        console.log(err);
        res.json({ok: false, text: 'Сервер временно недоступен'});
    }

    try {
        await models.JobItems.insertMany(arrItemJob);
        await models.Rooms.insertMany(arrRooms);
        await models.TypeJobs.insertMany(arrTypeJobs);
        await models.ObjectJobs.insertMany(arrObjectJobs);
        await models.Architecture.insertMany(arrArch);

    } catch (err) {
        console.log('---------- ОШИБКА ЗАПИСИ В БД ----------');
        console.log(err);
        res.json({ok: false, text: 'Сервер временно недоступен'});
    }

    res.json({ok: true, text: "Данные загружены!"});

});
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
    } else {
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
            console.log(err);
            res.json({ ok: false, text: 'Ошибка, попробуйте позже!', fields});
        })
    }
});
router.post('/saveNewRecordSmetaSettings', async (req, res) => {
    const type = req.body.Type;
    const name = req.body.Name;

    if (type == 'ButRoom') {
        if (!name) {
            let fields = ['nameRoom'];
            res.json({ok: false, text: 'Заполните все поля', fields});
        } else {
            var lastName = await models.Rooms.findOne({Name: name});
            if (lastName) {
                let fields = ['nameRoom'];
                res.json({ok: false, text: 'Комната уже существует', err: 'Нет описания', fields});
                return;
            } else {
                try {
                    await models.Rooms.create({Name: name, Status: true});
                    res.json({ok: true});
                    return;
                } catch (e) {
                    console.log(err);
                    res.json({ok: false, text: 'Сервер временно недоступен', err});
                }
            }
        }
    } else if (type == 'ButType') {
        if (!name) {
            let fields = ['TypeJob'];
            res.json({ok: false, text: 'Заполните все поля', fields});
        } else {
            var lastType = await models.TypeJobs.findOne({Name: name});
            if (lastType) {
                let fields = ['TypeJob'];
                res.json({ok: false, text: 'Такой тип работ уже существует', err: 'Нет описания', fields});
                return;
            } else {
                try {
                    await models.TypeJobs.create({Name: name, Status: true});
                    res.json({ok: true});
                    return;
                } catch (e) {
                    console.log(err);
                    res.json({ok: false, text: 'Сервер временно недоступен', err});
                }
            }
        }
    } else if (type == 'ButObject') {
        if (!name) {
            let fields = ['Object'];
            res.json({ok: false, text: 'Заполните все поля', fields});
        } else {
            var lastObject = await models.ObjectJobs.findOne({Name: name});
            if (lastObject) {
                let fields = ['Object'];
                res.json({ok: false, text: 'Такой объект работ уже существует', err: 'Нет описания', fields});
                return;
            } else {
                try {
                    await models.ObjectJobs.create({Name: name, Status: true});
                    res.json({ok: true});
                    return;
                } catch (e) {
                    console.log(err);
                    res.json({ok: false, text: 'Сервер временно недоступен', err});
                }
            }
        }
    } else if (type == 'ButJob') {
        var unitme = req.body.UnitMe;
        var price = req.body.Price;

        if (!name || !price || price == '0' || unitme == 'Единица измерения') {
            let fields = [];
            if (!name) fields.push('NameJob');
            if (!price || price == '0') fields.push('Price');
            if (unitme == 'Единица измерения') fields.push('UnitMe');

            res.json({ok: false, text: 'Заполните все поля', fields});
        } else {
            var lastJobs = await models.JobItems.findOne({Name: name});
            if (lastJobs) {
                let fields = ['NameJob'];
                res.json({ok: false, text: 'Такой объект работ уже существует', err: 'Нет описания', fields});
                return;
            } else {
                try {
                    await models.JobItems.create({Name: name, Price: price, UnitMe: unitme, Status: true});
                    res.json({ok: true});
                    return;
                } catch (e) {
                    console.log(err);
                    res.json({ok: false, text: 'Сервер временно недоступен', err});
                }
            }
        }
    } else {
        res.json({ok: false, text: 'Неизвестный запрос', err: 'ID кнопки не найден'});
    }
});

module.exports = router;