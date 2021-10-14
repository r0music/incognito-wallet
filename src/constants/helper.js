const HELPER_CONSTANT = {
  FEE: {
    title: 'Fee',
    contents: [
      {
        content:
          'By default, Incognito charges only network fees. If you have chosen to boost your trade, the priority fee will also be reflected here. Note that Uniswap and Kyber pools will also incur cross-chain fees.',
      },
    ],
  },
  NETWORK: {
    title: 'Pool',
    contents: [
      {
        content:
          'The best pool for this trade, taking into account prices and fees from Uniswap, Kyber and Incognito.',
      },
    ],
  },
  MAX_PRICE: {
    title: 'Max price',
    contents: [
      {
        content:
          'This is the maximum price you are willing to accept for this trade.\n' +
          '\n' +
          'It takes into account 1% slippage tolerance, which covers the potential price variance between the time of trade request and the time of execution. Your trade will go through at this price or better.',
      },
    ],
  },
  PRICE_IMPACT: {
    title: 'Size impact',
    contents: [
      {
        content:
          'This is the difference between the current price and your estimated trade price, based on current and subsequent pool ratios.' +
          '\n\n' +
          'Size impact is determined by the size of your trade in relation to the balance of liquidity available. Bigger trades have larger size impacts.',
      },
    ],
  },
  WARNING: {
    title: 'Warning',
    contents: [
      {
        content:
          'Do note that due to trade size, the price of this trade varies significantly from market price.',
      },
    ],
  },
  SLIPPAGE: {
    title: 'Slippage tolerance',
    contents: [
      {
        content:
          'Prices may fluctuate in the time between trade request and execution. Adjust your slippage tolerance to set the variance you are willing to accept.',
      },
    ],
  },
  PRIORITY: {
    title: 'Priority',
    contents: [
      {
        content:
          'Here you can choose to prioritize your trade for an extra fee. Doing so will increase the speed of execution and your likelihood of getting a better rate. If you choose to prioritize your trade, you will see your updated fee under Trade details.',
      },
      {
        subTitle: 'More on fees',
        content:
          'By default, Incognito doesn’t charge any trading fees for normal trades. The only fee incurred is the Incognito network fee, paid to validators for verifying transactions. If you are utilizing a Uniswap or Kyber pool, cross-chain fees will also apply.',
      },
    ],
  },
  AMP: {
    title: 'AMP',
    contents: [
      {
        content:
          'Here you can choose to prioritize your trade for an extra fee. Doing so will increase the speed of execution and your likelihood of getting a better rate. If you choose to prioritize your trade, you will see your updated fee under Trade details.',
      },
      {
        subTitle: 'More on fees',
        content:
          'By default, Incognito doesn’t charge any trading fees for normal trades. The only fee incurred is the Incognito network fee, paid to validators for verifying transactions. If you are utilizing a Uniswap or Kyber pool, cross-chain fees will also apply.',
      },
    ],
  },
  PROVIDE: {
    title: 'Length of term',
    contents: [
      {
        content:
          'Choose instant access to withdraw your funds at any time for free. Otherwise, pick a fixed term to get our best rates.',
      },
    ],
  },
};

export default { HELPER_CONSTANT };
