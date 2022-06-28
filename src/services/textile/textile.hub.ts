import { NFTStorage } from 'nft.storage';

const client = new NFTStorage({
  token:
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDIwQkEyNDNhNTU1YmY4YzI0MzViNzVmMTk0NmFDNWQ2QTY4QUQzMjgiLCJpc3MiOiJuZnQtc3RvcmFnZSIsImlhdCI6MTY0MzkwMjIzNDA2NywibmFtZSI6IlBhcnRuZXJzQXBwIn0.sG-6S0mNp0FQ_4SIimMChrMj4250ymEH58V09eXNY4o',
});

export function ipfsCIDToHttpUrl(url: string, isJson = false) {
  if (!url.includes('textile'))
    return isJson
      ? `https://skillwallet.infura-ipfs.io/ipfs/${url.replace('ipfs://', '')}/metadata.json`
      : `https://skillwallet.infura-ipfs.io/ipfs/${url.replace('ipfs://', '')}`;

  return url;
}

export async function uploadFile(file) {
  const cid = await client.storeBlob(file);
  // const trimmedCid = cid.replace('ipfs://', '');
  return `ipfs://${cid}`;
}

export async function storeMetadata(json) {
  const metadata = await client.store(json);
  console.log(metadata);
  return metadata.url;
}
