const calculatorGenerator = require('./calculatorGenerator').default

const mockApi = {
    cash_in: {
        mock: jest.fn()
    },
    cash_out: {
        natural: {
            mock: jest.fn()
        },
        juridical: {
            mock: jest.fn()
        }
    }
}

jest.mock('./apiElementCalculatorGenerator', () => (
    {
        default: api => api.mock
    })
)

describe("for each type of transaction and user it creates calculator", () => {
    const calculator = calculatorGenerator(mockApi)

    it("calls cash_in calculator", () => {
        const transaction1 = {user_type: "juridical", type: "cash_in", data: "some_data"}
        const transaction2 = {user_type: "natural", type: "cash_in", data: "some_data"}
        calculator(transaction1)
        expect(mockApi.cash_in.mock).toBeCalledTimes(1)
        calculator(transaction2)
        expect(mockApi.cash_in.mock).toBeCalledTimes(2)

        expect(mockApi.cash_out.juridical.mock).not.toBeCalled()
        expect(mockApi.cash_out.natural.mock).not.toBeCalled()

    })

    it("calls cash_out juridical 1 time and cash_out natural 2 times", () => {
        const transactions = [
            {user_type: "juridical", type: "cash_out", data: "some_data"},
            {user_type: "natural", type: "cash_out", data: "some_data"},
            {user_type: "natural", type: "cash_out", data: "some_data"}
        ]

        transactions.forEach(transaction => {
            calculator(transaction)
        })
        expect(mockApi.cash_out.juridical.mock).toBeCalledTimes(1)
        expect(mockApi.cash_out.natural.mock).toBeCalledTimes(2)
    })
})
