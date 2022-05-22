import type { NextPage } from 'next';
import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import sandboxNFTContract from '@bsnft/blockchain/artifacts/contracts/SandboxNFT.sol/SandboxNFT.json';

/*
declare global {
  interface Window {
    ethereum?: any;
  }
}
*/

const Home: NextPage = () => {
  const [currentAccount, setCurrentAccount] = useState('');

  const checkIfWeAreOnTheRightNetworks = async () => {
    const { ethereum } = window;

    const chainId = await ethereum.request({ method: 'eth_chainId' });
    console.log(`Connected to chain ${chainId}`);

    // String, hex code of the chainId of the Rinkebey test network
    const rinkebyChainId = '0x4';
    if (chainId !== rinkebyChainId) {
      alert('You are not connected to the Rinkeby Test Network!');
    }
  };

  const checkIfWalletIsConnected = async () => {
    const { ethereum } = window;

    if (!ethereum) {
      console.log('Make sure you have metamask!');
      return;
    }
    console.log('We have the ethereum object', ethereum);

    const accounts = await ethereum.request({ method: 'eth_accounts' });

    if (accounts.length !== 0) {
      const account = accounts[0];
      console.log('Found an authorized account:', account);
      setCurrentAccount(account);
    } else {
      console.log('No authorized account found');
    }
  };

  /*
   * Implement your connectWallet method here
   */
  const connectWallet = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        alert('Get MetaMask!');
        return;
      }

      /*
       * Fancy method to request access to account.
       */
      const accounts = await ethereum.request({ method: 'eth_requestAccounts' });

      /*
       * Boom! This should print out public address once we authorize Metamask.
       */
      console.log('Connected', accounts[0]);
      setCurrentAccount(accounts[0]);
    } catch (error) {
      console.log(error);
    }
  };

  const askContractToMintNft = async () => {
    const CONTRACT_ADDRESS = '0x2573318BBDb2A9A3F54B8063e57AAB1150c199C9';

    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const connectedContract = new ethers.Contract(CONTRACT_ADDRESS, sandboxNFTContract.abi, signer);

        console.log('Going to pop wallet now to pay gas...');
        const nftTxn = await connectedContract.mintNewNFT();

        console.log('Mining...please wait.');
        await nftTxn.wait();

        // just because our transaction is mined does not mean the transaction resulted in the NFT being minted
        // It could have just error’d out!! Even if it error’d out, it would have still been mined in the process.
        // it is only really minted after we receive the NewNFTMinted event
        console.log(`Mined, see transaction: https://rinkeby.etherscan.io/tx/${nftTxn.hash}`);

        connectedContract.on('NewNFTMinted', (from, tokenId) => {
          console.log(from, tokenId.toNumber());
          alert(
            `Hey there! We've minted your NFT. It may be blank right now. It can take a max of 10 min to show up on OpenSea. Here's the link: <https://testnets.opensea.io/assets/${CONTRACT_ADDRESS}/${tokenId.toNumber()}>`
          );
        });
      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    checkIfWeAreOnTheRightNetworks();
    checkIfWalletIsConnected();
  }, []);

  return (
    <div>
      <p>My NFT Collection</p>
      <p>Each unique. Each beautiful. Discover your NFT today.</p>
      {currentAccount === '' ? (
        <button onClick={connectWallet} type="button">
          Connect to Wallet
        </button>
      ) : (
        <>
          <p>Connected wallet: {currentAccount}</p>
          <button onClick={askContractToMintNft} type="button">
            Mint NFT
          </button>
        </>
      )}
    </div>
  );
};

export default Home;
