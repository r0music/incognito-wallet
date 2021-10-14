import { combineReducers } from 'redux';
import { homeReducer as home } from './features/Home';
import { portfolioReducer as portfolio } from './features/Portfolio';
import { poolsReducer as pools } from './features/Pools';
import { swapReducer as swap } from './features/Swap';
import { orderLimitReducer as orderLimit } from './features/OrderLimit';
import { tradeReducer as trade } from './features/Trade';
import { chartReducer as chart } from './features/Chart';
import { contributeHistoriesReducer as contributeHistories } from './features/ContributeHistories';
import { removePoolHistoriesReducer as removePoolHistories } from './features/RemovePoolHistories';
import { withdrawRewardHistoriesReducer as withdrawRewardHistories } from './features/WithdrawRewardHistories';
import { stakingReducer as staking } from './features/Staking';
import { liquidityReducer as liquidity } from './features/Liquidity';
import { pairsReducer as pairs } from './features/PairList';
import { liquidityHistoryReducer as liquidityHistory } from './features/LiquidityHistories';

const pDexV3Reducer = combineReducers({
  home,
  portfolio,
  pools,
  swap,
  orderLimit,
  trade,
  chart,
  contributeHistories,
  removePoolHistories,
  withdrawRewardHistories,
  staking,
  liquidity,
  liquidityHistory,
  pairs,
});

export default pDexV3Reducer;
