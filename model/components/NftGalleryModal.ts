import type { Locator, Page } from '@playwright/test';
import { expect } from '../../tests/fixtures';

export class NftGalleryModal {
   readonly page: Page;
   readonly container: Locator;
   readonly closeModalBtn: Locator;
   readonly disconnectBtn: Locator;
   readonly nftItemButton: (nftId: string) =>  Locator;
   readonly nftCard: Locator;
   readonly nftCardTitle: Locator;
   readonly nftCardDescription: Locator;
   readonly nftId: Locator;
   readonly nftImage: Locator;

   constructor(page: Page) {
      this.page = page;
      this.container = page.locator('[data-cy="container-nft-gallery"]');
      this.closeModalBtn = page.locator('[data-cy="btn-modal-close"]');
      this.disconnectBtn = page.locator('[data-cy="btn-disconnect"]');
      this.nftItemButton = (nftId) =>  page.locator(`[data-cy="btn-nft-item-${nftId}"]`)
      this.nftCard = page.locator('[data-cy="nft-card"]');
      this.nftCardTitle = page.locator('[data-cy="nft-card"] h4');
      this.nftCardDescription = page.locator('[data-cy="nft-card"] p');
      this.nftId = page.locator('[data-cy="href-nft"]');
      this.nftImage = page.locator('[data-cy="nft-card"] figure img');
   }

   // --------------------------------------------------------------------------
   // Actions
   // --------------------------------------------------------------------------

   async close() {
      await this.expectCloseModalBtnIsVisible();
      await this.closeModalBtn.click();
      console.log('Close NFT Gallery modal button is clicked');
   }

   async disconnect() {
      await this.expectDisconnectBtnIsVisible();
      await this.disconnectBtn.click();
      console.log('Disconnect button is clicked');
   }

   getNftItem(nftId: string): Locator {
      return this.page.locator(`[data-cy="btn-nft-item-${nftId}"]`);
   }

   async clickOnNft(nftId: string) {
      const nftItem = this.getNftItem(nftId);
      await expect(nftItem, `NFT item with ID ${nftId}[nftItem] is missing or not visible`).toBeVisible();
      await nftItem.click();
      console.log(`NFT item with ID ${nftId} is clicked`);
   }

   /**
    * Selects an NFT item by clicking its button.
    * @param {string} nftId - The ID of the NFT.
    */
   async selectNftItem(nftId: string) {
      await this.expectNftItemButtonIsVisible(nftId);
      await this.nftItemButton(nftId).click();
      console.log(`NFT item button for ID ${nftId} is clicked`);
   }

   // --------------------------------------------------------------------------
   // Assertions
   // --------------------------------------------------------------------------

   // --- Modal Controls ---

   /**
    * Asserts that the NFT Gallery container is visible.
    */
   async expectContainerIsVisible() {
      await expect(this.container, 'NFT Gallery container[container] is missing or not visible').toBeVisible();
      console.log('NFT Gallery container is visible');
   }

   /**
    * Asserts that the NFT Gallery container is not visible.
    */
   async expectContainerIsNotVisible() {
      await expect(this.container, 'NFT Gallery container[container] should not be visible').toBeHidden();
      console.log('NFT Gallery container is not visible');
   }

   /**
    * Asserts that the close modal button is visible.
    */
   async expectCloseModalBtnIsVisible() {
      await expect(this.closeModalBtn, 'Close modal button[closeModalBtn] is missing or not visible').toBeVisible();
      console.log('Close modal button is visible');
   }

   /**
    * Asserts that the disconnect button is visible.
    */
   async expectDisconnectBtnIsVisible() {
      await expect(this.disconnectBtn, 'Disconnect button[disconnectBtn] is missing or not visible').toBeVisible();
      console.log('Disconnect button is visible');
   }

   /**
    * Asserts that the disconnect button is not visible.
    */
   async expectDisconnectBtnIsNotVisible() {
      await expect(this.disconnectBtn, 'Disconnect button[disconnectBtn] should not be visible').toBeHidden();
      console.log('Disconnect button is not visible');
   }

   // --- NFT Details ---

   /**
    * Asserts that the NFT card is visible.
    */
   async expectNftCardIsVisible() {
      await expect(this.nftCard, 'NFT card[nftCard] is missing or not visible').toBeVisible();
      console.log('NFT card is visible');
   }

   /**
    * Asserts that the NFT card is not visible.
    */
   async expectNftCardIsNotVisible() {
      await expect(this.nftCard, 'NFT card[nftCard] should not be visible').toBeHidden();
      console.log('NFT card is not visible');
   }

   /**
    * Asserts that the NFT item button is visible.
    * @param {string} nftId - The ID of the NFT.
    */
   async expectNftItemButtonIsVisible(nftId: string) {
      await expect(this.nftItemButton(nftId), `NFT item button for ID ${nftId} is missing or not visible`).toBeVisible();
      console.log(`NFT item button for ID ${nftId} is visible`);
   }

   /**
    * Asserts that the NFT ID matches the expected value.
    * @param {string} nftId - The expected NFT ID.
    */
   async expectNftId(nftId: string) {
      await expect(this.nftId, 'Incorrect NFT ID is displayed').toHaveText(nftId);
      console.log('Correct NFT ID is displayed:', await this.nftId.textContent());
   }

   /**
    * Asserts that the NFT card title matches the expected value.
    * @param {string} title - The expected title.
    */
   async expectNftCardTitle(title: string) {
      await expect(this.nftCardTitle, 'Incorrect NFT card title is displayed').toHaveText(title);
      console.log('Correct NFT card title is displayed:', await this.nftCardTitle.textContent());
   }

   /**
    * Asserts that the NFT image alt text matches the expected value.
    * @param {string} alt - The expected alt text.
    */
   async expectNftImageAltText(alt: string) {
      await expect(this.nftImage, 'Incorrect NFT image alt text is displayed').toHaveAttribute('alt', alt);
      console.log('Correct NFT image alt text is displayed');
   }
}
