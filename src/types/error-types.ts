// eslint-disable-next-line no-shadow
export enum ErrorTypes {
  SkillWalletExistsButInactive = 'SkillWallet exists but is inactive',
  SkillWalletNotFound = 'SkillWallet not found',
  CommunitySlotsFull = 'There are no free slots in this community.',
  AlreadyAMember = 'You are already a member of this community.',
  SkillWalletWithThisAddressAlreadyRegistered = 'You already registered a SkillWallet for this wallet address.',
  CouldNotGetActivationNonce = 'Failed to retrieve activation nonce.',
  GetAccountsInProgress = 'Waiting for MetaMask login.',
}
