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
import secp256k1 from 'secp256k1';
import bs58 from 'bs58';
import eutil from 'ethereumjs-util';
import Wallet from 'ethereumjs-wallet';
import { 
  formConfigs, 
  listDecimals, 
  MULTI_CALL_ABI, 
  MULTI_CALL_CONTRACT, 
  PANCAKE_ABI, 
  PANCAKE_FACOTRY_ABI, 
  PANCAKE_FACTORY_ADDRESS, 
  PANCAKE_PAIR_ABI, 
  PANCAKE_ROUTER_V2 
} from './Swap.constant';

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

export const calMinAmountExpectedToFixed = ({ maxGet, slippagetolerance, pDecimals }) => {
  const originalMinAmountExpected = calMintAmountExpected({ maxGet, slippagetolerance });
  const minAmountExpectedToHumanAmount = convert.toHumanAmount(originalMinAmountExpected, pDecimals);
  return format.toFixed(minAmountExpectedToHumanAmount, pDecimals);
};

const listCommon = [...Object.keys(listDecimals)];
const web3 = new Web3(CONSTANTS.BSC_HOST);
const MULTI_CALL_INST = new web3.eth.Contract(MULTI_CALL_ABI, MULTI_CALL_CONTRACT);
const FACTORY_INST = new web3.eth.Contract(PANCAKE_FACOTRY_ABI, PANCAKE_FACTORY_ADDRESS);
const PANCKAE_ROUTER_INST = new web3.eth.Contract(PANCAKE_ABI, PANCAKE_ROUTER_V2);

export async function getBestRateFromPancake(sourceToken, destToken, amount, chainID, isSwapExactOut) {
  let pairList = [];
  // get list LPs
  let abiCallGetLPs = [];
  let token_pair = [];
  let listTokens = listCommon.slice();
  let listTokenDecimals = Object.assign({}, listDecimals);

  [sourceToken, destToken].forEach(
    function(item) {
      if (!listTokenDecimals[item.address.toLowerCase()]) {
        listTokenDecimals[item.address] = {decimals: item.decimals, symbol: item.symbol};
        listTokens.push(item.address);
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
  let listPairExist = [];
  let getPairResrved = [];
  for (let i = 0; i < listLPs.length; i++) {
    if (!listLPs[i].success) {
      continue;
    }
    const contractLPAddress = '0x' + listLPs[i].returnData.substring(26);
    if (contractLPAddress === '0x0000000000000000000000000000000000000000') {
      continue;
    }
    const contractTemp = new web3.eth.Contract(PANCAKE_PAIR_ABI, contractLPAddress);
    const temp = contractTemp.methods.getReserves().encodeABI();
    const temp2 = contractTemp.methods.token0().encodeABI();
    getPairResrved.push([contractLPAddress, temp]);
    getPairResrved.push([contractLPAddress, temp2]);
    listPairExist.push(token_pair[i]);
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
    let token1 = listPairExist[i / 2].token1;
    if (listPairExist[i / 2].token0.toLowerCase() !== token0.toLowerCase()) {
      token1 = listPairExist[i / 2].token0;
    }
    const token0Ins = new Token(chainID, token0, listTokenDecimals[token0].decimals, listTokenDecimals[token0].symbol);
    const token1Ins = new Token(chainID, token1, listTokenDecimals[token1].decimals, listTokenDecimals[token1].symbol);
    const pair = new Pair(new TokenAmount(token0Ins, reserve0), new TokenAmount(token1Ins, reserve1));
    pairList.push(pair);
  }

  const sellAmount = JSBI.BigInt(amount * 10 ** (isSwapExactOut ? destToken.decimals : sourceToken.decimals));
  const seltTokenInst = new Token(chainID, sourceToken.address, sourceToken.decimals, sourceToken.symbol);
  const buyTokenInst = new Token(chainID, destToken.address, destToken.decimals, destToken.symbol);
  let result;
  if (!isSwapExactOut) {  
    result = Trade.bestTradeExactIn(
      pairList,
      new TokenAmount(seltTokenInst, sellAmount),
      buyTokenInst,
      { maxNumResults: 1 },
    );
  } else {
    result = Trade.bestTradeExactOut(
      pairList,
      seltTokenInst,
      new TokenAmount(buyTokenInst, sellAmount),
      { maxNumResults: 1 },
    );
  }
  if (result.length === 0) {
    console.log('Can not find the best path for this pair');
    return null, null;
  }

  const bestPath = result[0].route.path;
  let paths = [];
  bestPath.forEach(
    function (item) {
      paths.push(item.address);
    }
  );

  let outputs;
  if (!isSwapExactOut) {
    outputs = await PANCKAE_ROUTER_INST.methods.getAmountsOut(sellAmount.toString(), paths).call();
  } else {
    outputs = await PANCKAE_ROUTER_INST.methods.getAmountsIn(sellAmount.toString(), paths).call();
  }
  return {paths, outputs};
}

// generated eth from incKey success
function genETHAccFromIncPrivKey(incPrivKey) {
  const web3 = new Web3();
  let bytes = bs58.decode(incPrivKey);
  bytes = bytes.slice(1, bytes.length - 4);
  const privHexStr = web3.utils.bytesToHex(bytes);
  let privKey = web3.utils.keccak256(privHexStr);
  let temp, temp2;
  temp = web3.utils.hexToBytes(privKey);
  temp2 = new Uint8Array(temp);
  while (!secp256k1.privateKeyVerify(temp2)) {
    privKey = web3.utils.keccak256(privKey);
    temp = web3.utils.hexToBytes(privKey);
    temp2 = new Uint8Array(temp);
  }
  const fixturePrivateBuffer = Buffer.from(privKey.replace('0x', ''), 'hex');
  const fixtureWallet = Wallet.fromPrivateKey(fixturePrivateBuffer);
  return fixtureWallet;
}

function signMessage(mess, privateKey) {
  let dataToSigBuff = Buffer.from(mess.replace('0x', ''), 'hex');
  let privateKeyBuff = Buffer.from(privateKey.replace('0x', ''), 'hex');
  let signature = eutil.ecsign(dataToSigBuff, privateKeyBuff);
  return '0x' + signature.r.toString('hex') + signature.s.toString('hex') + '0' + (signature.v - 27).toString(16);
}