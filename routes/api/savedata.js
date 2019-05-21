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

    var worksheet = workbook.getWorksheet(data.worksheets[0].name); 
    worksheet.eachRow({ includeEmpty: true }, function(row, rowNumber) {
        
        try{
            var job_j = row.values[1].richText[0].text;
        } catch(e){
            var job_j = row.values[1];
        }
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

        if (job_j != null && unit_j != null && price != null && price != "цена") {
            arr.push({
                Name: job_j,
                Price: price,
                UnitMe: unit_j,
                Status: true
            });
        }
    });

    await models.JobItems.remove();
    models.JobItems.insertMany(arr)
    .catch(err => {
        res.json({ok: false, text: 'Ошибка записи Наименований работ'});
    });

    console.log(arr);

    res.json({ok: true, text: "Данные загружены!", data: arr});

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
router.post('/saveNewRecordSmetaSettings', async (req, res) => {
    const type = req.body.Type;
    const name = req.body.Name;

    if (type == 'ButRoom') {
        var lastName = await models.Rooms.findOne({Name: name});
        if (lastName) {
            res.json({ok: false, text: 'Комната уже существует', err: 'Нет описания'});
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
        
    } else if (type == 'ButType') {
        var lastType = await models.TypeJobs.findOne({Name: name});
        if (lastType) {
            res.json({ok: false, text: 'Такой тип работ уже существует', err: 'Нет описания'});
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
    } else if (type == 'ButObject') {
        var lastObject = await models.ObjectJobs.findOne({Name: name});
        if (lastObject) {
            res.json({ok: false, text: 'Такой объект работ уже существует', err: 'Нет описания'});
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
    } else if (type == 'ButJob') {
        var unitme = req.body.UnitMe;
        var price = req.body.Price;

        var lastJobs = await models.JobItems.findOne({Name: name});
        if (lastJobs) {
            res.json({ok: false, text: 'Такой объект работ уже существует', err: 'Нет описания'});
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
    } else {
        res.json({ok: false, text: 'Неизвестный запрос', err: 'ID кнопки не найден'});
    }
});

module.exports = router;