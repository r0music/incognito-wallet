import { PRV } from '@src/constants/common';
import SelectedPrivacy from '@src/models/selectedPrivacy';
import isNaN from 'lodash/isNaN';
import convert from '@src/utils/convert';
import format from '@src/utils/format';
import BigNumber from 'bignumber.js';
import { formValueSelector } from 'redux-form';
import floor from 'lodash/floor';
import Web3 from 'web3';
import { CONSTANTS } from '@screens/Wallet/features/BridgeConnect/WalletConnect.constants';
import { Token, TokenAmount, JSBI, Trade, Pair } from '@pancakeswap/sdk';
import { formConfigs } from './Swap.constant';

export const minFeeValidator = (feetokenData) => {
  if (!feetokenData) {
    return undefined;
  }
  try {
    const {
      origininalFeeAmount,
      minFeeOriginal,
      symbol,
      minFeeAmountText,
    } = feetokenData;
    if (
      new BigNumber(origininalFeeAmount).isLessThan(
        new BigNumber(minFeeOriginal),
      )
    ) {
      return `Amount must be larger than ${minFeeAmountText} ${symbol}`;
    }
  } catch (error) {
    console.log('minFeeValidator-error', error);
  }
  return undefined;
};

export const availablePayFeeByPRVValidator = ({
  origininalFeeAmount,
  prvBalance = 0,
  usingFeeBySellToken,
  networkfee,
} = {}) => {
  if (usingFeeBySellToken) {
    return undefined;
  }
  try {
    let availablePRVBalance = new BigNumber(prvBalance)
      .minus(origininalFeeAmount)
      .minus(networkfee);
    if (availablePRVBalance.isLessThan(0)) {
      return `Your ${PRV.symbol} balance is insufficient.`;
    }
  } catch (error) {
    console.log('availablePayFeeByPRVValidator-error', error);
  }
  return undefined;
};

export const maxAmountValidatorForSellInput = (sellInputAmount) => {
  try {
    if (!sellInputAmount) {
      return undefined;
    }
    const {
      originalAmount,
      availableOriginalAmount,
      symbol,
      availableAmountText,
    } = sellInputAmount || {};
    if (
      new BigNumber(originalAmount).gt(new BigNumber(availableOriginalAmount))
    ) {
      return new BigNumber(availableOriginalAmount).gt(0)
        ? `Max amount you can swap is ${availableAmountText} ${symbol}`
        : `Your ${symbol} balance is insufficient.`;
    }
  } catch (error) {
    console.log('maxAmountValidatorForSellInput-error', error);
  }

  return undefined;
};

export const maxAmountValidatorForSlippageTolerance = (slippagetolerance) => {
  try {
    if (!slippagetolerance) {
      return undefined;
    }
    let slippagetoleranceAmount = convert.toNumber(slippagetolerance, true);
    if (isNaN(slippagetoleranceAmount) || !slippagetoleranceAmount) {
      return 'Must be a number';
    }
    if (slippagetoleranceAmount >= 100) {
      return `Enter a number from 0 to ${format.number(99.99)} `;
    }
  } catch (error) {
    console.log('maxAmountValidatorForSlippageTolerance-error', error);
  }

  return undefined;
};

