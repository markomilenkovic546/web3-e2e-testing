import { testWithSynpress } from '@synthetixio/synpress';
import { MetaMask, metaMaskFixtures } from '@synthetixio/synpress/playwright';
import { ethers } from 'ethers';
import { MintingPage } from '../model/pages/MintingPage';
import basicSetup from '../test/wallet-setup/basic.setup';
import BlockchainUtils from '../utils/blockchain';

const MASTER_PRIVATE_KEY = process.env.MASTER_PRIVATE_KEY!;
const MAX_MINTED_PRIVATE_KEY = process.env.MAX_MINTED_PRIVATE_KEY!;

// Define the fixture types
type Fixtures = {
   mintingPage: MintingPage;
   metamask: MetaMask;
   blockchainUtils: BlockchainUtils;
   mintAccount: (fundAmount: string) => Promise<string>; // Returns the address
   masterAccount: () => Promise<string>; // Returns the address
   maxMintedAccount: () => Promise<string>; // Returns the address
   getNftOwner: (nftId: string) => Promise<string>;
   getNftBalance: (address: string) => Promise<number>;
   getTotalMintedValue: () => Promise<string>;
};

export const test = testWithSynpress(metaMaskFixtures(basicSetup)).extend<Fixtures>({
   mintingPage: async ({ page }, use) => {
      await use(new MintingPage(page));
   },
   metamask: async ({ context, metamaskPage, extensionId }, use) => {
      const metamask = new MetaMask(context, metamaskPage, basicSetup.walletPassword, extensionId);
      await use(metamask);
   },
   blockchainUtils: async ({}, use) => {
      await use(new BlockchainUtils());
   },
   masterAccount: async ({ metamask, blockchainUtils }, use) => {
      const masterAddress = await blockchainUtils.getAddressFromPrivateKey(MASTER_PRIVATE_KEY);

      console.log(`[Fixture] Ensuring Account 1 (Master) is active: ${masterAddress}`);
      // Account 1 is imported by default from the seed phrase in basic.setup.ts
      await metamask.switchAccount('Account 1');

      await use(async () => masterAddress);
   },
   maxMintedAccount: async ({ metamask, blockchainUtils }, use) => {
      const address = await blockchainUtils.getAddressFromPrivateKey(MAX_MINTED_PRIVATE_KEY);

      console.log(`[Fixture] Importing Max Minted Account into MetaMask: ${address}`);
      await metamask.importWalletFromPrivateKey(MAX_MINTED_PRIVATE_KEY);

      const activeAddress = await metamask.getAccountAddress();
      console.log(`[MetaMask] Active account is now: ${activeAddress}`);

      await use(async () => address);
   },
   mintAccount: async ({ metamask, blockchainUtils }, use) => {
      const masterAddress = await blockchainUtils.getAddressFromPrivateKey(MASTER_PRIVATE_KEY);
      let tempWallet: ethers.Wallet | undefined;

      const createFundedAccount = async (fundAmount: string) => {
         tempWallet = blockchainUtils.createRandomWallet();
         const tempAddress = await tempWallet.getAddress();
         
         await blockchainUtils.fundAccount(MASTER_PRIVATE_KEY, tempAddress, fundAmount);

         console.log(`[Fixture] Importing account into MetaMask...`);
         await metamask.importWalletFromPrivateKey(tempWallet.privateKey);

         const activeAddress = await metamask.getAccountAddress();
         console.log(`[MetaMask] Active account is now: ${activeAddress}`);

         return tempAddress;
      };

      await use(createFundedAccount);

      if (tempWallet) {
         console.log(`[Sweep] Sweeping remaining balance back to Master...`);
         await blockchainUtils.sweepRemainingFunds(tempWallet.privateKey, masterAddress);
      }
   },
   getNftOwner: async ({ blockchainUtils }, use) => {
      await use(async (nftId: string) => blockchainUtils.getNftOwner(nftId));
   },
   getNftBalance: async ({ blockchainUtils }, use) => {
      await use(async (address: string) => blockchainUtils.getNftBalance(address));
   },
   getTotalMintedValue: async ({ blockchainUtils }, use) => {
      await use(async () => blockchainUtils.getTotalMinted());
   },
});

export { expect } from '@playwright/test';
