import { ethers } from 'ethers';
import skillWalletAbi from './skillWalletAbi.json';
import partnersAgreementAbi from './partnersAgreementAbi.json';

export const getSkillwalletAddress = async () => {
  const res = await fetch('https://api.skillwallet.id/api/skillwallet/config', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  const swAddress = await res.json();
  return swAddress;
};

export const fetchKeyAndPAByCommunity = async (community) => {
  const response = await fetch(`https://api.distributed.town/api/community/${community}/key`, {
    method: 'GET',
  });
  const pa = await response.json();
  return pa;
};

export const isCoreTeamMember = async (partnersAgreementAddress, user) => {
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();

  const partnersAgreementContract = new ethers.Contract(partnersAgreementAddress, JSON.stringify(partnersAgreementAbi), signer);

  const result = await partnersAgreementContract.isCoreTeamMember(user);
  console.log('isCoreTeamMember', result);

  return result;
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

export const fetchSkillWallet = async (provider: any, address: string) => {
  try {
    console.log('fetching...');

    const skillWalletAddress = await getSkillwalletAddress();
    const signer = provider.getSigner();
    const contract = new ethers.Contract(skillWalletAddress.skillWalletAddress, skillWalletAbi, signer);

    const tokenId = await contract.getSkillWalletIdByOwner(address);
    console.log(tokenId);

    const isActive = await contract.isSkillWalletActivated(tokenId);
    if (isActive) {
      const jsonUri = await contract.tokenURI(tokenId);
      const community = await contract.getActiveCommunity(tokenId);

      const partnersAgreementKey = await fetchKeyAndPAByCommunity(community);
      const res = await fetch(jsonUri);
      const jsonMetadata = await res.json();
      const isCoreTeam = await isCoreTeamMember(partnersAgreementKey.partnersAgreementAddress, address);
      console.log('is core team member?', isCoreTeam);

      const skillWallet: any = {
        imageUrl: jsonMetadata.image,
        nickname: jsonMetadata.properties.username,
        skills: jsonMetadata.properties.skills,
        community,
        diToCredits: 0,
        tokenId: tokenId.toString(),
        isCoreTeamMember: isCoreTeam,
      };

      if (skillWallet && skillWallet.nickname) {
        console.log('setting local storage with SW');
        window.sessionStorage.setItem('skillWallet', JSON.stringify(skillWallet));
      } else if (!skillWallet) {
        alert('Unable to find a Skill Wallet and nickname with your ID');
      }

      return community;
    }
  } catch (error) {
    // Some error handling
    // sw.dispatchEvent(event);
    // if (error.data && error.data.message.includes('invalid')) {
    //   alert('The SkillWallet owner is invalid.');
    //   console.log(error);
    // } else {
    //   alert('An error occured - please try again.');
    //   console.log(error);
    // }
    return false;
  }
};
