const axios = require('axios');
const camelcaseKeys = require('camelcase-keys');

const BASE_URL = 'http://private-38e18c-uzduotis.apiary-mock.com/config/';
const CASH_IN_API_URL = 'cash-in';
const CASH_OUT_NATURAL_API_URL = 'cash-out/natural';
const CASH_OUT_JURIDICAL_API_URL = 'cash-out/juridical';

const getApi = () => {
  const client = axios.create({
    baseURL: BASE_URL,
    transformResponse: [
      (data) => camelcaseKeys(JSON.parse(data), { deep: true }),
    ],
  });

  return Promise.all([CASH_IN_API_URL, CASH_OUT_NATURAL_API_URL, CASH_OUT_JURIDICAL_API_URL]
    .map(client.get))
    .then(([cashInApi, cashOutNaturalApi, cashOutJuridicalApi]) => ({
      cashIn: cashInApi.data,
      cashOut: {
        natural: cashOutNaturalApi.data,
        juridical: cashOutJuridicalApi.data,
      },
    }));
};

exports.getApi = getApi;
