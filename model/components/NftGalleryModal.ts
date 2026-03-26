import type { Locator, Page } from '@playwright/test';
import { expect, test } from '../../tests/fixtures';

export class NftGalleryModal {
   readonly page: Page;
   readonly container: Locator;
   readonly closeModalBtn: Locator;
   readonly disconnectBtn: Locator;
   readonly nftItemButton: (nftId: string) => Locator;
   readonly nftCard: Locator;
   readonly nftCardTitle: Locator;
   readonly nftCardDescription: Locator;
   readonly nftId: Locator;
   readonly nftImage: Locator;
   readonly walletBalance: Locator;

   constructor(page: Page) {
      this.page = page;
      this.container = page.locator('[data-cy="container-nft-gallery"]');
      this.closeModalBtn = page.locator('[data-cy="btn-modal-close"]');
      this.disconnectBtn = page.locator('[data-cy="btn-disconnect"]');
      this.nftItemButton = (nftId) => page.locator(`[data-cy="btn-nft-item-${nftId}"]`);
      this.nftCard = page.locator('[data-cy="nft-card"]');
      this.nftCardTitle = page.locator('[data-cy="nft-card"] h4');
      this.nftCardDescription = page.locator('[data-cy="nft-card"] p');
      this.nftId = page.locator('[data-cy="href-nft"]');
      this.nftImage = page.locator('[data-cy="nft-card"] figure img');
      this.walletBalance = page.locator('.mr-2.text-sm.font-bold');
   }

   // --------------------------------------------------------------------------
   // Actions
   // --------------------------------------------------------------------------

   async close() {
      await test.step('Close NFT Gallery modal', async () => {
         await this.expectCloseModalBtnIsVisible();
         await this.closeModalBtn.click();
         console.log('Close NFT Gallery modal button is clicked');
      });
   }

   async disconnect() {
      await test.step('Disconnect wallet from Gallery', async () => {
         await this.expectDisconnectBtnIsVisible();
         await this.disconnectBtn.click();
         console.log('Disconnect button is clicked');
      });
   }

   getNftItem(nftId: string): Locator {
      return this.page.locator(`[data-cy="btn-nft-item-${nftId}"]`);
   }

   async clickOnNft(nftId: string) {
      await test.step(`Click on NFT with ID: ${nftId}`, async () => {
         const nftItem = this.getNftItem(nftId);
         await expect(
            nftItem,
            `Expect NFT item with ID ${nftId}[nftItem] to be visible`,
         ).toBeVisible();
         await nftItem.click();
         console.log(`NFT item with ID ${nftId} is clicked`);
      });
   }

   /**
    * Selects an NFT item by clicking its button.
    * @param {string} nftId - The ID of the NFT.
    */
   async selectNftItem(nftId: string) {
      await test.step(`Select NFT item: ${nftId}`, async () => {
         await this.expectNftItemButtonIsVisible(nftId);
         await this.nftItemButton(nftId).click();
         console.log(`NFT item button for ID ${nftId} is clicked`);
      });
   }

   // --------------------------------------------------------------------------
   // Assertions
   // --------------------------------------------------------------------------

   // --- Modal Controls ---

   /**
    * Asserts that the NFT Gallery container is visible.
    */
   async expectContainerIsVisible() {
      await expect(
         this.container,
         'Expect NFT Gallery container[container] to be visible',
      ).toBeVisible();
      console.log('NFT Gallery container is visible');
   }

   /**
    * Asserts that the NFT Gallery container is not visible.
    */
   async expectContainerIsNotVisible() {
      await expect(
         this.container,
         'Expect NFT Gallery container[container] to be hidden',
      ).toBeHidden();
      console.log('NFT Gallery container is not visible');
   }

   /**
    * Asserts that the close modal button is visible.
    */
   async expectCloseModalBtnIsVisible() {
      await expect(
         this.closeModalBtn,
         'Expect close modal button[closeModalBtn] to be visible',
      ).toBeVisible();
      console.log('Close modal button is visible');
   }

   /**
    * Asserts that the disconnect button is visible.
    */
   async expectDisconnectBtnIsVisible() {
      await expect(
         this.disconnectBtn,
         'Expect disconnect button[disconnectBtn] to be visible',
      ).toBeVisible();
      console.log('Disconnect button is visible');
   }

   /**
    * Asserts that the disconnect button is not visible.
    */
   async expectDisconnectBtnIsNotVisible() {
      await expect(
         this.disconnectBtn,
         'Expect disconnect button[disconnectBtn] to be hidden',
      ).toBeHidden();
      console.log('Disconnect button is not visible');
   }

   // --- NFT Details ---

   /**
    * Asserts that the NFT card is visible.
    */
   async expectNftCardIsVisible() {
      await expect(this.nftCard, 'Expect NFT card[nftCard] to be visible').toBeVisible();
      console.log('NFT card is visible');
   }

   /**
    * Asserts that the NFT card is not visible.
    */
   async expectNftCardIsNotVisible() {
      await expect(this.nftCard, 'Expect NFT card[nftCard] to be hidden').toBeHidden();
      console.log('NFT card is not visible');
   }

   /**
    * Asserts that the NFT item button is visible.
    * @param {string} nftId - The ID of the NFT.
    */
   async expectNftItemButtonIsVisible(nftId: string) {
      await expect(
         this.nftItemButton(nftId),
         `Expect NFT item button for ID ${nftId} to be visible`,
      ).toBeVisible();
      console.log(`NFT item button for ID ${nftId} is visible`);
   }

   /**
    * Asserts that the NFT ID matches the expected value.
    * @param {string} nftId - The expected NFT ID.
    */
   async expectNftId(nftId: string) {
      await expect(this.nftId, `Expect NFT ID to be "${nftId}"`).toHaveText(nftId);
      console.log('Correct NFT ID is displayed:', await this.nftId.textContent());
   }

   /**
    * Asserts that the NFT card title matches the expected value.
    * @param {string} title - The expected title.
    */
   async expectNftCardTitle(title: string) {
      await expect(this.nftCardTitle, `Expect NFT card title to be "${title}"`).toHaveText(title);
      console.log('Correct NFT card title is displayed:', await this.nftCardTitle.textContent());
   }

   /**
    * Asserts that the NFT image alt text matches the expected value.
    * @param {string} alt - The expected alt text.
    */
   async expectNftImageAltText(alt: string) {
      await expect(this.nftImage, `Expect NFT image alt text to be "${alt}"`).toHaveAttribute(
         'alt',
         alt,
      );
      console.log('Correct NFT image alt text is displayed');
   }

   /**
    * Asserts that the NFT card description matches the expected value.
    * @param {string} description - The expected description.
    */
   async expectNftCardDescription(description: string) {
      await expect(
         this.nftCardDescription,
         `Expect NFT card description to be "${description}"`,
      ).toHaveText(description);
      console.log(
         'Correct NFT card description is displayed:',
         await this.nftCardDescription.textContent(),
      );
   }

   /**
    * Asserts that the wallet balance matches the expected value.
    * @param {string} balance - The expected balance value (e.g., "4.2151").
    */
   async expectCorrectWalletBalance(balance: string) {
      await expect(
         this.walletBalance,
         `Expect wallet balance[walletBalance] to contain text "Balance: ${balance} POL"`,
      ).toContainText(`Balance: ${balance} POL`);
      console.log(`Wallet balance (${balance} POL) verified successfully!`);
   }
}
