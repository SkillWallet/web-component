import { NFTStorage } from 'nft.storage';

const client = new NFTStorage({ token: process.env.REACT_APP_NFT_STORAGE_KEY });

export function ipfsCIDToHttpUrl(url: string, isJson: boolean) {
  return isJson ?
    `https://ipfs.io/ipfs/${url.replace('ipfs://', '')}/metadata.json` :
    `https://ipfs.io/ipfs/${url.replace('ipfs://', '')}`
}

export async function uploadFile(file) {
  const cid = await client.storeBlob(file);
  console.log({ cid })
  const status = await client.status(cid)
  console.log(status)
  return cid;
}

export async function storeMetadata(json) {
  const metadata = await client.store(json);
  return metadata.ipnft;
}
