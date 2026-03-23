import type { Locator, Page } from '@playwright/test';
import { expect, test } from '../../tests/fixtures';

export class Header {
   readonly page: Page;
   readonly connectWalletBtn: Locator;
   readonly accountBtn: Locator;
   readonly numberOfNftsBtnFigure: Locator;

   constructor(page: Page) {
      this.page = page;
      this.connectWalletBtn = page.getByRole('button', { name: /Connect Wallet/i });
      this.accountBtn = page.locator('[data-cy="btn-account"]');
      this.numberOfNftsBtnFigure = page.locator('[data-cy="nft-user-count"]');
   }

   // --------------------------------------------------------------------------
   // Actions
   // --------------------------------------------------------------------------

   async clickConnect() {
      await test.step('Click "Connect Wallet" button', async () => {
         await this.expectConnectWalletBtnIsVisible();
         await this.connectWalletBtn.click();
         console.log('Connect Wallet button is clicked');
      });
   }

   async clickAccount() {
      await test.step('Click account button', async () => {
         await this.expectAccountBtnIsVisible();
         await this.accountBtn.click();
         console.log('Account button is clicked');
      });
   }

   // --------------------------------------------------------------------------
   // Assertions
   // --------------------------------------------------------------------------

   // --- Connection Controls ---

   /**
    * Asserts that the "Connect Wallet" button is visible.
    */
   async expectConnectWalletBtnIsVisible() {
      await expect(this.connectWalletBtn, 'Expect connect wallet button[connectWalletBtn] to be visible').toBeVisible();
      console.log('Connect Wallet button is visible');
   }

   /**
    * Asserts that the "Connect Wallet" button is not visible.
    */
   async expectConnectWalletBtnIsNotVisible() {
      await expect(this.connectWalletBtn, 'Expect connect wallet button[connectWalletBtn] to be hidden').toBeHidden();
      console.log('Connect Wallet button is not visible');
   }

   // --- Account Information ---

   /**
    * Asserts that the "Account" button is visible.
    */
   async expectAccountBtnIsVisible() {
      await expect(this.accountBtn, 'Expect account button[accountBtn] to be visible').toBeVisible();
      console.log('Account button is visible');
   }

   /**
    * Asserts that the "Account" button is not visible.
    */
   async expectAccountBtnIsNotVisible() {
      await expect(this.accountBtn, 'Expect account button[accountBtn] to be hidden').toBeHidden();
      console.log('Account button is not visible');
   }

   /**
    * Asserts that the "Account" button is enabled.
    */
   async expectAccountBtnIsEnabled() {
      await expect(this.accountBtn, 'Expect account button[accountBtn] to be enabled').toBeEnabled();
      console.log('Account button is enabled');
   }

   /**
    * Asserts that the "Account" button is disabled.
    */
   async expectAccountBtnIsDisabled() {
      await expect(this.accountBtn, 'Expect account button[accountBtn] to be disabled').toBeDisabled();
      console.log('Account button is disabled');
   }

   /**
    * Asserts that the number of NFTs figure is visible.
    */
   async expectNumberOfNftsFigureIsVisible() {
      await expect(this.numberOfNftsBtnFigure, 'Expect number of NFTs figure[numberOfNftsBtnFigure] to be visible').toBeVisible();
      console.log('Number of NFTs figure is visible');
   }

   /**
    * Asserts that the number of NFTs figure is not visible.
    */
   async expectNumberOfNftsFigureIsNotVisible() {
      await expect(this.numberOfNftsBtnFigure, 'Expect number of NFTs figure[numberOfNftsBtnFigure] to be hidden').toBeHidden();
      console.log('Number of NFTs figure is not visible');
   }

   /**
    * Asserts that the correct number of NFTs is displayed on the account button.
    * @param {number} expectedBalance - The expected number of NFTs.
    */
   async expectCorrectNftBalance(expectedBalance: number) {
      await expect(this.numberOfNftsBtnFigure, `Expect number of NFTs figure[numberOfNftsBtnFigure] to have text "${expectedBalance}"`).toHaveText(expectedBalance.toString());
      console.log(`Number of NFTs (${expectedBalance}) verified successfully!`);
   }

   /**
    * Asserts that the header displays the correct wallet address prefix.
    * @param {string} address - The full wallet address to verify.
    */
   async expectCorrectAddressIsConnected(address: string) {
      const addressPrefix = address.substring(0, 4);
      await expect(this.accountBtn, `Expect account button[accountBtn] to contain address prefix "${addressPrefix}"`).toContainText(new RegExp(addressPrefix, 'i'));
      console.log('Account verified successfully!');
   }
}
