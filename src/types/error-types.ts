// eslint-disable-next-line @typescript-eslint/no-empty-interface
export class SkillWalletExistsButInactiveError extends Error {
  constructor(msg = 'Skill wallet inactive.') {
    super(msg);
    // Set the prototype explicitly.
    Object.setPrototypeOf(this, SkillWalletExistsButInactiveError.prototype);
  }
}
