import { createSelector } from 'reselect';

const settingsSelector = createSelector(
  (state) => state.settings,
  (settings) => settings,
);

export const settings = state => state?.settings?.data;

export const videosSelector = createSelector(
  settingsSelector,
  ({ videos }) => videos
);

export const codepushVersionSelector = createSelector(
  settingsSelector,
  ({ codepushVer }) => codepushVer
);

export const newUserTutorialSelector = createSelector(
  settingsSelector,
  ({ newUserTutorial }) => newUserTutorial
);

export default {
  settings,
  videosSelector,
  codepushVersionSelector,
  newUserTutorialSelector,
};
