import { ContractInterface, ethers } from 'ethers';
import { env } from './env';

export const changeNetwork = async () => {
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

export const Web3ContractProvider = async (addressOrName: string, contractInterface: ContractInterface) => {
  await changeNetwork();

  if (!window.ethereum.selectedAddress) {
    await window.ethereum.enable();
  }

  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();
  return new ethers.Contract(addressOrName, contractInterface, signer);
};
