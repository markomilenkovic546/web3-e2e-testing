import type { Locator, Page } from '@playwright/test';
import { expect } from '../../tests/fixtures';

export class ShowcaseModal {
   readonly page: Page;
   readonly container: Locator;
   readonly closeModalBtn: Locator;
   readonly disconnectBtn: Locator;
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
   }

   async disconnect() {
      await this.expectDisconnectBtnIsVisible();
      await this.disconnectBtn.click();
   }

   getNftItem(nftId: string): Locator {
      return this.page.locator(`[data-cy="btn-nft-item-${nftId}"]`);
   }

   async clickOnNft(nftId: string) {
      const nftItem = this.getNftItem(nftId);
      await expect(nftItem, `NFT item with ID ${nftId}[nftItem] is missing or not visible`).toBeVisible();
      await nftItem.click();
   }

   // --------------------------------------------------------------------------
   // Assertions
   // --------------------------------------------------------------------------

   // --- Modal Controls ---

   /**
    * Asserts that the showcase container is visible.
    */
   async expectContainerIsVisible() {
      await expect(this.container, 'Showcase container[container] is missing or not visible').toBeVisible();
      console.log('Showcase container is visible');
   }

   /**
    * Asserts that the showcase container is not visible.
    */
   async expectContainerIsNotVisible() {
      await expect(this.container, 'Showcase container[container] should not be visible').toBeHidden();
      console.log('Showcase container is not visible');
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
}