export const getInputAmount = (
  state,
  getInputToken,
  focustoken,
  feeData,
  { networkfee },
  isGettingBalance,
) => (field) => {
  try {
    const token: SelectedPrivacy = getInputToken(field);
    if (!token.tokenId) {
      return {
        amount: '',
        originalAmount: 0,
        isFocus: false,
      };
    }
    const selector = formValueSelector(formConfigs.formName);
    const amountText = selector(state, field);
    let amount = convert.toNumber(amountText, true) || 0;
    const originalAmount = convert.toOriginalAmount(amount, token.pDecimals);
    let availableOriginalAmount = token.amount || 0;
    let availableAmountNumber = 0;
    let availableAmountText = '';
    const usingFee =
      token.tokenId === feeData.feetoken && field === formConfigs.selltoken;
    if (usingFee) {
      availableOriginalAmount = new BigNumber(availableOriginalAmount)
        .minus(new BigNumber(feeData.origininalFeeAmount))
        .toNumber();
    }
    if (usingFee && token.isMainCrypto) {
      availableOriginalAmount = new BigNumber(availableOriginalAmount)
        .minus(networkfee)
        .toNumber();
    }
    if (new BigNumber(availableOriginalAmount).isGreaterThan(0)) {
      availableAmountNumber = convert.toHumanAmount(
        availableOriginalAmount,
        token.pDecimals,
      );
      availableAmountText = format.toFixed(
        availableAmountNumber,
        token.pDecimals,
      );
    }
    const focus = token.tokenId === focustoken;
    return {
      focus,
      tokenId: token.tokenId,
      symbol: token.symbol,
      pDecimals: token.pDecimals,
      isMainCrypto: token.isMainCrypto,

      amount,
      originalAmount,
      amountText,

      availableOriginalAmount,
      availableAmountText,
      availableAmountNumber,

      usingFee,
      loadingBalance: isGettingBalance.includes(token.tokenId),

      balance: token.amount,
      balanceStr: format.amountVer2(token.amount, token.pDecimals),

      tokenData: token,
    };
  } catch (error) {
    console.log('inputAmountSelector error', error);
  }
};

export const calMintAmountExpected = ({ maxGet, slippagetolerance } = {}) => {
  try {
    let maxGetBn = new BigNumber(maxGet);
    const amount = floor(
      maxGetBn.minus(maxGetBn.multipliedBy(slippagetolerance / 100)).toNumber(),
    );
    return amount;
  } catch (error) {
    console.log('error', error);
  }
  return maxGet;
};

const listDecimals = {
  '0x2170ed0880ac9a755fd29b2688956bd959f933f8': {decimals: 18, symbol: 'eth'},
  '0x1af3f329e8be154074d8769d1ffa4ee058b1dbc3': {decimals: 18, symbol: 'dai'},
  '0x55d398326f99059ff775485246999027b3197955': {decimals: 18, symbol: 'usdt'},
  '0xe9e7cea3dedca5984780bafc599bd69add087d56': {decimals: 18, symbol: 'busd'},
  '0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c': {decimals: 18, symbol: 'wbnb'},
};
const listCommon = Object.keys(listDecimals);
const web3 = new Web3(CONSTANTS.BSC_HOST);
const MULTI_CALL_CONTRACT_TESTNET = '0xff6fd90a470aaa0c1b8a54681746b07acdfedc9b';
const MULTI_CALL_ABI = [{'inputs':[{'components':[{'internalType':'address','name':'target','type':'address'},{'internalType':'bytes','name':'callData','type':'bytes'}],'internalType':'struct Multicall2.Call[]','name':'calls','type':'tuple[]'}],'name':'aggregate','outputs':[{'internalType':'uint256','name':'blockNumber','type':'uint256'},{'internalType':'bytes[]','name':'returnData','type':'bytes[]'}],'stateMutability':'nonpayable','type':'function'},{'inputs':[{'components':[{'internalType':'address','name':'target','type':'address'},{'internalType':'bytes','name':'callData','type':'bytes'}],'internalType':'struct Multicall2.Call[]','name':'calls','type':'tuple[]'}],'name':'blockAndAggregate','outputs':[{'internalType':'uint256','name':'blockNumber','type':'uint256'},{'internalType':'bytes32','name':'blockHash','type':'bytes32'},{'components':[{'internalType':'bool','name':'success','type':'bool'},{'internalType':'bytes','name':'returnData','type':'bytes'}],'internalType':'struct Multicall2.Result[]','name':'returnData','type':'tuple[]'}],'stateMutability':'nonpayable','type':'function'},{'inputs':[{'internalType':'uint256','name':'blockNumber','type':'uint256'}],'name':'getBlockHash','outputs':[{'internalType':'bytes32','name':'blockHash','type':'bytes32'}],'stateMutability':'view','type':'function'},{'inputs':[],'name':'getBlockNumber','outputs':[{'internalType':'uint256','name':'blockNumber','type':'uint256'}],'stateMutability':'view','type':'function'},{'inputs':[],'name':'getCurrentBlockCoinbase','outputs':[{'internalType':'address','name':'coinbase','type':'address'}],'stateMutability':'view','type':'function'},{'inputs':[],'name':'getCurrentBlockDifficulty','outputs':[{'internalType':'uint256','name':'difficulty','type':'uint256'}],'stateMutability':'view','type':'function'},{'inputs':[],'name':'getCurrentBlockGasLimit','outputs':[{'internalType':'uint256','name':'gaslimit','type':'uint256'}],'stateMutability':'view','type':'function'},{'inputs':[],'name':'getCurrentBlockTimestamp','outputs':[{'internalType':'uint256','name':'timestamp','type':'uint256'}],'stateMutability':'view','type':'function'},{'inputs':[{'internalType':'address','name':'addr','type':'address'}],'name':'getEthBalance','outputs':[{'internalType':'uint256','name':'balance','type':'uint256'}],'stateMutability':'view','type':'function'},{'inputs':[],'name':'getLastBlockHash','outputs':[{'internalType':'bytes32','name':'blockHash','type':'bytes32'}],'stateMutability':'view','type':'function'},{'inputs':[{'internalType':'bool','name':'requireSuccess','type':'bool'},{'components':[{'internalType':'address','name':'target','type':'address'},{'internalType':'bytes','name':'callData','type':'bytes'}],'internalType':'struct Multicall2.Call[]','name':'calls','type':'tuple[]'}],'name':'tryAggregate','outputs':[{'components':[{'internalType':'bool','name':'success','type':'bool'},{'internalType':'bytes','name':'returnData','type':'bytes'}],'internalType':'struct Multicall2.Result[]','name':'returnData','type':'tuple[]'}],'stateMutability':'nonpayable','type':'function'},{'inputs':[{'internalType':'bool','name':'requireSuccess','type':'bool'},{'components':[{'internalType':'address','name':'target','type':'address'},{'internalType':'bytes','name':'callData','type':'bytes'}],'internalType':'struct Multicall2.Call[]','name':'calls','type':'tuple[]'}],'name':'tryBlockAndAggregate','outputs':[{'internalType':'uint256','name':'blockNumber','type':'uint256'},{'internalType':'bytes32','name':'blockHash','type':'bytes32'},{'components':[{'internalType':'bool','name':'success','type':'bool'},{'internalType':'bytes','name':'returnData','type':'bytes'}],'internalType':'struct Multicall2.Result[]','name':'returnData','type':'tuple[]'}],'stateMutability':'nonpayable','type':'function'}];
const MULTI_CALL_INST = new web3.eth.Contract(MULTI_CALL_ABI, MULTI_CALL_CONTRACT_TESTNET);

