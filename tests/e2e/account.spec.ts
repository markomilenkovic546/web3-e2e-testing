import masterCollection from '../../static-data/master-collection.json' with { type: 'json' };
import { test } from '../fixtures';

test.describe('Account @account', () => {
   test.beforeEach(async ({ mintingPage }) => {
      await mintingPage.goto();
   });

   test('Account button should display correct NFT balance after connecting wallet', async ({
      mintingPage,
      metamask,
      masterAccount,
      getNftBalance,
      page,
   }) => {
      const address = await masterAccount();
      const expectedBalance = await getNftBalance(address);

      await mintingPage.connectWallet();

      await metamask.connectToDapp();

      await mintingPage.header.expectAccountBtnIsVisible();
      await mintingPage.header.expectCorrectAddressIsConnected(address);
      await mintingPage.header.expectCorrectNftBalance(expectedBalance);

      await test.info().attach('account-button-balance', {
         body: await page.screenshot(),
         contentType: 'image/png',
      });
   });

   test('NFT Gallery modal should display correct POL balance', async ({
      mintingPage,
      metamask,
      masterAccount,
      blockchainUtils,
      page,
   }) => {
      const address = await masterAccount();
      const formattedBalance = await blockchainUtils.getFormattedBalance(address);

      await mintingPage.connectWallet();

      await metamask.connectToDapp();

      await mintingPage.header.clickAccount();

      await mintingPage.nftGalleryModal.expectContainerIsVisible();
      await mintingPage.nftGalleryModal.expectCorrectWalletBalance(formattedBalance);

      await test.info().attach('nft-gallery-pol-balance', {
         body: await page.screenshot(),
         contentType: 'image/png',
      });
   });

   test('NFT Gallery modal should close when clicking the close button', async ({
      mintingPage,
      metamask,
      masterAccount,
      page,
   }) => {
      await masterAccount();

      await mintingPage.connectWallet();

      await metamask.connectToDapp();

      await mintingPage.header.clickAccount();

      await mintingPage.nftGalleryModal.close();

      await mintingPage.nftGalleryModal.expectContainerIsNotVisible();

      await test.info().attach('nft-gallery-modal-closed', {
         body: await page.screenshot(),
         contentType: 'image/png',
      });
   });

   test("NFT Gallery modal should display all NFTs from user's collection", async ({
      mintingPage,
      metamask,
      masterAccount,
      page,
   }) => {
      await masterAccount();

      await mintingPage.connectWallet();

      await metamask.connectToDapp();

      await mintingPage.header.clickAccount();

      await mintingPage.nftGalleryModal.expectContainerIsVisible();

      for (const nft of masterCollection) {
         await mintingPage.nftGalleryModal.expectNftItemButtonIsVisible(nft.id.toString());
      }

      await test.info().attach('nft-gallery-all-nfts', {
         body: await page.screenshot(),
         contentType: 'image/png',
      });
   });

   test('NFT Gallery modal should display correct details when selecting an NFT', async ({
      mintingPage,
      metamask,
      masterAccount,
      page,
   }) => {
      await masterAccount();

      await mintingPage.connectWallet();

      await metamask.connectToDapp();

      await mintingPage.header.clickAccount();

      await mintingPage.nftGalleryModal.expectContainerIsVisible();

      const reversedCollection = [...masterCollection].reverse();

      for (const [index, nft] of reversedCollection.entries()) {
         if (index > 0) {
            await mintingPage.nftGalleryModal.selectNftItem(nft.id.toString());
         }

         await mintingPage.nftGalleryModal.expectNftCardIsVisible();
         await mintingPage.nftGalleryModal.expectNftId(nft.id.toString());
         await mintingPage.nftGalleryModal.expectNftCardTitle(nft.name);
         await mintingPage.nftGalleryModal.expectNftCardDescription(nft.description);
         await mintingPage.nftGalleryModal.expectNftImageAltText(`${nft.name} NFT cat`);

         console.log(`Verified details for NFT ID: ${nft.id}`);
      }

      await test.info().attach('nft-gallery-details', {
         body: await page.screenshot(),
         contentType: 'image/png',
      });
   });
});
