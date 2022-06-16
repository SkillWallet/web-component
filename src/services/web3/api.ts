import { Web3CommunityExtensionProvider } from '@skill-wallet/sw-abi-types';
import { Web3ThunkProviderFactory } from '../ProviderFactory/web3-thunk.provider';

export function ipfsCIDToHttpUrl(url: string, isJson = false) {
  return `${url.replace('https://hub.textile.io/', 'https://ipfs.io/')}`;
}

const communityProvider = Web3ThunkProviderFactory('Community', {
  provider: Web3CommunityExtensionProvider,
});

export const fetchCommunity = communityProvider(
  {
    type: 'community/get',
  },
  (thunkAPI) => {
    // console.log(thunkAPI.getState());
    // const { auth } = thunkAPI.getState();
    return Promise.resolve('0x96dCCC06b1729CD8ccFe849CE9cA7e020e19515c');
  },
  async (contract) => {
    const resp = await contract.getComData();
    console.log(resp);
    const communityMetadata = await fetch(resp[2]);
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
