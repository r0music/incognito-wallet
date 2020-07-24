import {
  ACTION_FETCHING,
  ACTION_FETCHED,
  ACTION_FETCH_FAIL,
} from './Profile.constant';
import { apiGetProfile } from './Profile.services';
import { profileSelector } from './Profile.selector';

export const actionFetching = () => ({
  type: ACTION_FETCHING,
});

export const actionFetched = (payload) => ({
  type: ACTION_FETCHED,
  payload,
});

export const actionFetchFail = () => ({
  type: ACTION_FETCH_FAIL,
});

export const actionFetch = () => async (dispatch, getState) => {
  try {
    const state = getState();
    const { isFetched } = profileSelector(state);
    if (isFetched) {
      return;
    }
    await dispatch(actionFetching());
    const data = await apiGetProfile();
    await dispatch(actionFetched(data));
  } catch (error) {
    await dispatch(actionFetchFail());
  }
};
