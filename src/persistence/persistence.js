// Data persistence for week_limit calculation

function getMonday(dateStr) {
  const date = new Date(dateStr);
  return date.setDate(date.getDate() - ((date.getDay() + 6) % 7));
}

function generateUserWeeklyPersistence() {
  const cache = {};
  return (id, dateAsString, amount) => {
    const weekStart = getMonday(dateAsString);
    if (!cache[id]) {
      cache[id] = { [weekStart]: amount };
    } else {
      cache[id][weekStart] = cache[id][weekStart] ? cache[id][weekStart] + amount : amount;
    }

    return cache[id][weekStart];
  };
}

exports.generateUserWeeklyPersistence = generateUserWeeklyPersistence;
