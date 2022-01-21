import { COLORS } from '@src/styles';

export const mapLiquidityHistoryStatusColor = (statusMessage) => {
  let color;
  switch (statusMessage) {
  case 'Complete':
    color =  COLORS.green;
    break;
  case 'Failed':
    color = COLORS.red;
    break;
  default:
    color = undefined;
  }
  return color;
};
