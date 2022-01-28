import { ethers } from 'ethers';
import { asyncPoll, SkillWalletIDBadgeGenerator } from 'sw-web-shared';
import axios from 'axios';
import { SkillWalletAbi, PartnersAgreementABI, DitoCommunityAbi } from '@skill-wallet/sw-abi-types';
import dateFormat from 'dateformat';
import { pushImage, pushJSONDocument } from '../textile/textile.hub';
import { Web3ContractProvider } from './web3.provider';
import communityAbi from './community-abi.json';

export const getSkillWalletAddress = async () => {
  return axios.get(`https://dev-api.skillwallet.id/api/skillwallet/config`).then((response) => response.data.skillWalletAddress);
};

// export const getSkillwalletAddress = async () => {
//   // return axios.get('https://api.skillwallet.id/api/skillwallet/config', {
//   //   headers: {
//   //     'Content-Type': 'application/json',
//   //   },
//   // });
//   const res = await fetch('https://api.skillwallet.id/api/skillwallet/config', {
//     method: 'GET',
//     headers: {
//       'Content-Type': 'application/json',
//     },
//   });
//   const swAddress = await res.json();
//   return swAddress;
// };

export const getPAKeyByCommunity = async (community) => {
  return axios.get(`https://dev-api.distributed.town/api/community/${community}/key`).then((response) => response.data);
};

// export const getPAKeyByCommunity = async (community) => {
//   const response = await fetch(`https://api.distributed.town/api/community/${community}/key`, {
//     method: 'GET',
//   });
//   const pa = await response.json();
//   return pa;
// };

export const getActivationNonce = async (tokenId) => {
  return axios.post(`https://dev-api.skillwallet.id/api/skillwallet/${tokenId}/nonces?action=0`).then((response) => response.data.nonce);
};

// export const getActivationNonce = async (tokenId) => {
//   const response = await fetch(`https://api.skillwallet.id/api/skillwallet/${tokenId}/nonces?action=0`, {
//     method: 'POST',
//   });
//   const nonce = await response.json();
//   return nonce.nonce;
// };

export const isQrCodeActive = async (tokenId): Promise<boolean> => {
  // try {
  //   const swAddress = await getSkillWalletAddress();
  //   console.log(swAddress);
  //   const signer = provider.getSigner();
  //   const contract = new ethers.Contract(swAddress.skillWalletAddress, selectedAddress, signer);
  //   console.log(tokenId);
  //   const status = await contract.isSkillWalletActivated(tokenId);
  //   console.log(status);

  //   return status.status;
  // } catch (error) {
  //   console.log(error);
  //   console.log('QR Code not active, error!!');
  //   return false;
  // }
  try {
    const skillwalletAddress = await getSkillWalletAddress();
    const contract = await Web3ContractProvider(skillwalletAddress, SkillWalletAbi);
    const status = await contract.isSkillWalletActivated(tokenId);
    console.log(status);

    return status;
  } catch (error) {
    console.log('QR Code not active, error!!');
    return false;
  }
};

// export const isQrCodeActive = async (): Promise<boolean> => {
//   try {
//     const provider = new ethers.providers.Web3Provider(window.ethereum);
//     const signer = provider.getSigner();
//     const skillwalletAddress = await getSkillWalletAddress(null);
//     const contract = new ethers.Contract(skillwalletAddress, SkillWalletAbi, signer);
//     const tokenId = await contract.getSkillWalletIdByOwner(window.ethereum.selectedAddress);
//     const status = await contract.isSkillWalletActivated(tokenId);

//     return status;
//   } catch (error) {
//     console.log('QR Code not active, error!!');
//     return false;
//   }
// };

export const isCoreTeamMember = async (communityAddress, user) => {
  const contract = await Web3ContractProvider(communityAddress, communityAbi);
  // new ethers.Contract(partnersAgreementAddress, PartnersAgreementABI, signer);

  const result = await contract.isCoreTeamMember(user);
  console.log('isCoreTeamMember', result);

  return result;
};

export const activatePA = async (partnersAddress) => {
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();

  const contract = new ethers.Contract(partnersAddress, JSON.stringify(PartnersAgreementABI), signer);
  console.log('cntrct: ', contract);

  const createTx = await contract.activatePA();
  console.log('Tx: ', createTx);

  return createTx.wait();
};

export const changeNetwork = async () => {
  const { ethereum } = window;
  if (ethereum && ethereum.request) {
    try {
      await ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: '0x13881' }],
      });
    } catch (error: any) {
      // event is a default error event in old code
      // sw.dispatchEvent(event);
      // This error code indicates that the chain has not been added to MetaMask.
      if (error.code === 4902) {
        try {
          await ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [
              {
                chainId: '0x13881', // A 0x-prefixed hexadecimal string
                chainName: 'Mumbai',
                nativeCurrency: {
                  name: 'Matic',
                  symbol: 'MATIC',
                  decimals: 18,
                },
                rpcUrls: ['https://matic-mumbai.chainstacklabs.com', 'https://rpc-mumbai.matic.today'],
                blockExplorerUrls: ['https://explorer-mumbai.maticvigil.com/'],
              },
            ],
          });
        } catch (addError) {
          // handle "add" error
        }
      }
    }
    // handle other "switch" errors
  }
};