const PANCAKE_PAIR_ABI = [{'inputs':[],'name':'MINIMUM_LIQUIDITY','outputs':[{'internalType':'uint256','name':'','type':'uint256'}],'stateMutability':'pure','type':'function'},{'inputs':[],'name':'factory','outputs':[{'internalType':'address','name':'','type':'address'}],'stateMutability':'view','type':'function'},{'inputs':[],'name':'getReserves','outputs':[{'internalType':'uint112','name':'reserve0','type':'uint112'},{'internalType':'uint112','name':'reserve1','type':'uint112'},{'internalType':'uint32','name':'blockTimestampLast','type':'uint32'}],'stateMutability':'view','type':'function'},{'inputs':[],'name':'kLast','outputs':[{'internalType':'uint256','name':'','type':'uint256'}],'stateMutability':'view','type':'function'},{'inputs':[],'name':'price0CumulativeLast','outputs':[{'internalType':'uint256','name':'','type':'uint256'}],'stateMutability':'view','type':'function'},{'inputs':[],'name':'price1CumulativeLast','outputs':[{'internalType':'uint256','name':'','type':'uint256'}],'stateMutability':'view','type':'function'},{'inputs':[],'name':'token0','outputs':[{'internalType':'address','name':'','type':'address'}],'stateMutability':'view','type':'function'},{'inputs':[],'name':'token1','outputs':[{'internalType':'address','name':'','type':'address'}],'stateMutability':'view','type':'function'}];
const PANCAKE_FACTORY_ADDRESS = '0xcA143Ce32Fe78f1f7019d7d551a6402fC5350c73';
const PANCAKE_FACOTRY_ABI = [{'inputs':[{'internalType':'address','name':'_feeToSetter','type':'address'}],'payable':false,'stateMutability':'nonpayable','type':'constructor'},{'anonymous':false,'inputs':[{'indexed':true,'internalType':'address','name':'token0','type':'address'},{'indexed':true,'internalType':'address','name':'token1','type':'address'},{'indexed':false,'internalType':'address','name':'pair','type':'address'},{'indexed':false,'internalType':'uint256','name':'','type':'uint256'}],'name':'PairCreated','type':'event'},{'constant':true,'inputs':[],'name':'INIT_CODE_PAIR_HASH','outputs':[{'internalType':'bytes32','name':'','type':'bytes32'}],'payable':false,'stateMutability':'view','type':'function'},{'constant':true,'inputs':[{'internalType':'uint256','name':'','type':'uint256'}],'name':'allPairs','outputs':[{'internalType':'address','name':'','type':'address'}],'payable':false,'stateMutability':'view','type':'function'},{'constant':true,'inputs':[],'name':'allPairsLength','outputs':[{'internalType':'uint256','name':'','type':'uint256'}],'payable':false,'stateMutability':'view','type':'function'},{'constant':false,'inputs':[{'internalType':'address','name':'tokenA','type':'address'},{'internalType':'address','name':'tokenB','type':'address'}],'name':'createPair','outputs':[{'internalType':'address','name':'pair','type':'address'}],'payable':false,'stateMutability':'nonpayable','type':'function'},{'constant':true,'inputs':[],'name':'feeTo','outputs':[{'internalType':'address','name':'','type':'address'}],'payable':false,'stateMutability':'view','type':'function'},{'constant':true,'inputs':[],'name':'feeToSetter','outputs':[{'internalType':'address','name':'','type':'address'}],'payable':false,'stateMutability':'view','type':'function'},{'constant':true,'inputs':[{'internalType':'address','name':'','type':'address'},{'internalType':'address','name':'','type':'address'}],'name':'getPair','outputs':[{'internalType':'address','name':'','type':'address'}],'payable':false,'stateMutability':'view','type':'function'},{'constant':false,'inputs':[{'internalType':'address','name':'_feeTo','type':'address'}],'name':'setFeeTo','outputs':[],'payable':false,'stateMutability':'nonpayable','type':'function'},{'constant':false,'inputs':[{'internalType':'address','name':'_feeToSetter','type':'address'}],'name':'setFeeToSetter','outputs':[],'payable':false,'stateMutability':'nonpayable','type':'function'}];
const FACTORY_INST = new web3.eth.Contract(PANCAKE_FACOTRY_ABI, PANCAKE_FACTORY_ADDRESS);

