const express = require('express');
const router = express.Router();

const fs = require('fs-extra');
const path = require('path');

const models = require('../../models');

router.post('/recruiters', (req, res) => {
    const id = req.body.id;
    const status = req.body.status;

    if (!id){
        res.json( { ok: false, error: 'Очень странно! Обратитесь к разработчику' } );
    }
    else{
        models.Recruiter.findById(id, (err, recruiter) => {
            if (err) res.json( { ok: false, error: 'Попробуйте позже'} );

            recruiter.status = status;

            recruiter.save((errs) => {
                if (errs) res.json({ ok: false, error: 'Попробуйте позже' });
                
                res.json({ ok: true });
              });
        })
    }
});
router.post('/user', (req, res) => {
    const id = req.body.id;

    models.User.findByIdAndRemove(id, (err) => {
        if (err) res.json({ok: false, error: 'Попробуйте позже!'});
        res.json({ok: true});
    });
});
router.post('/rewiew', (req, res) => {
    const id = req.body.id;
    const status = req.body.status

    if (!id){
        res.json( { ok: false, error: 'Очень странно! Обратитесь к разработчику' } );
    }
    else{
        models.Rewiews.findById(id, (err, rew) => {
            if (err) res.json( { ok: false, error: 'Попробуйте позже'} );

            rew.status = status;

            rew.save((errs) => {
                if (errs) res.json({ ok: false, error: 'Попробуйте позже' });
                
                res.json({ ok: true });
              });
        })
    }
});
router.post('/additional', (req, res) => {
    const id = req.body.id;
    const type_model = req.body.type_model;
    const pathFile = req.body.pathFile;

    if (type_model == "Messengers"){
        models.Messengers.findByIdAndRemove(id, (err) => {
            if (err) res.json({ok: false, text: 'Попробуйте позже!'});
            res.json({ok: true});
        });
    } else if(type_model == "Locations") {
        models.Locations.findByIdAndRemove(id, (err) => {
            if (err) res.json({ok: false, text: 'Попробуйте позже!'});
            fs.remove(path.join(__dirname, '../../uploads' + pathFile.substr(0, 5)), (err) => {
                if(err) return console.log(err);
                models.Worksheets.find({flag_path: pathFile}, {id: 1}, (err, work) => {
                    if (err) res.json({ok: false, text: 'Попробуйте позже!'});
                    for (var i=0; i < work.length; i++){
                        models.Worksheets.findByIdAndUpdate(work[i]._id, {flag_path: '/netral/flag/flag.png'}, (err) => {
                            if (err) return false;
                            return true;
                        });
                    }
                });
            });
            res.json({ok: true});
        });
    } else if(type_model == "Directions") {
        models.Directions.findByIdAndRemove(id, (err) => {
            if (err) res.json({ok: false, text: 'Попробуйте позже!'});
            res.json({ok: true});
        });
    } else{
        res.json({ok: false});
    }
    
});

module.exports = router;