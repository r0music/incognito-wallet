import React from 'react';
import { useSelector } from 'react-redux';
import debounce from 'lodash/debounce';
import { validator } from '@src/components/core/reduxForm';
import convert from '@src/utils/convert';
import {
  feeDataSelector,
  networksSelector,
  isFetchingNetworksSelector,
} from '@src/components/EstimateFee/EstimateFee.selector';
import {
  selectedPrivacySelector,
  childSelectedPrivacySelector,
} from '@src/redux/selectors';
import { detectToken } from '@src/utils/misc';

export const enhanceAmountValidation = (WrappedComp) => (props) => {
  const feeData = useSelector(feeDataSelector);
  const selectedPrivacy = useSelector(selectedPrivacySelector.selectedPrivacy);
  const childSelectedPrivacy = useSelector(
    childSelectedPrivacySelector.childSelectedPrivacy,
  );

  const isFetchingNetworks = useSelector(isFetchingNetworksSelector);

  let networks = useSelector(networksSelector);

  const { fee, feeUnitByTokenId, minAmount, maxAmount } = feeData;
  const initialState = {
    maxAmountValidator: undefined,
    minAmountValidator: undefined,
    maxAmountSupportByVaultValidator: undefined,
  };
  const [state, setState] = React.useState({ ...initialState });
  const {
    maxAmountValidator,
    minAmountValidator,
    maxAmountSupportByVaultValidator,
  } = state;

  const setMaxAmountSupportByVaultValidator = debounce(async () => {
    const networkId = childSelectedPrivacy?.networkId;

    const currentNetwork = networks?.find(
      (network) => network.networkId === networkId,
    );
    const vault = currentNetwork?.vault;
    
    const _maxAmountSupportByVault = convert.toHumanAmount(
      vault,
      childSelectedPrivacy?.pDecimals,
    );

    let currentState = { ...state };
    if (Number.isFinite(_maxAmountSupportByVault)) {
      currentState = {
        ...state,
        maxAmountSupportByVaultValidator: validator.maxValue(
          _maxAmountSupportByVault,
          {
            message: `Max amount you can withdraw is ${_maxAmountSupportByVault} ${
              selectedPrivacy?.externalSymbol || selectedPrivacy?.symbol
            } on ${childSelectedPrivacy?.network} network`,
          },
        ),
      };
      await setState(currentState);
    }
  }, 200);

  const setFormValidator = debounce(async () => {
    const { maxAmountText, minAmountText } = feeData;
    const _maxAmount = convert.toNumber(maxAmountText, true);
    const _minAmount = convert.toNumber(minAmountText, true);
    let currentState = { ...state };
    if (Number.isFinite(_maxAmount)) {
      currentState = {
        ...state,
        maxAmountValidator: validator.maxValue(_maxAmount, {
          message:
            _maxAmount > 0
              ? `Max amount you can withdraw is ${maxAmountText} ${selectedPrivacy?.externalSymbol ||
                  selectedPrivacy?.symbol}`
              : 'Insufficient balance.',
        }),
      };
      await setState(currentState);
    }
    if (Number.isFinite(_minAmount)) {
      await setState({
        ...currentState,
        minAmountValidator: validator.minValue(_minAmount, {
          message: `Amount must be greater than ${minAmountText} ${selectedPrivacy?.externalSymbol ||
            selectedPrivacy?.symbol}`,
        }),
      });
    }
  }, 200);

  const getAmountValidator = () => {
    const val = [];
    if (minAmountValidator) val.push(minAmountValidator);
    if (maxAmountValidator) val.push(maxAmountValidator);
    if (maxAmountSupportByVaultValidator) val.push(maxAmountSupportByVaultValidator);
    if (
      selectedPrivacy?.isIncognitoToken ||
      detectToken.ispNEO(selectedPrivacy?.tokenId)
    ) {
      val.push(...validator.combinedNanoAmount);
    }
    val.push(...validator.combinedAmount);
    const values = Array.isArray(val) ? [...val] : [val];
    return values;
  };

  React.useEffect(() => {
    setFormValidator();
  }, [selectedPrivacy?.tokenId, fee, feeUnitByTokenId, maxAmount, minAmount]);

  React.useEffect(() => {
    if (
      selectedPrivacy?.isPUnifiedToken &&
      childSelectedPrivacy &&
      childSelectedPrivacy?.networkId !== 'INCOGNITO' &&
      isFetchingNetworks === false
    ) {
      setMaxAmountSupportByVaultValidator();
    } else {
      const currentState = {
        ...state,
        maxAmountSupportByVaultValidator: undefined,
      };
      setState(currentState);
    }
  }, [isFetchingNetworks]);

  const validateAmount = getAmountValidator();

  return (
    <WrappedComp
      {...{
        ...props,
        validateAmount,
        minAmountValidator,
        maxAmountValidator,
        maxAmountSupportByVaultValidator,
      }}
    />
  );
};
