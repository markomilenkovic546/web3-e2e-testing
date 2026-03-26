import type { Locator, Page } from '@playwright/test';
import { expect, test } from '../../tests/fixtures';

export class NftCardModal {
   readonly page: Page;
   readonly container: Locator;
   readonly nftId: Locator;
   readonly nftCardTitle: Locator;
   readonly nftImage: Locator;
   readonly nftGalleryButton: Locator;
   readonly closeModalBtn: Locator;
   readonly shownNftCountMessage: (quantity: number | string) => Locator;

   constructor(page: Page) {
      this.page = page;
      this.container = page.locator('[data-cy="container-modal-claimed"]');
      this.nftId = page.locator('[data-cy="href-nft"]');
      this.nftCardTitle = page.locator('h4.font-semibold');
      this.nftImage = page.locator('figure img.inset-0');
      this.nftGalleryButton = page.locator('[data-cy="btn-gallery-open"]');
      this.closeModalBtn = page.locator('[data-cy="btn-modal-close"]');
      this.shownNftCountMessage = (quantity) =>
         this.container.getByText(`1 of ${quantity} freshly minted NFTs shown.`, {
            exact: true,
         });
   }

   // --------------------------------------------------------------------------
   // Actions
   // --------------------------------------------------------------------------

   /**
    * Opens the NFT Gallery by clicking the gallery button.
    */
   async openNFTGallery() {
      await test.step('Open NFT Gallery', async () => {
         await this.expectNftGalleryButtonIsVisible();
         await this.nftGalleryButton.click();
         console.log('NFT Gallery button is clicked');
      });
   }

   /**
    * Closes the NFT card modal.
    */
   async close() {
      await test.step('Close NFT Card modal', async () => {
         await this.expectCloseModalBtnIsVisible();
         await this.closeModalBtn.click();
         console.log('Close NFT card modal button is clicked');
      });
   }

   // --------------------------------------------------------------------------
   // Assertions
   // --------------------------------------------------------------------------

   /**
    * Asserts that the NFT card modal container is visible.
    */
   async expectContainerIsVisible() {
      await expect(this.container, 'Expect NFT card modal container to be visible').toBeVisible();
      console.log('NFT card modal container is visible');
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
    * Asserts that the NFT Gallery button is visible.
    */
   async expectNftGalleryButtonIsVisible() {
      await expect(this.nftGalleryButton, 'Expect NFT Gallery button to be visible').toBeVisible();
      console.log('NFT Gallery button is visible');
   }

   /**
    * Asserts that the close modal button is visible.
    */
   async expectCloseModalBtnIsVisible() {
      await expect(this.closeModalBtn, 'Expect close modal button to be visible').toBeVisible();
      console.log('Close modal button is visible');
   }

   /**
    * Asserts that the shown NFT count message is visible.
    * @param {number | string} quantity - The total number of freshly minted NFTs.
    */
   async expectShownNftCountMessageVisible(quantity: number | string) {
      await expect(
         this.shownNftCountMessage(quantity),
         `Expect "1 of ${quantity} freshly minted NFTs shown." message to be visible`,
      ).toBeVisible();
      console.log(
         'Shown NFT message is visible:',
         `1 of ${quantity} freshly minted NFTs shown." message to be visible`,
      );
   }
}