export const getCommunity = async (partnerKey) => {
  return axios.get(`https://dev-api.distributed.town/api/community/key/${partnerKey}`).then((response) => response.data);
  // this probably shouldn't be here
  // partnersAgreementAddress = community.partnersAgreementAddress;
  // console.log('partnersA address: ', partnersAgreementAddress);
  // membershipAddress = await getMembershipAddress();
  // return community;
};

export const joinCommunity = async (communityAddress, username, imageUrl, role, level) => {
  try {
    console.log('trying to join community', communityAddress);

    const contract = await Web3ContractProvider(communityAddress, communityAbi);

    console.log(role, typeof role);

    const config = {
      avatar: imageUrl,
      tokenId: '1',
      title: username,
      timestamp: dateFormat(new Date(), '#hh:MM:ss-dd:mm:yyyy'),
    };
    const { toFile } = await SkillWalletIDBadgeGenerator(config);

    const file = await toFile();
    console.log(file);

    const badgeUrl = await pushImage(file, `${username}-profile.png`);

    console.log(badgeUrl);

    // eslint-disable-next-line dot-notation
    console.log('Role name', role.roleName);

    const metadataJson = {
      name: `${username}'s SkillWallet`,
      description: 'Universal, self-sovereign IDs tied to skills & contributions rather than personal data.',
      image: badgeUrl,
      properties: {
        avatar: imageUrl,
        username,
        roles: [
          {
            // eslint-disable-next-line dot-notation
            name: role.roleName,
            value: level,
          },
        ],
      },
    };
    console.log(metadataJson);

    const url = await pushJSONDocument(metadataJson);
    console.log(url);

    // eslint-disable-next-line dot-notation
    const createTx = await contract.joinNewMember(url, role['roleId']);
    // const createTx = await contract.joinNewMember(url, role['roleId']);

    const communityTransactionResult = await createTx.wait();
    console.log(communityTransactionResult);
    const { events } = communityTransactionResult;
    const memberJoinedEvent = events.find((e) => e.event === 'MemberAdded');

    if (memberJoinedEvent) {
      // return tokenID.
      return memberJoinedEvent.args[1].toString();
    }
    throw new Error('Something went wrong');
  } catch (err) {
    // sw.dispatchEvent(event);
    // const error = err.data.message;

    const error = err;
    console.log(error);
    // if (error.includes("No free spots left")) {
    //   alert("There are no available spots in this community.")
    // } else if (error.includes("Already a member")) {
    //   alert("You are already a member of this community.")
    // } else if (error.includes("SkillWallet already registered")) {
    //   alert("You already registered a SkillWallet for this wallet address.")
    // } else {
    //   alert("An error occured - please try again.")
    // }
  }
};

export const fetchSkillWallet = async (address: string) => {
  console.log(address);

  const skillWalletAddress = await getSkillWalletAddress();
  console.log(skillWalletAddress);
  const contract = await Web3ContractProvider(skillWalletAddress, SkillWalletAbi);

  console.log(contract);
  const tokenId = await contract.getSkillWalletIdByOwner(address);
  console.log(tokenId);

  const isActive = await contract.isSkillWalletActivated(tokenId);
  console.log(isActive);
  if (isActive) {
    const jsonUri = await contract.tokenURI(tokenId);
    console.log(jsonUri);
    const community = await contract.getActiveCommunity(tokenId);
    console.log(community);

    const partnersAgreementKey = await getPAKeyByCommunity(community);
    console.log(partnersAgreementKey);
    const res = await fetch(jsonUri);
    console.log(res);
    const jsonMetadata = await res.json();
    const isCoreTeam = await isCoreTeamMember(partnersAgreementKey.communityAddress, address);
    console.log(isCoreTeam);
    console.log('is core team member?', isCoreTeam);

    const skillWallet: any = {
      imageUrl: jsonMetadata.properties.avatar,
      nickname: jsonMetadata.properties.username,
      skills: jsonMetadata.properties.skills,
      community,
      diToCredits: 0,
      tokenId: tokenId.toString(),
      isCoreTeamMember: isCoreTeam,
    };

    if (skillWallet && skillWallet.nickname) {
      return skillWallet;
      // window.sessionStorage.setItem('skillWallet', JSON.stringify(skillWallet));
    }
    if (!skillWallet) {
      // Some error handling
      // sw.dispatchEvent(event);
      // if (error.data && error.data.message.includes('invalid')) {
      //   alert('The SkillWallet owner is invalid.');
      //   console.log(error);
      // } else {
      //   alert('An error occured - please try again.');
      //   console.log(error);
      // }
      throw new Error('Unable to find a Skill Wallet and nickname with your ID');
    }
    return undefined;
  }
};
