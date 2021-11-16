export const ACTION_FETCHING = '[pDexV3][swap] Fetching data';
export const ACTION_FETCHED = '[pDexV3][swap] Fetched data';
export const ACTION_FETCH_FAIL = '[pDexV3][swap] Fetch fail data';

export const ACTION_SET_SELL_TOKEN = '[pDexV3][swap] Set sell token';
export const ACTION_SET_BUY_TOKEN = '[pDexV3][swap] Set buy token';
export const ACTION_SET_FEE_TOKEN = '[pDexV3][swap] Set fee token';
export const ACTION_SET_FOCUS_TOKEN = '[pDexV3][swap] Set focus token';

export const ACTION_SET_SELECTING_TOKEN = '[pDexV3][swap] Set selecting token';
export const ACTION_SET_SWAPING_TOKEN = '[pDexV3][swap] Set swapingToken token';
export const ACTION_SET_INITIING_SWAP = '[pDexV3][swap] Set initing token';

export const ACTION_SET_PERCENT = '[pDexV3][swap] Set percent';

export const ACTION_RESET = '[pDexV3][swap] Reset';
export const ACTION_FETCH_SWAP = '[pDexV3][swap] Fetching swap';
export const ACTION_FETCHED_LIST_PAIRS = '[pDexV3][swap] Fetched list pairs';

export const ACTION_FETCHING_ORDERS_HISTORY =
  '[pDexV3][swap] Fetching history order';
export const ACTION_FETCHED_ORDERS_HISTORY =
  '[pDexV3][swap] Fetched history order';
export const ACTION_FETCH_FAIL_ORDERS_HISTORY =
  '[pDexV3][swap] Fetch fail history order';
export const ACTION_FETCH_ORDER_DETAIL = '[pDexV3][swap] Fetch order detail';
export const ACTION_FETCHING_ORDER_DETAIL =
  '[pDexV3][swap] Fetching order detail';
export const ACTION_FETCHED_ORDER_DETAIL =
  '[pDexV3][swap] Fetched order detail';
export const ACTION_SET_DEFAULT_PAIR = '[pDexV3][swap] Set default pair';
export const ACTION_SET_SELECTED_PLATFORM =  '[pDexV3][swap] Set selected platform';

export const TAB_SIMPLE_ID = 'simple';
export const TAB_PRO_ID = 'pro';
export const ROOT_TAB_ID = '[swap] Root tab swap';

export const formConfigs = {
  formName: 'FORM_SWAP',
  selltoken: 'selltoken',
  buytoken: 'buytoken',
  slippagetolerance: 'slippagetolerance',
  feetoken: 'feetoken',
};

