import _ from 'lodash';

export class PanCakeTokenModel {
  constructor(data = {}) {
    if (!data) {
      return null;
    }

    this.tokenID = data.ID;    // incognito token ID
    this.contractID = data.ContractID;
    this.name = data.Name;
    this.symbol = data.Symbol;
    this.decimals = data.Decimals;
    this.pDecimals = data.PDecimals;
    this.protocol = data.Protocol;
    this.pricePrv = data.PricePrv;
    this.verify = data.Verify;
  }
}

// export class PancakePairsModel {
//   constructor(tokens = []) {
//     if (!tokens) {
//       return null;
//     }
//     if (tokens.length == 0) {
//       return [];
//     } 
//     tokens = _.orderBy(tokens, ['tokenID'], ['asce']);
//     let pairs = [];

//     for (let i = 0; i < tokens.length - 1; i++) {
//       for (let j = i+1; j < tokens.length; j++) {
//         let pairID = tokens[i].tokenID + '-' + tokens[j].tokenID;
//         let pair = {
//           pairID: pairID,
//           tokenId1: tokens[i].tokenID,
//           tokenId2: tokens[j].tokenID,
//           contractId1: tokens[i].contractID,
//           contractId2: tokens[j].contractID,
//         };
//         pairs.push(pair);
//       }
//     }
//     return pairs;

//   }
// }