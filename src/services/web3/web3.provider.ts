import {
  PartnersAgreementContractEventType,
  SkillWalletCommunityContractEventType,
  SkillWalletContractEventType,
  Web3PartnersAgreementProvider,
  Web3ProviderExtras,
  Web3SkillWalletCommunityProvider,
  Web3SkillWalletProvider,
} from '@skill-wallet/sw-abi-types';
import { ContractInterface, ethers } from 'ethers';
import { env } from './env';

export const changeNetwork = async () => {
  if (!window.ethereum.selectedAddress) {
    await window.ethereum.request({ method: 'eth_requestAccounts' });
  }
  // try {
  await window.ethereum.request(env.CHANGE_NETWORK_METADATA);
  // } catch (switchError) {
  //   // This error code indicates that the chain has not been added to MetaMask.
  //   if (switchError.code === 4902) {
  //     try {
  //       await window.ethereum.request(env.CHANGE_NETWORK_METADATA);
  //     } catch (addError) {
  //       // handle "add" error
  //     }
  //   }
  //   // handle other "switch" errors
  // }
};

export const SkillWalletContractProvier: typeof Web3SkillWalletProvider = (
  address: string,
  extras?: Web3ProviderExtras<SkillWalletContractEventType>
) => {
  return Web3SkillWalletProvider(address, {
    beforeRequest: () => changeNetwork(),
    ...(extras || {}),
  });
};

export const SkillWalletCommunityContractProvier: typeof Web3SkillWalletCommunityProvider = (
  address: string,
  extras?: Web3ProviderExtras<SkillWalletCommunityContractEventType>
) => {
  return Web3SkillWalletCommunityProvider(address, {
    beforeRequest: () => changeNetwork(),
    ...(extras || {}),
  });
};

export const PartnersAgreementContractProvier: typeof Web3PartnersAgreementProvider = (
  address: string,
  extras?: Web3ProviderExtras<PartnersAgreementContractEventType>
) => {
  return Web3PartnersAgreementProvider(address, {
    beforeRequest: () => changeNetwork(),
    ...(extras || {}),
  });
};
