// Import necessary Synpress modules
import { defineWalletSetup } from '@synthetixio/synpress';
import { MetaMask } from '@synthetixio/synpress/playwright';
import 'dotenv/config';

// Define a test seed phrase and password
export const SEED_PHRASE = process.env.METAMASK_SEED_PHRASE!;
export const PASSWORD = process.env.METAMASK_PASSWORD!;

// Define the basic wallet setup
export default defineWalletSetup(PASSWORD, async (context, walletPage) => {
   // Create a new MetaMask instance
   const metamask = new MetaMask(context, walletPage, PASSWORD);

   // Import the wallet using the seed phrase
   await metamask.importWallet(SEED_PHRASE);

   await metamask.addNetwork({
      name: process.env.AMOY_NAME!,
      rpcUrl: process.env.AMOY_RPC_URL!,
      chainId: Number(process.env.AMOY_CHAIN_ID!),
      symbol: process.env.AMOY_SYMBOL!,
   });
});
