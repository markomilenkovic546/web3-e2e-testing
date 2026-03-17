import { testWithSynpress } from '@synthetixio/synpress';
import { MetaMask, metaMaskFixtures } from '@synthetixio/synpress/playwright';
import { ethers } from 'ethers';
import { MintingPage } from '../model/pages/MintingPage';
import basicSetup from '../test/wallet-setup/basic.setup';
import BlockchainUtils from '../utils/blockchain';

const MASTER_PRIVATE_KEY = process.env.MASTER_PRIVATE_KEY!;

// Define the fixture types
type Fixtures = {
   mintingPage: MintingPage;
   metamask: MetaMask;
   blockchainUtils: BlockchainUtils;
   mintAccount: (fundAmount: string) => Promise<string>; // Returns the address
   masterAccount: () => Promise<string>; // Returns the address
   getNftOwner: (nftId: string) => Promise<string>;
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
      const masterAddress = await blockchainUtils.getMasterAddress(MASTER_PRIVATE_KEY);

      console.log(`[Fixture] Ensuring Account 1 (Master) is active: ${masterAddress}`);
      // Account 1 is imported by default from the seed phrase in basic.setup.ts
      await metamask.switchAccount('Account 1');

      await use(async () => masterAddress);
   },
   mintAccount: async ({ metamask, blockchainUtils }, use) => {
      const masterAddress = await blockchainUtils.getMasterAddress(MASTER_PRIVATE_KEY);
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
   getTotalMintedValue: async ({ blockchainUtils }, use) => {
      await use(async () => blockchainUtils.getTotalMinted());
   },
});

export { expect } from '@playwright/test';
