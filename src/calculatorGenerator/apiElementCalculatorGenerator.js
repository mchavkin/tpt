const percentsCalculatorGenerator = percents =>
    ({operation}) => (0.01 * Math.ceil(percents * operation.amount))

const rulesAdditionGenerator = {
    week_limit: weekLimit => {
        const updateUserWeek = generateUserWeeklyPersistence()
        return fun =>
            transaction => {
                const {user_id, date, operation} = transaction
                const thisWeekTotal = updateUserWeek(user_id, date, operation.amount)
                const exceededAmount = Math.min(thisWeekTotal - weekLimit.amount, operation.amount)
                return fun({
                    operation: {
                        amount: (exceededAmount > 0 ? exceededAmount : 0)
                    }
                })
            }
    },
    min: min =>
        fun => transaction => Math.max(min.amount, fun(transaction)),
    max: max =>
        fun => transaction => Math.min(max.amount, fun(transaction))
}

const apiElementCalculatorGenerator = ({percents, ...otherRules}) => {
    const calculator = Object.keys(otherRules)
        .reduce((calculator, key) => rulesAdditionGenerator[key](otherRules[key])(calculator)
            , percentsCalculatorGenerator(percents))

    return transaction => calculator(transaction).toFixed(2)
}

exports.default = apiElementCalculatorGenerator





//Data persistence for week_limit calculation

function generateUserWeeklyPersistence() {
    const cache = {}
    return (id, dateAsString, amount) => {
        const weekStart = getMonday(dateAsString)
        if (!cache[id]) {
            cache[id] = {[weekStart]: amount}
        } else {
            cache[id][weekStart] = cache[id][weekStart] ? cache[id][weekStart] + amount : amount
        }

        return cache[id][weekStart]
    }
}

function getMonday(dateStr) {
    let date = new Date(dateStr)
    return date.setDate(date.getDate() - (date.getDay() + 6) % 7)
}