export const listDecimals = global.isMainnet ? {
  '0x2170ed0880ac9a755fd29b2688956bd959f933f8': {decimals: 18, symbol: 'eth'},
  '0x1af3f329e8be154074d8769d1ffa4ee058b1dbc3': {decimals: 18, symbol: 'dai'},
  '0x55d398326f99059ff775485246999027b3197955': {decimals: 18, symbol: 'usdt'},
  '0xe9e7cea3dedca5984780bafc599bd69add087d56': {decimals: 18, symbol: 'busd'},
  '0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c': {decimals: 18, symbol: 'wbnb'},
} : {
  '0xd66c6b4f0be8ce5b39d52e0fd1344c389929b378': {decimals: 18, symbol: 'eth'},
  '0xec5dcb5dbf4b114c9d0f65bccab49ec54f6a0867': {decimals: 18, symbol: 'dai'},
  '0x7ef95a0fee0dd31b22626fa2e10ee6a223f8a684': {decimals: 18, symbol: 'usdt'},
  '0x78867bbeef44f2326bf8ddd1941a4439382ef2a7': {decimals: 18, symbol: 'busd'},
  '0xae13d989dac2f0debff460ac112a837c89baa7cd': {decimals: 18, symbol: 'wbnb'},
};
export const MULTI_CALL_CONTRACT = global.isMainnet ? '0xff6fd90a470aaa0c1b8a54681746b07acdfedc9b' : '0x8425c988cf9d8ca0d8397c8ee4968bf8c5bc46d1';
export const MULTI_CALL_ABI = [{'inputs':[{'components':[{'internalType':'address','name':'target','type':'address'},{'internalType':'bytes','name':'callData','type':'bytes'}],'internalType':'struct Multicall2.Call[]','name':'calls','type':'tuple[]'}],'name':'aggregate','outputs':[{'internalType':'uint256','name':'blockNumber','type':'uint256'},{'internalType':'bytes[]','name':'returnData','type':'bytes[]'}],'stateMutability':'nonpayable','type':'function'},{'inputs':[{'components':[{'internalType':'address','name':'target','type':'address'},{'internalType':'bytes','name':'callData','type':'bytes'}],'internalType':'struct Multicall2.Call[]','name':'calls','type':'tuple[]'}],'name':'blockAndAggregate','outputs':[{'internalType':'uint256','name':'blockNumber','type':'uint256'},{'internalType':'bytes32','name':'blockHash','type':'bytes32'},{'components':[{'internalType':'bool','name':'success','type':'bool'},{'internalType':'bytes','name':'returnData','type':'bytes'}],'internalType':'struct Multicall2.Result[]','name':'returnData','type':'tuple[]'}],'stateMutability':'nonpayable','type':'function'},{'inputs':[{'internalType':'uint256','name':'blockNumber','type':'uint256'}],'name':'getBlockHash','outputs':[{'internalType':'bytes32','name':'blockHash','type':'bytes32'}],'stateMutability':'view','type':'function'},{'inputs':[],'name':'getBlockNumber','outputs':[{'internalType':'uint256','name':'blockNumber','type':'uint256'}],'stateMutability':'view','type':'function'},{'inputs':[],'name':'getCurrentBlockCoinbase','outputs':[{'internalType':'address','name':'coinbase','type':'address'}],'stateMutability':'view','type':'function'},{'inputs':[],'name':'getCurrentBlockDifficulty','outputs':[{'internalType':'uint256','name':'difficulty','type':'uint256'}],'stateMutability':'view','type':'function'},{'inputs':[],'name':'getCurrentBlockGasLimit','outputs':[{'internalType':'uint256','name':'gaslimit','type':'uint256'}],'stateMutability':'view','type':'function'},{'inputs':[],'name':'getCurrentBlockTimestamp','outputs':[{'internalType':'uint256','name':'timestamp','type':'uint256'}],'stateMutability':'view','type':'function'},{'inputs':[{'internalType':'address','name':'addr','type':'address'}],'name':'getEthBalance','outputs':[{'internalType':'uint256','name':'balance','type':'uint256'}],'stateMutability':'view','type':'function'},{'inputs':[],'name':'getLastBlockHash','outputs':[{'internalType':'bytes32','name':'blockHash','type':'bytes32'}],'stateMutability':'view','type':'function'},{'inputs':[{'internalType':'bool','name':'requireSuccess','type':'bool'},{'components':[{'internalType':'address','name':'target','type':'address'},{'internalType':'bytes','name':'callData','type':'bytes'}],'internalType':'struct Multicall2.Call[]','name':'calls','type':'tuple[]'}],'name':'tryAggregate','outputs':[{'components':[{'internalType':'bool','name':'success','type':'bool'},{'internalType':'bytes','name':'returnData','type':'bytes'}],'internalType':'struct Multicall2.Result[]','name':'returnData','type':'tuple[]'}],'stateMutability':'nonpayable','type':'function'},{'inputs':[{'internalType':'bool','name':'requireSuccess','type':'bool'},{'components':[{'internalType':'address','name':'target','type':'address'},{'internalType':'bytes','name':'callData','type':'bytes'}],'internalType':'struct Multicall2.Call[]','name':'calls','type':'tuple[]'}],'name':'tryBlockAndAggregate','outputs':[{'internalType':'uint256','name':'blockNumber','type':'uint256'},{'internalType':'bytes32','name':'blockHash','type':'bytes32'},{'components':[{'internalType':'bool','name':'success','type':'bool'},{'internalType':'bytes','name':'returnData','type':'bytes'}],'internalType':'struct Multicall2.Result[]','name':'returnData','type':'tuple[]'}],'stateMutability':'nonpayable','type':'function'}];
export const PANCAKE_PAIR_ABI = [{'inputs':[],'name':'MINIMUM_LIQUIDITY','outputs':[{'internalType':'uint256','name':'','type':'uint256'}],'stateMutability':'pure','type':'function'},{'inputs':[],'name':'factory','outputs':[{'internalType':'address','name':'','type':'address'}],'stateMutability':'view','type':'function'},{'inputs':[],'name':'getReserves','outputs':[{'internalType':'uint112','name':'reserve0','type':'uint112'},{'internalType':'uint112','name':'reserve1','type':'uint112'},{'internalType':'uint32','name':'blockTimestampLast','type':'uint32'}],'stateMutability':'view','type':'function'},{'inputs':[],'name':'kLast','outputs':[{'internalType':'uint256','name':'','type':'uint256'}],'stateMutability':'view','type':'function'},{'inputs':[],'name':'price0CumulativeLast','outputs':[{'internalType':'uint256','name':'','type':'uint256'}],'stateMutability':'view','type':'function'},{'inputs':[],'name':'price1CumulativeLast','outputs':[{'internalType':'uint256','name':'','type':'uint256'}],'stateMutability':'view','type':'function'},{'inputs':[],'name':'token0','outputs':[{'internalType':'address','name':'','type':'address'}],'stateMutability':'view','type':'function'},{'inputs':[],'name':'token1','outputs':[{'internalType':'address','name':'','type':'address'}],'stateMutability':'view','type':'function'}];
export const PANCAKE_FACTORY_ADDRESS = global.isMainnet ? '0xcA143Ce32Fe78f1f7019d7d551a6402fC5350c73' : '0xB7926C0430Afb07AA7DEfDE6DA862aE0Bde767bc';
export const PANCAKE_FACOTRY_ABI = [{'inputs':[{'internalType':'address','name':'_feeToSetter','type':'address'}],'payable':false,'stateMutability':'nonpayable','type':'constructor'},{'anonymous':false,'inputs':[{'indexed':true,'internalType':'address','name':'token0','type':'address'},{'indexed':true,'internalType':'address','name':'token1','type':'address'},{'indexed':false,'internalType':'address','name':'pair','type':'address'},{'indexed':false,'internalType':'uint256','name':'','type':'uint256'}],'name':'PairCreated','type':'event'},{'constant':true,'inputs':[],'name':'INIT_CODE_PAIR_HASH','outputs':[{'internalType':'bytes32','name':'','type':'bytes32'}],'payable':false,'stateMutability':'view','type':'function'},{'constant':true,'inputs':[{'internalType':'uint256','name':'','type':'uint256'}],'name':'allPairs','outputs':[{'internalType':'address','name':'','type':'address'}],'payable':false,'stateMutability':'view','type':'function'},{'constant':true,'inputs':[],'name':'allPairsLength','outputs':[{'internalType':'uint256','name':'','type':'uint256'}],'payable':false,'stateMutability':'view','type':'function'},{'constant':false,'inputs':[{'internalType':'address','name':'tokenA','type':'address'},{'internalType':'address','name':'tokenB','type':'address'}],'name':'createPair','outputs':[{'internalType':'address','name':'pair','type':'address'}],'payable':false,'stateMutability':'nonpayable','type':'function'},{'constant':true,'inputs':[],'name':'feeTo','outputs':[{'internalType':'address','name':'','type':'address'}],'payable':false,'stateMutability':'view','type':'function'},{'constant':true,'inputs':[],'name':'feeToSetter','outputs':[{'internalType':'address','name':'','type':'address'}],'payable':false,'stateMutability':'view','type':'function'},{'constant':true,'inputs':[{'internalType':'address','name':'','type':'address'},{'internalType':'address','name':'','type':'address'}],'name':'getPair','outputs':[{'internalType':'address','name':'','type':'address'}],'payable':false,'stateMutability':'view','type':'function'},{'constant':false,'inputs':[{'internalType':'address','name':'_feeTo','type':'address'}],'name':'setFeeTo','outputs':[],'payable':false,'stateMutability':'nonpayable','type':'function'},{'constant':false,'inputs':[{'internalType':'address','name':'_feeToSetter','type':'address'}],'name':'setFeeToSetter','outputs':[],'payable':false,'stateMutability':'nonpayable','type':'function'}];
export const PANCAKE_ABI = [{'inputs':[{'internalType':'uint256','name':'amountOut','type':'uint256'},{'internalType':'uint256','name':'reserveIn','type':'uint256'},{'internalType':'uint256','name':'reserveOut','type':'uint256'}],'name':'getAmountIn','outputs':[{'internalType':'uint256','name':'amountIn','type':'uint256'}],'stateMutability':'pure','type':'function'},{'inputs':[{'internalType':'uint256','name':'amountIn','type':'uint256'},{'internalType':'uint256','name':'reserveIn','type':'uint256'},{'internalType':'uint256','name':'reserveOut','type':'uint256'}],'name':'getAmountOut','outputs':[{'internalType':'uint256','name':'amountOut','type':'uint256'}],'stateMutability':'pure','type':'function'},{'inputs':[{'internalType':'uint256','name':'amountOut','type':'uint256'},{'internalType':'address[]','name':'path','type':'address[]'}],'name':'getAmountsIn','outputs':[{'internalType':'uint256[]','name':'amounts','type':'uint256[]'}],'stateMutability':'view','type':'function'},{'inputs':[{'internalType':'uint256','name':'amountIn','type':'uint256'},{'internalType':'address[]','name':'path','type':'address[]'}],'name':'getAmountsOut','outputs':[{'internalType':'uint256[]','name':'amounts','type':'uint256[]'}],'stateMutability':'view','type':'function'},{'inputs':[{'internalType':'uint256','name':'amountA','type':'uint256'},{'internalType':'uint256','name':'reserveA','type':'uint256'},{'internalType':'uint256','name':'reserveB','type':'uint256'}],'name':'quote','outputs':[{'internalType':'uint256','name':'amountB','type':'uint256'}],'stateMutability':'pure','type':'function'}];
export const PANCAKE_ROUTER_V2 =  global.isMainnet ? '0x10ed43c718714eb63d5aa57b78b54704e256024e' : '0x9Ac64Cc6e4415144C455BD8E4837Fea55603e5c3';
export const PANCAKE_CHAIN_ID = global.isMainnet ? 56 : 97;

export const SwapPlatforms = {
  Incognito: 0,
  Pancake: 1,
};