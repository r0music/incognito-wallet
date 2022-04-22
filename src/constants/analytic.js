const ANALYTIC_ENDPOINT = global.isMainnet ? 'https://churn-api-coinservice.incognito.org/churn' : 'https://churn-api-coinservice-staging.incognito.org/churn';
const ANALYTIC_DATA_TYPE = {
  SHIELD: 1,
  UNSHIELD: 2,
  SEND: 3,
  TRADE: 4,
  OPEN_APP: 5,
  ORDER: 6,
};

export default {
  ANALYTIC_ENDPOINT,
  ANALYTIC_DATA_TYPE,
};
