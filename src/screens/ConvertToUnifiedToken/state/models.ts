import PToken from '@src/models/pToken';
import SelectedPrivacy from '@src/models/selectedPrivacy';

export const TRANSACTION_CONVERT_STATUS = {
  PENDING: 'PENDING',
  PROCESSING: 'PROCESSING',
  SUCCESSFULLY: 'SUCCESSFULLY',
  FAILED: 'FAILED',
};

// status when convert from pToken to unifiedToken
export type ConvertStatus =
  | 'PENDING'
  | 'PROCESSING'
  | 'SUCCESSFULLY'
  | 'FAILED'
  | null;

export interface PTokenConvert extends SelectedPrivacy {
  // balance of pToken
  balance: number;
  // status convert
  convertStatus: ConvertStatus;
  // unifiedTokenId of pToken
  parentUnifiedTokenId: string;
  // parent unified token symbol
  parentUnifiedTokenSymbol: string;
}

export interface TokenConvert extends PToken {
  // balance all pToken of unified Token
  balance: number;
  // list pToken of unified Token
  listUnifiedToken: PTokenConvert[];
  // when user click to item
  selected: boolean;
}
