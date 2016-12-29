// eslint-disable-next-line new-cap
'use strict';

const boom = require('boom');
const bcrypt = require('bcrypt-as-promised');
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const knex = require('../knex');
const ev = require('express-validation');
// const validations = require('../validations/token');
const { camelizeKeys } = require('humps');
const request = require('request');
const cheerio = require('cheerio');
const fs = require('fs');
const decycle = require('json-decycle').decycle;
const retrocycle = require('json-decycle').retrocycle;

// function authorize(req, res, next) {
//   jwt.verify(req.cookies.token, process.env.JWT_SECRET, (err) => {
//     if (err) {
//       req.verify = false;
//     } else {
//       req.verify = true;
//     }
//
//     next();
//   });
// }

// router.get('/scrape', function(req, res){
//   let { url } = req.body;
//
//   request(url, function(error, response, html){
//       if(error){
//         console.log(error);
//       }
//       var $ = cheerio.load(html);
//       let json = {href: ''}
//
//
//       $('.result-title').filter(() => {
//         let data = $(this);
//         let href = this;
//
//         json.href = href;
//       })
//
//       console.log(json);
//
//       res.send(json);
//     }) ;
// })

module.exports = router;
