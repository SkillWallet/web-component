import { SkillWalletIDBadgeGenerator } from 'sw-web-shared';
import axios from 'axios';
import { SkillWalletAbi } from '@skill-wallet/sw-abi-types';
import dateFormat from 'dateformat';
import { ipfsCIDToHttpUrl, storeMetadata } from '../textile/textile.hub';
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
  console.log('trying to join community', communityAddress);

  const contract = await Web3ContractProvider(communityAddress, communityAbi);

  console.log(role, typeof role);
  const timeStamp = dateFormat(new Date(), 'HH:MM:ss | dd/mm/yyyy');
  const config = {
    avatar: ipfsCIDToHttpUrl(imageUrl, false),
    tokenId: '2',
    title: username,
    timestamp: `#${1} | ${timeStamp}`,
  };
  const { toFile } = await SkillWalletIDBadgeGenerator(config);

  const file = await toFile();
  console.log(file);

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
    image: file,
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

  const url = await storeMetadata(metadataJson);

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
    const uriCid = await contract.tokenURI(tokenId);
    const jsonUri = ipfsCIDToHttpUrl(uriCid, true);
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
      imageUrl: ipfsCIDToHttpUrl(jsonMetadata.properties.avatar, false),
      nickname: jsonMetadata.properties.username,
      skills: jsonMetadata.properties.skills,
      community,
      diToCredits: 0,
      tokenId: tokenId.toString(),
      isCoreTeamMember: isCoreTeam,
      timestamp: new Date().getTime(),
    };

    if (skillWallet && skillWallet.nickname) {
      return skillWallet;
    }
    if (!skillWallet) {
      throw new Error('Unable to find a Skill Wallet with your ID');
    }
    return undefined;
  }
};