const PANCAKE_ABI = [{'inputs':[{'internalType':'uint256','name':'amountOut','type':'uint256'},{'internalType':'uint256','name':'reserveIn','type':'uint256'},{'internalType':'uint256','name':'reserveOut','type':'uint256'}],'name':'getAmountIn','outputs':[{'internalType':'uint256','name':'amountIn','type':'uint256'}],'stateMutability':'pure','type':'function'},{'inputs':[{'internalType':'uint256','name':'amountIn','type':'uint256'},{'internalType':'uint256','name':'reserveIn','type':'uint256'},{'internalType':'uint256','name':'reserveOut','type':'uint256'}],'name':'getAmountOut','outputs':[{'internalType':'uint256','name':'amountOut','type':'uint256'}],'stateMutability':'pure','type':'function'},{'inputs':[{'internalType':'uint256','name':'amountOut','type':'uint256'},{'internalType':'address[]','name':'path','type':'address[]'}],'name':'getAmountsIn','outputs':[{'internalType':'uint256[]','name':'amounts','type':'uint256[]'}],'stateMutability':'view','type':'function'},{'inputs':[{'internalType':'uint256','name':'amountIn','type':'uint256'},{'internalType':'address[]','name':'path','type':'address[]'}],'name':'getAmountsOut','outputs':[{'internalType':'uint256[]','name':'amounts','type':'uint256[]'}],'stateMutability':'view','type':'function'},{'inputs':[{'internalType':'uint256','name':'amountA','type':'uint256'},{'internalType':'uint256','name':'reserveA','type':'uint256'},{'internalType':'uint256','name':'reserveB','type':'uint256'}],'name':'quote','outputs':[{'internalType':'uint256','name':'amountB','type':'uint256'}],'stateMutability':'pure','type':'function'}];
const PANCAKE_ROUTER_V2 =  '0x10ed43c718714eb63d5aa57b78b54704e256024e';
const PANCKAE_ROUTER_INST = new web3.eth.Contract(PANCAKE_ABI, PANCAKE_ROUTER_V2);

