import { Web3AutIDProvider, Web3CommunityExtensionProvider } from '@skill-wallet/sw-abi-types';
import { ConstructorFragment } from 'ethers/lib/utils';
import dateFormat from 'dateformat';
import { UserData } from '../../store/user-data.reducer';
import { Web3ThunkProviderFactory } from '../ProviderFactory/web3-thunk.provider';
import { storeMetadata, uploadFile } from '../textile/textile.hub';

export function ipfsCIDToHttpUrl(url: string, isJson = false) {
  return `${url.replace('https://hub.textile.io/', 'https://ipfs.io/')}`;
}

export function cidToHttpUrl(cid: string) {
  return `https://ipfs.io/ipfs/${cid}`;
}
const communityProvider = Web3ThunkProviderFactory('Community', {
  provider: Web3CommunityExtensionProvider,
});

const autIdProvider = Web3ThunkProviderFactory('AutId', {
  provider: Web3AutIDProvider,
});

export const fetchCommunity = communityProvider(
  {
    type: 'community/get',
  },
  (thunkAPI) => {
    // console.log(thunkAPI.getState());
    // const { auth } = thunkAPI.getState();
    return Promise.resolve('0xFc53e464D257F0614132D20293154eaE5CE25734');
  },
  async (contract) => {
    const resp = await contract.getComData();
    console.log(resp);
    const communityMetadata = await fetch(cidToHttpUrl(resp[2]));
    const communityJson = await communityMetadata.json();
    console.log(communityJson);
    console.log(communityJson.rolesSets[0].roles);
    return {
      // address: communityAddress,
      // image: ipfsCIDToHttpUrl(communityJson.image, false),
      name: communityJson.name,
      description: communityJson.description,
      roles: communityJson.rolesSets[0].roles,
      // commitment: details[2].toString(),
    };
  }
);

export async function dataUrlToFile(dataUrl: string, fileName: string): Promise<File> {
  const res: Response = await fetch(dataUrl);
  const blob: Blob = await res.blob();
  return new File([blob], fileName, { type: 'image/png' });
}

export const mintMembership = autIdProvider(
  {
    type: 'membership/mint',
  },
  (thunkAPI) => {
    // console.log(thunkAPI.getState());
    // const { auth } = thunkAPI.getState();
    return Promise.resolve('0xCeb3300b7de5061c633555Ac593C84774D160309');
  },
  async (contract, args) => {
    const timeStamp = dateFormat(new Date(), 'HH:MM:ss | dd/mm/yyyy');

    const file = await dataUrlToFile(args.userData.picture, 'avatar');

    console.log(file);
    const fileUrl = await uploadFile(file);
    console.log(fileUrl);

    const metadataJson = {
      name: `${args.userData.username}`,
      description: `AutID are a new standard for self-sovereign Identities that do not depend from the provider,
       therefore, they are universal. They are individual NFT IDs.`,
      image: file,
      properties: {
        timestamp: timeStamp,
        avatar: fileUrl,
      },
    };
    const url = await storeMetadata(metadataJson);
    console.log(url);
    console.log(metadataJson);
    console.log(fileUrl);
    console.log({ name: args.userData.username, url, role: args.userData.role, cmtmt: args.commitment });
    const response = await contract.mint(
      args.userData.username,
      url,
      args.userData.role,
      args.commitment,
      '0xFc53e464D257F0614132D20293154eaE5CE25734',
      {
        gasLimit: 1000000,
      }
    );
    console.log(response);
  }
);

export const getAutId = autIdProvider(
  {
    type: 'membership/get',
  },
  (thunkAPI) => {
    // console.log(thunkAPI.getState());
    // const { auth } = thunkAPI.getState();
    return Promise.resolve('0xCeb3300b7de5061c633555Ac593C84774D160309');
  },
  async (contract, args) => {
    const response = await contract.getAutIDByOwner(window.ethereum.selectedAddress);
    console.log(response);
  }
);
