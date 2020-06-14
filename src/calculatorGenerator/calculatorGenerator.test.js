const calculatorGenerator = require('./calculatorGenerator');

const mockApi = {
  cashIn: {
    natural: {
      mock: jest.fn(),
    },
    juridical: {
      mock: jest.fn(),
    },
  },
  cashOut: {
    natural: {
      mock: jest.fn(),
    },
    juridical: {
      mock: jest.fn(),
    },
  },
};

jest.mock('./apiElementCalculatorGenerator', () => (
  {
    generate: (api) => api.mock,
  }));

describe('for each type of transaction and user it creates calculator', () => {
  const calculator = calculatorGenerator.generate(mockApi);

  it('calls cash_in calculator', () => {
    const transaction1 = { userType: 'juridical', type: 'cash_in', data: 'some_data' };
    const transaction2 = { userType: 'natural', type: 'cash_in', data: 'some_data' };
    calculator(transaction1);
    calculator(transaction2);
    expect(mockApi.cashIn.juridical.mock).toBeCalledTimes(1);
    expect(mockApi.cashIn.natural.mock).toBeCalledTimes(1);

    expect(mockApi.cashOut.juridical.mock).not.toBeCalled();
    expect(mockApi.cashOut.natural.mock).not.toBeCalled();
  });

  it('calls cash_out juridical 1 time and cash_out natural 2 times', () => {
    const transactions = [
      { userType: 'juridical', type: 'cash_out', data: 'some_data' },
      { userType: 'natural', type: 'cash_out', data: 'some_data' },
      { userType: 'natural', type: 'cash_out', data: 'some_data' },
    ];

    // transactions.forEach((transaction) => {
    //   calculator(transaction);
    // });
    transactions.forEach(calculator);
    expect(mockApi.cashOut.juridical.mock).toBeCalledTimes(1);
    expect(mockApi.cashOut.natural.mock).toBeCalledTimes(2);
  });
});