async function getBestRate(sourceToken, destToken, amount, chainID) {
  let pairList = [];
  // get list LPs
  let abiCallGetLPs = [];
  let token_pair = [];
  let listTokens = listCommon;
  let listTokenDecimals = listDecimals;

  [sourceToken, destToken].forEach(
    function(item) {
      if (!listTokenDecimals[item.address]) {
        listTokenDecimals[item.address] = {decimals: item.decimals, symbol: item.symbol};
        listTokens.push[item.address];
      }
    }
  );

  for (let i = 0; i < listTokens.length - 1; i++) {
    for (let j = i + 1; j < listTokens.length; j++) {
      if (listTokens[i] === listTokens[j]) continue;
      const temp = FACTORY_INST.methods.getPair(listTokens[i], listTokens[j]).encodeABI();
      abiCallGetLPs.push([PANCAKE_FACTORY_ADDRESS, temp]);
      token_pair.push({token0: listTokens[i], token1: listTokens[j]});
    }
  }

  const listLPs = await MULTI_CALL_INST.methods.tryAggregate(false, abiCallGetLPs).call();
  let getPairResrved = [];
  for (let i = 0; i < listLPs.length; i++) {
    if (!listLPs[i].success) {
      token_pair.splice(i, 1);
      continue;
    }
    const contractLPAddress = '0x' + listLPs[i].returnData.substring(26);
    const contractTemp = new web3.eth.Contract(PANCAKE_PAIR_ABI, contractLPAddress);
    const temp = contractTemp.methods.getReserves().encodeABI();
    const temp2 = contractTemp.methods.token0().encodeABI();
    getPairResrved.push([contractLPAddress, temp]);
    getPairResrved.push([contractLPAddress, temp2]);
  }

  const listReserved = await MULTI_CALL_INST.methods.tryAggregate(false, getPairResrved).call();
  if (listReserved.length < 2) {
    console.log('no LPs exist!!!');
    return null, null;
  }

  for (let i = 0; i < listReserved.length; i+=2) {
    const reserve0 = JSBI.BigInt('0x' + listReserved[i].returnData.substring(2, 66), 16);
    const reserve1 = JSBI.BigInt('0x' + listReserved[i].returnData.substring(66, 130), 16);
    const token0 = '0x' + listReserved[i + 1].returnData.substring(26);
    let token1 = token_pair[i / 2].token1;
    if (token_pair[i / 2].token0.toLowerCase() !== token0.toLowerCase()) {
      token1 = token_pair[i / 2].token0;
    }
    const token0Ins = new Token(chainID, token0, listTokenDecimals[token0].decimals, listTokenDecimals[token0].symbol);
    const token1Ins = new Token(chainID, token1, listTokenDecimals[token1].decimals, listTokenDecimals[token1].symbol);
    const pair = new Pair(new TokenAmount(token0Ins, reserve0), new TokenAmount(token1Ins, reserve1));
    pairList.push(pair);
  }

  const sellAmount = JSBI.BigInt(amount * 10 ** sourceToken.decimals);
  const seltTokenInst = new Token(chainID, sourceToken.address, sourceToken.decimals, sourceToken.symbol);
  const buyTokenInst = new Token(chainID, destToken.address, destToken.decimals, destToken.symbol);
  const result = Trade.bestTradeExactIn(
    pairList,
    new TokenAmount(seltTokenInst, sellAmount),
    buyTokenInst,
    { maxNumResults: 1 },
  );
  
  if (result.length === 0) {
    console.log('something went wrong');
    return null, null;
  }

  const bestPath = result[0].route.path;
  let paths = [];
  bestPath.forEach(
    function (item) {
      paths.push(item.address);
    }
  );

  const outputs = await PANCKAE_ROUTER_INST.methods.getAmountsOut(sellAmount.toString(), paths).call();
  return paths, outputs;
}