const express = require('express');
const router = express.Router();

const models = require('../../models');

router.get('/login', (req, res) => {
    res.render('./login');
});
router.get('/', (req, res) => {
    const userid = req.session.userId;
    const userType = req.session.userType;
    const userLogin = req.session.userLogin;

    if (userType == 'User'){
        var typePanel = 'Рабочая область';
    } else {
        var typePanel = 'Административная панель '
    }
    var data = {
        typePanel: typePanel,
        user: userLogin + ' (' + userType + ')',
    }

    if (userid){
        if (userType == 'Admin' || userType == "Developer"){
            res.render('admins/main_admin', {data});
        } else if (userType == 'User') {
            res.redirect('/user/alldocuments');
        } else{
            res.render('./login');
        }
    } else {
        res.redirect('/login');
    }
});
router.get('/user/newdocument', async (req, res) => {
    const userid = req.session.userId;
    const userLogin = req.session.userLogin;
    const userType = req.session.userType;

    var room = await models.Rooms.find({}, {Name: 1, Number: 1});

    if (userType == 'User'){
        var typePanel = 'Рабочая область';
    } else {
        var typePanel = 'Административная панель '
    }
    var data = {
        typePanel: typePanel,
        user: userLogin + ' (' + userType + ')',
        room
    }

    if (userid){
        res.render('./users/new_document', {data});
    } else {
        res.render('./login');
    }
});
router.get('/user/alldocuments', (req, res) => {
    const userid = req.session.userId;
    const userLogin = req.session.userLogin;
    const userType = req.session.userType;

    if (userType == 'User'){
        var typePanel = 'Рабочая область';
    } else {
        var typePanel = 'Административная панель '
    }
    var data = {
        typePanel: typePanel,
        user: userLogin + ' (' + userType + ')',
    }

    if (userid){
        res.render('./users/all_documents', {data});
    } else {
        res.render('./login');
    }
});
router.get('/user/smeta', (req, res) => {
    const userid = req.session.userId;
    const userLogin = req.session.userLogin;
    const userType = req.session.userType;

    if (userType == 'User'){
        var typePanel = 'Рабочая область';
    } else {
        var typePanel = 'Административная панель '
    }
    var data = {
        typePanel: typePanel,
        user: userLogin + ' (' + userType + ')',
    }

    if (userid){
        res.render('./users/smeta', {data});
    } else {
        res.render('./login');
    }
})

module.exports = router;