/* eslint-disable no-plusplus */
import { Buckets, KeyInfo } from '@textile/hub';
import env from 'react-dotenv';
// use env
const keyInfo: KeyInfo = {
  key: 'bfmfmmc2pvndplaubletkmk6fdu',
  secret: 'bvqemoy76oknavprk6xjmz62b5egqsufqvd2pgoy',
};

const jsonToArray = (json) => {
  const str = JSON.stringify(json, null, 0);
  const ret = new Uint8Array(str.length);
  for (let i = 0; i < str.length; i++) {
    ret[i] = str.charCodeAt(i);
  }
  return ret;
};

export const pushJSONDocument = async (json) => {
  const buckets = await Buckets.withKeyInfo(keyInfo);
  const { root, threadID } = await buckets.getOrCreate('SkillWallet');
  if (!root) throw new Error('bucket not created');
  const buf = jsonToArray(json);
  const path = `metadata.json`;
  const links = await buckets.pushPath(root.key, path, buf);
  return `https://hub.textile.io${links.path.path}`;
};

export const pushImage = async (content, path) => {
  console.log('pushing image');
  const buckets = await Buckets.withKeyInfo(keyInfo);
  const { root } = await buckets.getOrCreate('SkillWallet');
  if (!root) throw new Error('bucket not created');
  console.log('bucket created');
  const links = await buckets.pushPath(root.key, path, content);
  console.log('path pushed');
  console.log(`https://hub.textile.io${links.path.path}`);
  return `https://hub.textile.io${links.path.path}`;
};
