const toCamelCase = require('lodash.camelcase');
const apiTypes = require('../api/apiTypes');
const apiElementCalculatorGenerator = require('./apiElementCalculatorGenerator');


function generateOperationTypeCalculator(apiOfOperationType) {
  const calculator = {};

  if (Object.keys(apiOfOperationType).every((key) => apiTypes.users.includes(key))) {
    apiTypes.users.forEach((type) => {
      calculator[type] = apiElementCalculatorGenerator.generate(apiOfOperationType[type]);
    });
  } else {
    const calculatorForOperationType = apiElementCalculatorGenerator.generate(apiOfOperationType);
    apiTypes.users.forEach((type) => {
      calculator[type] = calculatorForOperationType;
    });
  }
  return calculator;
}

function calculatorGenerator(api) {
  const calculator = {};

  apiTypes.operation.forEach((type) => {
    calculator[type] = generateOperationTypeCalculator(api[type]);
  });
  return ({ type, userType, ...data }) => calculator[toCamelCase(type)][userType](data);
}


exports.generate = calculatorGenerator;
