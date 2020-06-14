const persistence = require('../persistence/persistence');

const percentsCalculatorGenerator = (percents) => (
  ({ operation }) => 0.01 * Math.ceil(percents * operation.amount)
);

const rulesAdditionGenerator = {
  weekLimit: (weekLimit) => {
    const updateUserWeek = persistence.generateUserWeeklyPersistence();
    return (initialCalculator) => (transaction) => {
      const { userId, date, operation } = transaction;
      const thisWeekTotal = updateUserWeek(userId, date, operation.amount);
      const exceededAmount = Math.min(thisWeekTotal - weekLimit.amount, operation.amount);
      return initialCalculator({
        operation: {
          amount: (exceededAmount > 0 ? exceededAmount : 0),
        },
      });
    };
  },
  min: (min) => (initialCalculator) => (
    (transaction) => Math.max(min.amount, initialCalculator(transaction))
  ),
  max: (max) => (initialCalculator) => (
    (transaction) => Math.min(max.amount, initialCalculator(transaction))
  ),
};

const apiElementCalculatorGenerator = ({ percents, ...otherRules }) => {
  const calculator = Object.keys(otherRules)
    .reduce((calc, key) => rulesAdditionGenerator[key](otherRules[key])(calc),
      percentsCalculatorGenerator(percents));

  return (transaction) => calculator(transaction).toFixed(2);
};

exports.generate = apiElementCalculatorGenerator;
