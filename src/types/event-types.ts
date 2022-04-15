export enum OutputEventTypes {
  Login = 'onSkillwalletLogin',
  SkillWalletActivated = 'onSkillWalletActivated',
  Init = 'initSkillwalletAuth',
  ActivateSuccess = 'activateSkillWalletCommunitySuccess',
  ActivateError = 'activateSkillWalletCommunityError',
}

export enum InputEventTypes {
  Activate = 'activateSkillwalletCommunity',
  SkillWalletActivated = 'onSkillWalletActivated',
}
