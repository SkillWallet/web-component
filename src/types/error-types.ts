// eslint-disable-next-line no-shadow
export enum ErrorTypes {
  SkillWalletExistsButInactive = 'SkillWallet exists but is inactive',
  SkillWalletNotFound = 'SkillWallet not found',
  CommunitySlotsFull = 'There are no free slots in this community.',
  AlreadyAMember = 'You are already a member of this community.',
  SkillWalletWithThisAddressAlreadyRegistered = 'You already registered a SkillWallet for this wallet address.',
}
// eslint-disable-next-line @typescript-eslint/no-empty-interface
// eslint-disable-next-line max-classes-per-file
// export class SkillWalletExistsButInactiveError extends Error {
//   constructor(msg = 'SkillWallet exists but is inactive.') {
//     super(msg);

//     // Set the prototype explicitly.
//     Object.setPrototypeOf(this, SkillWalletExistsButInactiveError.prototype);
//   }
// }

// export class SkillWalletNotFoundError extends Error {
//   constructor(msg = 'SkillWallet not found.') {
//     super(msg);

//     // Set the prototype explicitly.
//     Object.setPrototypeOf(this, SkillWalletNotFoundError.prototype);
//   }
// }
