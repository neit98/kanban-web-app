const validator = require('validator');
const _ = require('lodash');

const password = 'Tien29214@';
const invalidPass = 'abcxyzsdwqewdas';
const invalidPass2 = '123456abc@';

const checkValidPassword = (password) => {
  if (validator.isStrongPassword(password)) {
    return true;
  }
  return false;
};

console.log(checkValidPassword(invalidPass));
