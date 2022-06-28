import { Web3AutIDProvider, Web3CommunityExtensionProvider } from '@skill-wallet/sw-abi-types';
import { ConstructorFragment } from 'ethers/lib/utils';
import dateFormat from 'dateformat';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { UserData } from '../../store/user-data.reducer';
import { Web3ThunkProviderFactory } from '../ProviderFactory/web3-thunk.provider';
import { storeMetadata, uploadFile } from '../textile/textile.hub';
import { EnableAndChangeNetwork } from '../ProviderFactory/web3.network';
import { ParseSWErrorMessage } from './utils';

export function ipfsCIDToHttpUrl(url: string, isJson = false) {
  return `${url.replace('https://hub.textile.io/', 'https://ipfs.io/')}`;
}

// export function replaceIpfsSlashes(url: string) {
//   return `${url.replace('ipfs://', 'https://nftstorage.link/ipfs')}`;
// }

export function cidToHttpUrl(cid: string) {
  return `${cid.replace('ipfs://', 'https://nftstorage.link/ipfs/')}`;
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

    // const { aut } = thunkAPI.getState();
    // return Promise.resolve(aut.communityExtensionAddress);
  },
  async (contract) => {
    const resp = await contract.getComData();
    console.log(resp);
    const communityMetadata = await fetch(cidToHttpUrl(`${resp[2]}/metadata.json`));
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

    // const { aut } = thunkAPI.getState();
    // return Promise.resolve(aut.communityExtensionAddress);
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
      // TODO: dynamic community extension
      '0xFc53e464D257F0614132D20293154eaE5CE25734',
      {
        gasLimit: 1000000,
      }
    );
    console.log(response);
  }
);

export const injectMetamask = createAsyncThunk('metamask/inject', async (arg, thunkAPI) => {
  try {
    await EnableAndChangeNetwork();
    console.log('NO ERROR');
  } catch (error) {
    console.log('ERROR');
    return thunkAPI.rejectWithValue(ParseSWErrorMessage(error));
    return ParseSWErrorMessage(error);
  }
});

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
    const { selectedAddress } = window.ethereum;
    const tokenId = await contract.getAutIDByOwner(selectedAddress);
    const tokenURI = await contract.tokenURI(tokenId);
    const response = await fetch(cidToHttpUrl(tokenURI));
    const autId = await response.json();
    const holderCommunities = await contract.getCommunities(selectedAddress);
    const communities = await Promise.all(
      (holderCommunities as any).map(async (communityAddress) => {
        const details = await contract.getCommunityData(selectedAddress, communityAddress);
        /**
         * [
                "0xFc53e464D257F0614132D20293154eaE5CE25734",
                {
                    "type": "BigNumber",
                    "hex": "0x03"
                },
                {
                    "type": "BigNumber",
                    "hex": "0x08"
                },
                true
            ]
         */
        const communityExtensioncontract = await Web3CommunityExtensionProvider('0x96dCCC06b1729CD8ccFe849CE9cA7e020e19515c');
        const resp = await communityExtensioncontract.getComData();
        /**
         * [
              {
                  "type": "BigNumber",
                  "hex": "0x01"
              },
              "0x7DeF7A0C6553B9f7993a131b5e30AB59386837E0",
              "https://ipfs.io/ipfs/bafkreidjy6xlyf2he4iopzijy7bws3yl34xhwh726ca2xd7temqoqkz6xy",
              {
                  "type": "BigNumber",
                  "hex": "0x08"
              },
              {
                  "type": "BigNumber",
                  "hex": "0x01"
              },
              ""
          ]
         */
        const communityMetadata = await fetch(resp[2]);
        const communityJson = await communityMetadata.json();
        /**
         * {
              "name": "Test Community",
              "description": "A Community for all the DAOHacks participants & organizers",
              "rolesSets": [
                  {
                      "roleSetName": "members",
                      "roles": [
                          {
                              "id": 1,
                              "roleName": "organizer"
                          },
                          {
                              "id": 2,
                              "roleName": "hacker"
                          },
                          {
                              "id": 3,
                              "roleName": "mentor"
                          }
                      ]
                  }
              ],
              "template": 1,
              "image": "https://hub.textile.io/ipfs/bafybeig3voiu5ak7gxxuqaluodcsa2mxrfoi7j4gmw5jetbzca5zljld3i/daohacks.png"
          }
         */
        return {
          address: communityAddress,
          picture: ipfsCIDToHttpUrl(communityJson.image, false),
          name: communityJson.name,
          description: communityJson.description,
          role: communityJson.rolesSets[0].roles.find((x) => x.id.toString() === details[1].toString()).roleName,
          commitment: details[2].toString(),
        };
      })
    );
    autId.communities = communities;
    console.log(autId);
    window.sessionStorage.setItem('aut-data', JSON.stringify(autId));
    return autId;
  }
);

export const checkIfAutIdExists = autIdProvider(
  {
    type: 'membership/exists',
  },
  (thunkAPI) => {
    const { aut } = thunkAPI.getState();
    return Promise.resolve(aut.communityExtensionAddress);
  },
  async (contract, args) => {
    const { selectedAddress } = window.ethereum;
    const tokenId = await contract.getAutIDByOwner(selectedAddress);
    if (tokenId) {
      return true;
    }
    return false;
  }
);
