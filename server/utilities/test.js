const validator = require('validator');
const _ = require('lodash');

const type = '';

const taskCondition = { id: 'abcxyz' };
type ? (taskCondition.type = type) : null;

console.log(taskCondition);
