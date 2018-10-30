'use strict';

const express = require('express');
const mongoose = require('mongoose');

const User = require('../models/user');

const router = express.Router();


/* ========== POST/CREATE A USER ========== */
router.post('/', (req, res, next) => {
    const { fullname, username, password } = req.body;
    const requiredFields = ['username', 'password'];
    const missingField = requiredFields.find(field => !(field in req.body));
    if((typeof(username) !== 'string') || (typeof(password) !== 'string')  ){
      const err = new Error('get out of here hackers!');
      err.status = 422;
      return next(err);
    }
    const validatedPword = password.trim();
    const validateUser = username.trim();
    if((validateUser !== username) || (username.length < 1) || (typeof(validateUser) !== 'string')) {
      const err = new Error('username must be at least 1 character long and contain no whitespace');
      err.status = 422;
      return next(err);
    }
    if((validatedPword !== password) || (validatedPword.length < 8) || (validatedPword.length > 72)){
      const err = new Error('password must be between 3 and 72 characters and contain no whitespace');
      err.status = 422;
      return next(err);
    }
    if (missingField) {
      const err = new Error(`Missing '${missingField}' in request body`);
      err.status = 422;
      return next(err);
    }
    
    return User.hashPassword(password)
    .then(digest => {
      const newUser = {
        username,
        password: digest,
        fullname
      };
      return User.create(newUser);
    })
    .then(result => {
      return res.status(201).location(`/api/users/${result.id}`).json(result);
    })
    .catch(err => {
      if (err.code === 11000) {
        err = new Error('The username already exists');
        err.status = 400;
      }
      next(err);
    });
});


  module.exports = router;