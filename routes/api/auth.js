const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt-nodejs');

const models = require('../../models');

// POST is authorized
router.post('/register', (req, res) => {
  const login = req.body.login;
  const password = req.body.password;
  const passwordConfirm = req.body.passwordConfirm;
  const typeUser = req.body.typeUser;
  const email = req.body.email;
  const status = true;

  if (!login || !password || !passwordConfirm) {
    const fields = [];
    if (!login) fields.push('login');
    if (!password) fields.push('password');
    if (!passwordConfirm) fields.push('passwordConfirm');
    if (!email) fields.push('email');

    res.json({
      ok: false,
      error: 'Все поля должны быть заполнены!',
      fields
    });
  } else if (!/^[a-zA-Z0-9]+$/.test(login)) {
    res.json({
      ok: false,
      error: 'Только латинские буквы и цифры!',
      fields: ['login']
    });
  } else if (login.length < 3 || login.length > 16) {
    res.json({
      ok: false,
      error: 'Длина логина от 3 до 16 символов!',
      fields: ['login']
    });
  } else if (password !== passwordConfirm) {
    res.json({
      ok: false,
      error: 'Пароли не совпадают!',
      fields: ['password', 'passwordConfirm']
    });
  } else if (password.length < 5) {
    res.json({
      ok: false,
      error: 'Минимальная длина пароля 5 символов!',
      fields: ['password']
    });
  } else if (!/^[0-9a-z-.]+@[0-9a-z-]{2,}\.[a-z]{2,}$/.test(email)){
    res.json({
      ok: false,
      error: 'Не верная структура email!',
      fields: ['email']
    });
  } else {
    models.User.findOne({
      login
    }).then(user => {
      if (!user) {
        bcrypt.hash(password, null, null, (err, hash) => {
          models.User.create({
            login,
            password: hash,
            typeUser,
            email,
            status
          })
            .then(user => {
              console.log(user);
              res.json({
                ok: true
              });
            })
            .catch(err => {
              console.log(err);
              res.json({
                ok: false,
                error: 'Ошибка, попробуйте позже!'
              });
            });
        });
      } else {
        res.json({
          ok: false,
          error: 'Имя занято!',
          fields: ['login']
        });
      }
    });
  }
});
// POST is LogIn
router.post('/login', (req, res) => {
  const login = req.body.login;
  const password = req.body.password;

  if (!login || !password) {
    const fields = [];
    if (!login) fields.push('login');
    if (!password) fields.push('password');

    res.json({
      ok: false,
      error: 'Все поля должны быть заполнены!',
      fields
    });
  } else {
    models.User.findOne({
      login
    })
      .then(user => {
        if (!user) {
          res.json({
            ok: false,
            error: 'Логин и пароль неверны!',
            fields: ['login', 'password']
          });
        } else {
          bcrypt.compare(password, user.password, function(err, result) {
            if (!result) {
              res.json({
                ok: false,
                error: 'Логин и пароль неверны!',
                fields: ['login', 'password']
              });
            } else {
              if (user.status){
                req.session.userId = user.id;
                req.session.userLogin = user.login;
                req.session.userType = user.typeUser;

                res.json({
                  ok: true
                });
              }
              else{
                res.json({
                  ok: false,
                  error: 'Пользователь временно не доступен!'
                });
              }
            }
          });
        }
      })
      .catch(err => {
        console.log(err);
        res.json({
          ok: false,
          error: 'Ошибка, попробуйте позже!'
        });
      });
  }
});
// GET for logout
router.get('/logout', (req, res) => {
  if (req.session) {
    // delete session object
    req.session.destroy(() => {
      res.redirect('/administration/');
    });
  } else {
    res.redirect('/administration/');
  }
});
router.post('/loginrecruiter', (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  var fields = [];

  if (!email || !password){
    if (!email) fields.push('rec_login');
    if (!password) fields.push('rec_password');

    res.json({
      ok: false,
      text: 'Не все поля заполнены!',
      fields
    });

  } else if (email && !/^[0-9a-z-.]+@[0-9a-z-]{2,}\.[a-z]{2,}$/.test(email)){
    fields.push('rec_login');
    res.json({
      ok: false,
      text: 'E-mail имеет не верный формат!',
      fields
    });
  } else {
    models.Recruiter.findOne({email, status: 'true'})
    .then(rec => {
      if (!rec) {
        res.json({
          ok: false,
          text: 'Пользователь не найден!'
        });
      } else {
        bcrypt.compare(password, rec.password, function(err, result) {
          if (!result) {
            res.json({
              ok: false,
              text: 'Логин и пароль неверны!',
              fields: ['rec_login', 'rec_password']
            });
          } else {
            if (rec.status != "Модерация"){
              if (req.session.userLogin){
                req.session.recruiterStatus = true;
                req.session.dateStart = new Date();
                req.session.recId = rec._id
              }

              res.json({
                ok: true,
                id: rec._id
              });
            }
            else{
              res.json({
                ok: false,
                text: 'Пользователь не найден!'
              });
            }
          }
        });
      }
    })
    .catch(err => {
      console.log(err);
      res.json({
        ok: false,
        error: 'Ошибка, попробуйте позже!'
      });
    });
  }
});

module.exports = router;