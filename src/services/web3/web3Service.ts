import { SkillWalletIDBadgeGenerator } from 'sw-web-shared';
import axios from 'axios';
import dateFormat from 'dateformat';
import { SkillWalletCommunityContractEventType } from '@skill-wallet/sw-abi-types';
import { setLoadingMessage, startLoading } from '../../store/sw-ui-reducer';
import { ipfsCIDToHttpUrl, storeMetadata } from '../textile/textile.hub';
// import {
//   changeNetwork,
//   PartnersAgreementContractProvier,
//   SkillWalletCommunityContractProvier,
//   SkillWalletContractProvier,
// } from './web3.provider';
import { env } from './env';
import { ErrorTypes } from '../../types/error-types';
import { Community, PartnerAgreementKey } from './models';
import { ParseSWErrorMessage } from './utils';

// export const getSkillWalletAddress = async () => {
//   return axios.get(`${env.SKILL_WALLET_API}/skillwallet/config`).then((response) => response.data.skillWalletAddress);
// };

// export const getPAKeyByCommunity = async (community) => {
//   return axios.get(`${env.SKILL_WALLET_API}/community/${community}/key`).then((response) => response.data);
// };

// export const getActivationNonce = async (tokenId) => {
//   return axios
//     .post(`${env.SKILL_WALLET_API}/skillwallet/${tokenId}/nonces?action=0`)
//     .then((response) => response.data.nonce)
//     .catch((e) => {
//       throw new Error(ErrorTypes.CouldNotGetActivationNonce);
//     });
// };

// export const getPAUrl = async (partnersAgreementAddress) => {
//   const contract = await PartnersAgreementContractProvier(partnersAgreementAddress);
//   const urls = await contract.getURLs();
//   return urls?.length > 0 ? urls[urls.length - 1] : undefined;
// };

// export const getTokenId = async () => {
//   console.log('fetching address');
//   const skillWalletAddress = await getSkillWalletAddress();
//   const contract = await SkillWalletContractProvier(skillWalletAddress);

//   if (window.ethereum.selectedAddress) {
//     const { selectedAddress } = window.ethereum;
//     console.log('fetching token');
//     return contract.getSkillWalletIdByOwner(selectedAddress);
//   }
//   throw Error('Unable to retrieve selected address');
// };

// export const isQrCodeActive = async (tokenId): Promise<boolean> => {
//   try {
//     const skillwalletAddress = await getSkillWalletAddress();
//     const contract = await SkillWalletContractProvier(skillwalletAddress);
//     const status = (await contract.isSkillWalletActivated(tokenId)) as unknown as boolean;
//     console.log('Polling qr!', status);
//     return status;
//   } catch (error) {
//     console.log(error);
//     console.log('QR Code verification failed!');
//     return false;
//   }
// };

// export const isCoreTeamMember = async (communityAddress, user) => {
//   const contract = await SkillWalletCommunityContractProvier(communityAddress);
//   const result = await contract.isCoreTeamMember(user);

//   return result;
// };

// export const getCommunity = async (partnerKey: string): Promise<Community & PartnerAgreementKey> => {
//   const data: PartnerAgreementKey = await axios
//     .get<PartnerAgreementKey>(`${env.SKILL_WALLET_API}/skillwallet/agreement/${partnerKey}`)
//     .then((response) => response.data);

//   if (!data) {
//     throw new Error(`No partner agreement was found with key ${partnerKey}`);
//   }

//   data.address = data.communityAddress;
//   const contract = await SkillWalletCommunityContractProvier(data.address);
//   const uri = await contract.metadataUri();
//   const metadata: Community = (await axios.get(uri)).data;
//   const metadata1: Community = await axios.get(uri);
//   console.log(metadata1);
//   const community = new Community(metadata);
//   console.log(community);
//   community.image = ipfsCIDToHttpUrl(community.image as string);
//   return {
//     ...community,
//     ...data,
//   };
// };

// export const validateDomain = async (partnerKey) => {
//   const windowPath = window.location.href;
//   const community = await getCommunity(partnerKey);
//   const partnersUrl = await getPAUrl(community.partnersAgreementAddress);
//   const url = partnersUrl.match('^(?:https?://)?(?:[^@/\n]+@)?(?:www.)?([^:/?\n]+)');
//   const isValid = url[0] === windowPath;
//   // const contract = await Web3ContractProvider(community.partnersAgreementAddress, PartnersAgreementABI);
//   // const isValid = await contract.isURLListed(windowPath);

//   return isValid;
// };

// export const joinCommunity = async (communityAddress, username, imageUrl, role, level, dispatch) => {
//   console.log('trying to join community', communityAddress);
//   dispatch(setLoadingMessage('Preparing to join community.'));
//   const contract = await SkillWalletCommunityContractProvier(communityAddress, {
//     event: SkillWalletCommunityContractEventType.MemberAdded,
//   });

