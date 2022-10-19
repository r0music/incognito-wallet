const PRIVACY_VERSION = 2;
const REMOTE_ADDRESS = '0x0000000000000000000000000000000000000000';

export type CreateTransactionPAppsPayload = {
  pDexV3Instance: any;
  sellTokenID: string;
  senderFeeAddressShardID: number;

  feeReceiverAddress: string;
  feeTokenID: string;
  feeAmount: string;

  sellAmount: string;
  callContract: string;
  callData: string;
  exchangeNetworkID: number;

  sellChildTokenID: string;
  buyContractID: string;

  remoteAddress?: string;
};

const createTransactionPApps = async (
  params: CreateTransactionPAppsPayload,
) => {
  try {
    const {
      pDexV3Instance,
      sellTokenID,
      senderFeeAddressShardID,

      feeReceiverAddress,
      feeTokenID,
      feeAmount,

      sellAmount,
      callContract,
      callData,
      exchangeNetworkID,

      sellChildTokenID,
      buyContractID,

      remoteAddress = REMOTE_ADDRESS,
    } = params;

    // console.log('[createTransactionPApps] params ', params);
    // console.log('[createTransactionPApps] remoteAddress ', remoteAddress);
    const tx = await pDexV3Instance.createTransactionPApps({
      transfer: { version: PRIVACY_VERSION },
      extra: {
        sellTokenID,
        senderFeeAddressShardID,

        feeReceiverAddress,
        feeAmount,
        feeTokenID,

        // data metadata
        sellAmount,
        callContract, // proxy route
        callData,
        exchangeNetworkID, // networkID exchange, exp: ETH = 1
        sellChildTokenID,
        buyContractID,
        // remoteAddress, case reDeposit = 0x0000000000000000000000000000000000000000
        // send out EVN use user address
        remoteAddress,
      },
    });
    console.log('[createTransactionPApps] tx ', tx);
    if (!tx) {
      console.log('[createTransactionPApps] TO DO ');
    }
  } catch (error) {
    console.log('[createTransactionPApps] ERROR ', error);
  }
};

const abc = () => {};

const TransactionHandler = {
  createTransactionPApps,
  abc,
};

export default TransactionHandler;
