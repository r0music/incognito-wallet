
import React from 'react';

const withSwap = WrappedComp => (props) => {
  const {
    onChangeInputToken,
    onChangeInputText,
    onChangeOutputToken,
    inputToken,
    inputText,
    outputToken,
    inputBalance,
  } = props;

  const swapTokens = () => {
    if (!inputToken || !outputToken || inputBalance === null) {
      return;
    }
    onChangeOutputToken(inputToken);
    onChangeInputToken(outputToken);
    onChangeInputText(inputText);
  };

  return (
    <WrappedComp
      {...{
        ...props,
        onSwapTokens: swapTokens,
      }}
    />
  );
};

export default withSwap;
