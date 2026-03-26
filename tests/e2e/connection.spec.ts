import { test } from '../fixtures';

test.describe('Connection @connection', () => {
   test.beforeEach(async ({ mintingPage }) => {
      await mintingPage.goto();
   });

   test('User should be able to connect the wallet successfully', async ({
      mintingPage,
      metamask,
      masterAccount,
      page,
   }) => {
      const address = await masterAccount();

      await mintingPage.connectWallet();

      await metamask.connectToDapp();

      await mintingPage.header.expectAccountBtnIsVisible();

      await mintingPage.header.expectCorrectAddressIsConnected(address);

      await mintingPage.header.accountBtn.scrollIntoViewIfNeeded();
      await test.info().attach('wallet-connected', {
         body: await page.screenshot(),
         contentType: 'image/png',
      });
   });

   test('User should be able to disconnect the wallet successfully', async ({
      mintingPage,
      metamask,
      masterAccount,
      page,
   }) => {
      await masterAccount();

      await mintingPage.connectWallet();

      await metamask.connectToDapp();

      await mintingPage.header.expectAccountBtnIsVisible();

      await mintingPage.header.clickAccount();

      await mintingPage.nftGalleryModal.disconnect();

      await page.waitForTimeout(5000);

      await mintingPage.header.expectConnectWalletBtnIsVisible();

      await mintingPage.expectNotConnectedMessage();

      await mintingPage.notConnectedMessage.scrollIntoViewIfNeeded();
      await test.info().attach('wallet-disconnected', {
         body: await page.screenshot(),
         contentType: 'image/png',
      });
   });

   test('User should be able to recover wallet connection after switching networks', async ({
      mintingPage,
      metamask,
      masterAccount,
      page,
   }) => {
      const address = await masterAccount();

      await mintingPage.connectWallet();

      await metamask.connectToDapp();

      console.log('Switching to Ethereum Mainnet...');
      await metamask.switchNetwork('Ethereum Mainnet', false);

      await mintingPage.expectWrongNetworkMessage();

      await test.info().attach('wrong-network-message', {
         body: await page.screenshot(),
         contentType: 'image/png',
      });

      console.log('Clicking Switch Network button on dApp...');
      await mintingPage.switchNetwork();

      console.log('Approving network switch in MetaMask...');
      await metamask.approveSwitchNetwork();

      await mintingPage.header.expectCorrectAddressIsConnected(address);

      await mintingPage.mintingModal.expectMintingInfoMessage('Ready for minting');

      await mintingPage.mintingModal.container.scrollIntoViewIfNeeded();
      await test.info().attach('network-switch-success', {
         body: await page.screenshot(),
         contentType: 'image/png',
      });

      console.log('Network switch handled correctly!');
   });
});
