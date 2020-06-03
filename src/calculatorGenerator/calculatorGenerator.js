const apiTypes = require('../api/apiTypes')
const apiElementCalculatorGenerator = require('./apiElementCalculatorGenerator').default


function calculatorGenerator(api) {
    const calculator = {}

    apiTypes.operation.forEach(type => {
        calculator[type] = generateOperationTypeCalculator(api[type])
    })
    return ({type, user_type, ...data}) => {
        const userType = calculator[type][user_type] ? user_type : "common"
        return calculator[type][userType](data)
    }
}


function generateOperationTypeCalculator(apiOfOperationType) {
    const calculator = {}

    if (Object.keys(apiOfOperationType).every(key => apiTypes.users.includes(key))) {
        apiTypes.users.forEach(type => {
            calculator[type] = apiElementCalculatorGenerator(apiOfOperationType[type])
        })
    } else {
        calculator.common = apiElementCalculatorGenerator(apiOfOperationType)
    }
    return calculator
}

exports.default = calculatorGenerator
