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

      await mintingPage.header.expectAccountBtnIsVisible()

      await mintingPage.header.expectCorrectAddressIsConnected(address);
   });

   test('User can disconnect the wallet', async ({
      mintingPage,
      metamask,
      masterAccount,
   }) => {
      await masterAccount();

      await mintingPage.connectWallet();

      await metamask.connectToDapp();

      await mintingPage.header.expectAccountBtnIsVisible()

      await mintingPage.header.clickAccount();

      await mintingPage.showcaseModal.disconnect();

      await mintingPage.header.expectConnectWalletBtnIsVisible()

      await mintingPage.expectNotConnectedMessage()
   });

   test('dApp behave as expected when a user change the network while wallet is connected', async ({
      mintingPage,
      metamask,
      masterAccount,
   }) => {
      const address = await masterAccount();

      await mintingPage.connectWallet();

      await metamask.connectToDapp();

      console.log('Switching to Ethereum Mainnet...');
      await metamask.switchNetwork('Ethereum Mainnet', false);

      await mintingPage.expectWrongNetworkMessage()
     
      console.log('Clicking Switch Network button on dApp...');
      await mintingPage.switchNetwork()

      console.log('Approving network switch in MetaMask...');
      await metamask.approveSwitchNetwork();

      await mintingPage.header.expectCorrectAddressIsConnected(address)

      await mintingPage.mintingModal.expectMintingInfoMessage('Ready for minting')

      console.log('Network switch handled correctly!');
   });
});
