import type { Locator, Page } from '@playwright/test';

export class MintingModal {
   readonly page: Page;
   readonly container: Locator;
   readonly minusBtn: Locator;
   readonly plusBtn: Locator;
   readonly inputQuantity: Locator;
   readonly mintBtn: Locator;
   readonly nftPrice: Locator;
   readonly nftBalancePerPhase: Locator;
   readonly claimedNftBtn: Locator;

   constructor(page: Page) {
      this.page = page;
      this.container = page.locator('[data-cy="container-minting"]');
      this.minusBtn = page.locator('[data-cy="btn-minus"]');
      this.plusBtn = page.locator('[data-cy="btn-plus"]');
      this.inputQuantity = page.locator('[data-cy="input-quantity"]');
      this.mintBtn = page.locator('[data-cy="btn-mint"]');
      this.nftPrice = page.locator('[data-cy="price-total"]');
      this.nftBalancePerPhase = page.locator('[data-cy="nft-balance-per-phase"]');
      this.claimedNftBtn = page.locator('[data-cy="btn-claimed-nft"]');
   }

   async increaseQuantity() {
      await this.plusBtn.click();
   }

   async decreaseQuantity() {
      await this.minusBtn.click();
   }

   async mint() {
      await this.mintBtn.click();
   }

   async waitForInfoMessage(message: string) {
      await this.page
         .locator('[data-cy="container-info-message"]')
         .getByText(message)
         .waitFor({ timeout: 120000 });
   }
}
