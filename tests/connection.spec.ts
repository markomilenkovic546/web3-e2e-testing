import { expect, test } from './fixtures';

test.describe('Connection', () => {
   test.beforeEach(async ({ mintingPage }) => {
      await mintingPage.goto();
   });

   test('User can connect the wallet', async ({
      mintingPage,
      metamask,
      masterAccount,
   }) => {
      const address = await masterAccount();

      await mintingPage.connectWallet();

      await metamask.connectToDapp();

      // Verify connection
      const displayedAddress = await mintingPage.header.accountBtn.textContent();
      console.log(`UI is displaying account: "${displayedAddress}"`);

      const addressPrefix = address.substring(0, 4);
      const isCorrectAccount = displayedAddress
         ?.toLowerCase()
         .includes(addressPrefix.toLowerCase());

      if (!isCorrectAccount) {
         throw new Error(
            `Connected to wrong account! Expected prefix ${addressPrefix}, but UI shows ${displayedAddress}`,
         );
      }

      console.log('Account verified successfully!');
   });

   test('User can disconnect the wallet', async ({
      mintingPage,
      metamask,
      masterAccount,
      page,
   }) => {
      // 1. Setup: Connect the wallet first
      await masterAccount();
      await mintingPage.connectWallet();
      await metamask.connectToDapp();
      // 2. Action: Click on account button and then disconnect
      await mintingPage.header.clickAccount();
      await mintingPage.showcaseModal.disconnect();

      // 3. Assertions: UI should show "Connect Wallet" and "Not connected" body text
      await expect(mintingPage.header.connectWalletBtn).toBeVisible();
      await expect(mintingPage.header.connectWalletBtn).toHaveText(/Connect Wallet/i);

      // Check for "Not connected" in the body
      await expect(page.locator('body')).toContainText('Not connected');

      console.log('Wallet disconnected successfully from dApp UI.');
   });

   test('dApp behave as expected when a user change the network while wallet is connected', async ({
      mintingPage,
      metamask,
      masterAccount,
      page,
   }) => {
      // 1. Setup: Connect the wallet first on the correct network (Amoy)
      const address = await masterAccount();
      await mintingPage.connectWallet();
      await metamask.connectToDapp();

      // 2. Action: Change network to Ethereum Mainnet
      console.log('Switching to Ethereum Mainnet...');
      await metamask.switchNetwork('Ethereum Mainnet', false);

      // 3. Assertions: UI should show "Wrong network" and mint button should be disabled
      await expect(page.locator('body')).toContainText(/Wrong network/i);
      await expect(mintingPage.mintingModal.mintBtn).toBeDisabled();

      // 4. Action: Click "Switch Network" on the dApp UI and approve in MetaMask
      console.log('Clicking Switch Network button on dApp...');
      await page.getByRole('button', { name: /Switch Network/i }).click();

      console.log('Approving network switch in MetaMask...');
      await metamask.approveSwitchNetwork();

      // 5. Final Assertions: Verify address in header and "Ready for minting" message
      const addressPrefix = address.substring(0, 4);
      await expect(mintingPage.header.accountBtn).toContainText(new RegExp(addressPrefix, 'i'));

      // Use the custom action from MintingModal to wait for the info message
      await mintingPage.mintingModal.waitForInfoMessage('Ready for minting');
      console.log('Network switch handled correctly!');
   });
});
