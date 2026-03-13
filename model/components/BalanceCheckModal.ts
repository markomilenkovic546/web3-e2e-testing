import type { Locator, Page } from '@playwright/test';

export class BalanceCheckModal {
   readonly page: Page;
   readonly container: Locator;
   readonly recheckBtn: Locator;

   constructor(page: Page) {
      this.page = page;
      this.container = page.locator('[data-cy="notice-faucet"]');
      this.recheckBtn = page.locator('[data-cy="btn-recheck-balance"]');
   }

   async recheckBalance() {
      await this.recheckBtn.click();
   }
}
