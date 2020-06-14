const fs = require('fs');
const camelcaseKeys = require('camelcase-keys');
const api = require('./api/api');
const calculatorGenerator = require('./calculatorGenerator/calculatorGenerator');

const inputFile = process.argv.slice(2)[0];

const calcPromise = api.getApi()
  .then(calculatorGenerator.generate);

const inputDataPromise = fs.promises.readFile(`./${inputFile}`)
  .then((data) => camelcaseKeys(JSON.parse(data), { deep: true }));

Promise.all([calcPromise, inputDataPromise])
  .then(([commissionCalculator, transactions]) =>
    transactions.forEach((transaction) => console.log(commissionCalculator(transaction))))
  .catch(console.log);
