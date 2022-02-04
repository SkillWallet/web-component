import { SkillWalletIDBadgeGenerator } from 'sw-web-shared';
import axios from 'axios';
import { SkillWalletAbi } from '@skill-wallet/sw-abi-types';
import dateFormat from 'dateformat';
import { pushImage, pushJSONDocument } from '../textile/textile.hub';
import { Web3ContractProvider } from './web3.provider';
import { env } from './env';
import communityAbi from './community-abi.json';

export const getSkillWalletAddress = async () => {
  return axios.get(`${env.SKILL_WALLET_API}/skillwallet/config`).then((response) => response.data.skillWalletAddress);
};

export const getPAKeyByCommunity = async (community) => {
  return axios.get(`${env.DITO_API}/community/${community}/key`).then((response) => response.data);
};

export const getActivationNonce = async (tokenId) => {
  return axios.post(`${env.SKILL_WALLET_API}/skillwallet/${tokenId}/nonces?action=0`).then((response) => response.data.nonce);
};

export const isQrCodeActive = async (tokenId): Promise<boolean> => {
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

export const isCoreTeamMember = async (communityAddress, user) => {
  const contract = await Web3ContractProvider(communityAddress, communityAbi);
  const result = await contract.isCoreTeamMember(user);
  console.log('isCoreTeamMember', result);

  return result;
};

export const getCommunity = async (partnerKey) => {
  return axios.get(`${env.DITO_API}/community/key/${partnerKey}`).then((response) => response.data);
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
    const timeStamp = dateFormat(new Date(), 'HH:MM:ss | dd/mm/yyyy');
    const config = {
      avatar: imageUrl,
      tokenId: '1',
      title: username,
      timestamp: `#${1} | ${timeStamp}`,
    };
    const { toFile } = await SkillWalletIDBadgeGenerator(config);

    const file = await toFile();
    console.log(file);

    const badgeUrl = await pushImage(file, `${username}-profile.png`);

    console.log(badgeUrl);

    // eslint-disable-next-line dot-notation
    console.log('Role name', role.roleName);

    const metadataJson = {
      name: `${username}`,
      description: `This is ${username}'s SkillWallet.      
      SkillWallets are a new standard for self-sovereign Identities that do not depend from the provider, therefore, they are universal.       
      They are individual NFT IDs. This one is ${username}'s.      
      A SkillWallet cannot be bought - it can only be acquired by joining a decentralized, permissionless Community that lives on the Blockchain.       
      Each SkillWallet is unique, and based on someone's Skills, rather than exploiting their personal data.      
      Also, it's non-transferable, so everyone's experience and skills are truly theirs - and keeps track of each contribution they make in the communities they're part of, rewarding them for their participation.
      SkillWallet is the first Identity you can truly own.      
      This is  ${username}'s, and there are no others like this.`,
      image: badgeUrl,
      properties: {
        timestamp: timeStamp,
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
