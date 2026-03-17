import type { Locator, Page } from '@playwright/test';
import { expect } from '../../tests/fixtures';

export class BalanceCheckModal {
   readonly page: Page;
   readonly container: Locator;
   readonly recheckBtn: Locator;

   constructor(page: Page) {
      this.page = page;
      this.container = page.locator('[data-cy="notice-faucet"]');
      this.recheckBtn = page.locator('[data-cy="btn-recheck-balance"]');
   }

   // --------------------------------------------------------------------------
   // Actions
   // --------------------------------------------------------------------------

   async recheckBalance() {
      await this.expectRecheckBtnIsVisible();
      await this.recheckBtn.click();
      console.log('Recheck balance button is clicked');
   }

   // --------------------------------------------------------------------------
   // Assertions
   // --------------------------------------------------------------------------

   // --- Container & State ---

   /**
    * Asserts that the balance check container is visible.
    */
   async expectContainerIsVisible() {
      await expect(this.container, 'Balance check container[container] is missing or not visible').toBeVisible();
      console.log('Balance check container is visible');
   }

   /**
    * Asserts that the balance check container is not visible.
    */
   async expectContainerIsNotVisible() {
      await expect(this.container, 'Balance check container[container] should not be visible').toBeHidden();
      console.log('Balance check container is not visible');
   }

   /**
    * Asserts that the low balance notice displays the correct balance.
    * @param {string} balance - The expected balance amount.
    */
   async expectLowBalanceMessage(balance: string) {
      const message = `You're low on POL!Your current balance is ${balance} POL.`;
      await expect(this.container, `Balance check container[container] should display low balance message for ${balance} POL`).toContainText(message);
      console.log(`Low balance message for ${balance} POL is displayed`);
   }

   // --- Recheck Button ---

   /**
    * Asserts that the "Recheck" button is visible.
    */
   async expectRecheckBtnIsVisible() {
      await expect(this.recheckBtn, 'Recheck button[recheckBtn] is missing or not visible').toBeVisible();
      console.log('Recheck button is visible');
   }

   /**
    * Asserts that the "Recheck" button is not visible.
    */
   async expectRecheckBtnIsNotVisible() {
      await expect(this.recheckBtn, 'Recheck button[recheckBtn] should not be visible').toBeHidden();
      console.log('Recheck button is not visible');
   }

   /**
    * Asserts that the "Recheck" button is enabled.
    */
   async expectRecheckBtnIsEnabled() {
      await expect(this.recheckBtn, 'Recheck button[recheckBtn] should be enabled').toBeEnabled();
      console.log('Recheck button is enabled');
   }
}
