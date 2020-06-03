const input = process.argv.slice(2)[0]
const api = require('./api/api').default
const fs = require('fs')
const calculatorGenerator = require('./calculatorGenerator/calculatorGenerator').default

const commissionCalculator = calculatorGenerator(api)

fs.readFile(`./${input}`, ((err, data) => {
    if (err) {
        return console.log(err)
    }
    try {
        const transactions = JSON.parse(data)
        transactions.forEach(transaction => {
            console.log(commissionCalculator(transaction))
        })

    } catch (e) {
        console.log(e)
    }
}))
