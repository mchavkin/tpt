const apiElementCalculatorGenerator = require('./apiElementCalculatorGenerator').default
const EUR = "EUR"
const input =
    [
        {
            date: "2016-01-05",
            user_id: 1,
            operation: {amount: 200.00, currency: EUR}
        },
        {
            date: "2016-01-06",
            user_id: 2,
            operation: {amount: 500.00, currency: EUR}
        },
        {
            date: "2016-01-06",
            user_id: 1,
            operation: {amount: 30001, currency: EUR}
        },
        {
            date: "2016-01-07",
            user_id: 1,
            operation: {amount: 1000.04, currency: EUR}
        },
        {
            date: "2016-01-07",
            user_id: 1,
            operation: {amount: 700.00, currency: EUR}
        },
        {
            date: "2016-01-08",
            user_id: 1,
            operation: {amount: 150.00, currency: EUR}
        },
        {
            date: "2016-01-09",
            user_id: 2,
            operation: {amount: 1001000.00, currency: EUR}
        },
        {
            date: "2016-01-10",
            user_id: 3,
            operation: {amount: 1000.00, currency: EUR}
        },
        {
            date: "2016-01-10",
            user_id: 1,
            operation: {amount: 300.00, currency: EUR}
        },
        {
            date: "2016-01-11",
            user_id: 1,
            operation: {amount: 300.00, currency: EUR}
        }
    ]

describe("creates percent calculator", () => {
    const api = {
        percents: Math.random() * 0.3
    }
    const percentCalculator = apiElementCalculatorGenerator(api)
    it("calculates correct amount on percent", () => {
        expect(percentCalculator(input[0]))
            .toEqual((input[0].operation.amount * api.percents * 0.01 + 0.005).toFixed(2))
    })
    it("rounds up to nearest cent", () => {
        expect(percentCalculator(input[2]))
            .toEqual((input[2].operation.amount * api.percents * 0.01 + 0.005).toFixed(2))
        expect(percentCalculator(input[3]))
            .toEqual((input[3].operation.amount * api.percents * 0.01 + 0.005).toFixed(2))
    })
})

describe("creates calculator with week limit", () => {
    const api = {
        percents: 0.3,
        week_limit: {
            amount: 1000,
            currency: "EUR"
        }
    }
    const calculator = apiElementCalculatorGenerator(api)

    it("transactions are free before the limit is reached", () => {
        expect(calculator(input[0])).toEqual("0.00")
        expect(calculator(input[4])).toEqual("0.00")
    })
    it("calculates percent for exceeded amount", () => {
        expect(calculator(input[5])).toEqual("0.15")
    })
    it("a different user has its own week limit", () => {
        expect(calculator(input[1])).toEqual("0.00")
        expect(calculator(input[6])).toEqual((0.003*(1001000.00 - 1000 + 500)).toFixed(2))
    })
    it("should not reset limit on Sunday ", () => {
        expect(calculator(input[8])).not.toEqual("0.00")
    })
    it("should reset limit on Monday ", () => {
        expect(calculator(input[9])).toEqual("0.00")
    })
})

describe ("test min commission", () => {
    const api = {
        percents: 0.3,
        min: {
            amount: 0.50,
            currency: "EUR"
        }
    }
    const calculator = apiElementCalculatorGenerator(api)
    it("when percent is lower than minimum commission equals to minimum", () =>{
        expect(calculator(input[5])).toEqual("0.50")
    })
    it("when percent is higher than minimum commission is calculated", () =>{
        expect(calculator(input[4])).toEqual("2.10")
    })
})

describe ("test max commission", () => {
    const api = {
        percents: 0.3,
        max: {
            amount: 5.00,
            currency: "EUR"
        }
    }
    const calculator = apiElementCalculatorGenerator(api)
    it("when percent is higher than maximum commission equals to maximum", () =>{
        expect(calculator(input[2])).toEqual("5.00")
    })
    it("when percent is lower than maximum commission is calculated", () =>{
        expect(calculator(input[4])).toEqual("2.10")
    })
})

describe("rules can be combined", () =>{
    const api = {
        percents: 0.3,
        min: {
            amount: 0.50,
            currency: "EUR"
        },
        max: {
            amount: 5.00,
            currency: "EUR"
        }
    }
    const calculator = apiElementCalculatorGenerator(api)
    it("minimum commissions for small transactions", ()=>{
        expect(calculator(input[5])).toEqual("0.50")
    })
    it("minimum commissions for big transactions", () =>{
        expect(calculator(input[2])).toEqual("5.00")
    })
})