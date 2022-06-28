export enum OutputEventTypes {
  Connected = 'aut-onConnected',
  Disconnected = 'aut-onDisconnected',
  Init = 'initSkillwalletAuth',
  ActivateSuccess = 'activateSkillWalletCommunitySuccess',
  ActivateError = 'activateSkillWalletCommunityError',
}

export enum InputEventTypes {
  Activate = 'activateSkillwalletCommunity',
  SkillWalletActivated = 'onSkillWalletActivated',
}
