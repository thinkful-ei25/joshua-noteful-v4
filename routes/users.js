'use strict';

const express = require('express');
const mongoose = require('mongoose');

const User = require('../models/user');

const router = express.Router();

/* ========== POST/CREATE A USER ========== */
router.post('/', (req, res, next) => {
    const { fullname, username, password } = req.body;
  
    const newUser = { fullname, username, password };
  
    /***** Never trust users - validate input *****/
    // if (!username) {
    //   const err = new Error('Missing `username` in request body');
    //   err.status = 400;
    //   return next(err);
    // }
    // if(!password){
    //     const err = new Error('missing `password` in request body');
    //     err.status = 400;
    //     return next(err);
    // }
  
    User.create(newUser)
      .then(result => {
        res.location(`${req.originalUrl}/${result.id}`).status(201).json(result);
      })
      .catch(err => {
        next(err);
      });
  });



  module.exports = router;