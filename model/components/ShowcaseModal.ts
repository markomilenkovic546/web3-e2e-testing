import type { Locator, Page } from '@playwright/test';

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

   async close() {
      await this.closeModalBtn.click();
   }

   async disconnect() {
      await this.disconnectBtn.click();
   }

   getNftItem(nftId: string): Locator {
      return this.page.locator(`[data-cy="btn-nft-item-${nftId}"]`);
   }

   async clickOnNft(nftId: string) {
      await this.getNftItem(nftId).click();
   }
}
