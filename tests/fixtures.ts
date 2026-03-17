import { testWithSynpress } from '@synthetixio/synpress';
import { MetaMask, metaMaskFixtures } from '@synthetixio/synpress/playwright';
import { ethers } from 'ethers';
import { MintingPage } from '../model/pages/MintingPage';
import basicSetup from '../test/wallet-setup/basic.setup';
import abi from '../abi.json' with { type: 'json' };

const MASTER_PRIVATE_KEY = process.env.MASTER_PRIVATE_KEY!;
const AMOY_RPC_URL = process.env.AMOY_RPC_URL!;
const CONTRACT_ADDRESS = process.env.SMART_CONTRACT_ADDRESS!;

// Define the fixture types
type Fixtures = {
   mintingPage: MintingPage;
   metamask: MetaMask;
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
   masterAccount: async ({ metamask }, use) => {
      const provider = new ethers.providers.JsonRpcProvider(AMOY_RPC_URL);
      const masterWallet = new ethers.Wallet(MASTER_PRIVATE_KEY, provider);
      const masterAddress = await masterWallet.getAddress();

      console.log(`[Fixture] Ensuring Account 1 (Master) is active: ${masterAddress}`);
      // Account 1 is imported by default from the seed phrase in basic.setup.ts
      await metamask.switchAccount('Account 1');

      await use(async () => masterAddress);
   },
   mintAccount: async ({ metamask }, use) => {
      const provider = new ethers.providers.JsonRpcProvider(AMOY_RPC_URL);
      const masterWallet = new ethers.Wallet(MASTER_PRIVATE_KEY, provider);
      const masterAddress = await masterWallet.getAddress();

      let tempWallet: ethers.Wallet | undefined;

      const createFundedAccount = async (fundAmount: string) => {
         // 1. Generate a brand new random wallet
         tempWallet = ethers.Wallet.createRandom().connect(provider);
         const tempAddress = await tempWallet.getAddress();
         console.log(`[Fixture] Creating fresh account: ${tempAddress}`);

         // 2. Fund the temp account from Master with specified amount
         console.log(`[Fixture] Funding ${tempAddress} with ${fundAmount} POL from Master...`);
         const fundTx = await masterWallet.sendTransaction({
            to: tempAddress,
            value: ethers.utils.parseEther(fundAmount),
            gasPrice: ethers.utils.parseUnits(process.env.GAS_PRICE_GWEI!, 'gwei'),
            gasLimit: Number(process.env.GAS_LIMIT!),
         });
         await fundTx.wait();
         console.log(`[Fixture] Temp account funded!`);

         // 3. Import this private key into MetaMask UI
         console.log(`[Fixture] Importing account into MetaMask...`);
         await metamask.importWalletFromPrivateKey(tempWallet.privateKey);

         const activeAddress = await metamask.getAccountAddress();
         console.log(`[MetaMask] Active account is now: ${activeAddress}`);

         return tempAddress;
      };

      // Pass the function to the test
      await use(createFundedAccount);

      // AFTER TEST: Sweep remaining funds from the created wallet back to Master
      if (tempWallet) {
         const address = await tempWallet.getAddress();
         const balanceBefore = await provider.getBalance(address);
         console.log(
            `[Sweep] Balance BEFORE sweeping: ${ethers.utils.formatEther(balanceBefore)} POL`,
         );

         if (balanceBefore.gt(0)) {
            console.log(`[Sweep] Sweeping remaining balance from ${address} back to Master...`);

            const gasPrice = ethers.utils.parseUnits(process.env.GAS_PRICE_GWEI!, 'gwei');
            const gasLimit = Number(process.env.GAS_LIMIT!);
            const gasCost = gasPrice.mul(gasLimit);

            if (balanceBefore.gt(gasCost)) {
               const sweepAmount = balanceBefore.sub(gasCost);
               try {
                  const sweepTx = await tempWallet.sendTransaction({
                     to: masterAddress,
                     value: sweepAmount,
                     gasPrice: gasPrice,
                     gasLimit: gasLimit,
                  });
                  await sweepTx.wait();

                  const balanceAfter = await provider.getBalance(address);
                  console.log(
                     `[Sweep] Final balance of fresh address: ${ethers.utils.formatEther(balanceAfter)} POL`,
                  );
               } catch (error) {
                  console.error(`[Sweep] Sweep failed for ${address}:`, error);
               }
            } else {
               console.log(`[Sweep] Balance too low to sweep.`);
            }
         }
      }
   },
   getNftOwner: async ({}, use) => {
      const provider = new ethers.providers.JsonRpcProvider(AMOY_RPC_URL);
      const contract = new ethers.Contract(CONTRACT_ADDRESS, abi, provider);
      await use(async (nftId: string) => {
         return await contract.ownerOf(nftId);
      });
   },
   getTotalMintedValue: async ({}, use) => {
      const provider = new ethers.providers.JsonRpcProvider(AMOY_RPC_URL);
      const contract = new ethers.Contract(CONTRACT_ADDRESS, abi, provider);
      await use(async () => {
         const totalMinted = await contract.totalMinted();
         return totalMinted.toString();
      });
   },
});

export { expect } from '@playwright/test';