//   const timeStamp = dateFormat(new Date(), 'HH:MM:ss | dd/mm/yyyy');
//   const config = {
//     avatar: ipfsCIDToHttpUrl(imageUrl, false),
//     tokenId: '2',
//     title: username,
//     timestamp: `#${1} | ${timeStamp}`,
//   };
//   const { toFile } = await SkillWalletIDBadgeGenerator(config);

//   const file = await toFile();

//   const metadataJson = {
//     name: `${username}`,
//     description: `This is ${username}'s SkillWallet.
//       SkillWallets are a new standard for self-sovereign Identities that do not depend from the provider, therefore, they are universal.
//       They are individual NFT IDs. This one is ${username}'s.
//       A SkillWallet cannot be bought - it can only be acquired by joining a decentralized, permissionless Community that lives on the Blockchain.
//       Each SkillWallet is unique, and based on someone's Skills, rather than exploiting their personal data.
//       Also, it's non-transferable, so everyone's experience and skills are truly theirs - and keeps track of each contribution they make in the communities they're part of, rewarding them for their participation.
//       SkillWallet is the first Identity you can truly own.
//       This is  ${username}'s, and there are no others like this.`,
//     image: file,
//     properties: {
//       timestamp: timeStamp,
//       avatar: imageUrl,
//       username,
//       roles: [
//         {
//           // eslint-disable-next-line dot-notation
//           name: role.roleName,
//           value: level,
//         },
//       ],
//     },
//   };

//   dispatch(setLoadingMessage('Uploading metadata.'));
//   const url = await storeMetadata(metadataJson);

//   dispatch(setLoadingMessage('Awaiting transaction confirmation.'));
//   // eslint-disable-next-line dot-notation
//   const response = await contract.joinNewMember(url, role['roleId']).catch((e) => {
//     if (e.message.includes('No free spots left')) {
//       throw new Error(ErrorTypes.CommunitySlotsFull);
//     } else if (e.message.includes('Already a member')) {
//       throw new Error(ErrorTypes.AlreadyAMember);
//     } else if (e.message.includes('SkillWallet already registered')) {
//       throw new Error(ErrorTypes.SkillWalletWithThisAddressAlreadyRegistered);
//     } else {
//       throw new Error(e.message);
//     }
//   });

//   dispatch(setLoadingMessage('Confirming transaction.'));

//   if (response) {
//     // return tokenID.
//     return response[1].toString();
//   }
//   throw new Error('Something went wrong');
// };

// export const fetchSkillWallet = async (dispatch?, checkIfExists?) => {
//   const skillWalletAddress = await getSkillWalletAddress();

//   if (!window.ethereum.selectedAddress && dispatch) {
//     dispatch(startLoading('Getting MetaMask info. Make sure you are logged into your account.'));
//   }
//   const contract = await SkillWalletContractProvier(skillWalletAddress);

//   if (dispatch) {
//     if (checkIfExists) {
//       dispatch(setLoadingMessage('Checking for an existing SkillWallet.'));
//     } else {
//       dispatch(setLoadingMessage('Retrieving SkillWallet.'));
//     }
//   }
//   if (window.ethereum.selectedAddress) {
//     const { selectedAddress } = window.ethereum;
//     const tokenId = await contract.getSkillWalletIdByOwner(selectedAddress).catch((e) => {
//       console.log(e.toString());
//       if (e.toString().includes('invalid')) {
//         throw new Error(ErrorTypes.SkillWalletNotFound);
//       } else {
//         throw e;
//       }
//     });

//     console.log(tokenId);
//     const isActive = await contract.isSkillWalletActivated(tokenId);
//     if (isActive) {
//       console.log(isActive);
//       const uriCid = await contract.tokenURI(tokenId);
//       const jsonUri = ipfsCIDToHttpUrl(uriCid, true);
//       const community = await contract.getActiveCommunity(tokenId);
//       console.log(community);

//       const partnersAgreementKey = await getPAKeyByCommunity(community);
//       console.log(partnersAgreementKey);
//       const res = await fetch(jsonUri);
//       const jsonMetadata = await res.json();
//       const isCoreTeam = await isCoreTeamMember(partnersAgreementKey.communityAddress, selectedAddress);

//       const skillWallet: any = {
//         imageUrl: ipfsCIDToHttpUrl(jsonMetadata.properties.avatar, false),
//         nickname: jsonMetadata.properties.username,
//         skills: jsonMetadata.properties.skills,
//         community,
//         role: jsonMetadata.properties.roles[0]?.name,
//         partnersAgreementKey,
//         diToCredits: 0,
//         tokenId: tokenId.toString(),
//         isCoreTeamMember: isCoreTeam,
//         timestamp: new Date().getTime(),
//       };

//       if (skillWallet && skillWallet.nickname) {
//         return skillWallet;
//       }
//       if (!skillWallet) {
//         throw new Error(ErrorTypes.SkillWalletNotFound);
//       }
//     } else {
//       throw new Error(ErrorTypes.SkillWalletExistsButInactive);
//     }
//   } else {
//     throw new Error('No selected wallet address.');
//   }
// };
