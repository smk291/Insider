'use strict';

const joi = require('joi');

module.exports.post = {
  body: {
    firstName: joi.string()
      .trim()
      .max(30)
      .label('First name')
      .required(),

    lastName: joi.string()
      .trim()
      .max(30)
      .label('Last name')
      .required(),

    email: joi.string()
      .email()
      .trim()
      .max(50)
      .label('Email')
      .required(),

    password: joi.string()
      .min(10)
      .label('Password')
      .required()
  }
};
