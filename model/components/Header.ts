import type { Locator, Page } from '@playwright/test';

export class Header {
   readonly page: Page;
   readonly connectWalletBtn: Locator;
   readonly accountBtn: Locator;
   readonly numberOfNftsBtnFigure: Locator;

   constructor(page: Page) {
      this.page = page;
      this.connectWalletBtn = page.getByRole('button', { name: /Connect Wallet/i });
      this.accountBtn = page.locator('[data-cy="btn-account"]');
      this.numberOfNftsBtnFigure = page.locator('[data-cy="btn-account"] figure span');
   }

   async clickConnect() {
      await this.connectWalletBtn.click();
   }

   async clickAccount() {
      await this.accountBtn.click();
   }
}
