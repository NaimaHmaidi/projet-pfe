const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Tache = require ('../model/tache');
const nodemailer = require('nodemailer');
const multer = require ('multer');


router.get('/allTaches', (req, res) =>{
    Tache.find()
    .then(taches => res.json(taches))
    .catch(err => res.json(err))
});

  
 // Créer une Tache
router.post("/create", (req, res)=> {
  Tache.create(req.body)
    .then(taches => res.json(taches))
    .catch(err => res.json(err))
});


  router.get('/getTache/:id', (req,res)=>{
    const id = req.params.id;
    Tache.findById({_id: id})
    .then(taches => res.json(taches))
    .catch(err => res.json(err))
  });
  //update
router.put('/update/:id',async ( req, res) =>{
    const id = req.params.id;
    Tache.findByIdAndUpdate({_id:id},
       {name: req.body.name,
        description: req.body.description,
        namedeveloppeur: req.body.namedeveloppeur, 
        date: req.body.date, 
        })
    .then(taches => res.json(taches))
      .catch(err => res.json(err))
  });

  //delete

router.delete('/delete/:id', (req,res) => {
    const id = req.params.id;
    Tache.findByIdAndDelete({_id: id})
    .then(res => res.json(res))
    .catch(err => res.json(err))
  });
 
  
  module.exports = router;