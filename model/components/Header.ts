import type { Locator, Page } from '@playwright/test';
import { expect } from '../../tests/fixtures';

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

   // --------------------------------------------------------------------------
   // Actions
   // --------------------------------------------------------------------------

   async clickConnect() {
      await this.expectConnectWalletBtnIsVisible();
      await this.connectWalletBtn.click();
      console.log('Connect Wallet button is clicked');
   }

   async clickAccount() {
      await this.expectAccountBtnIsVisible();
      await this.accountBtn.click();
      console.log('Account button is clicked');
   }

   // --------------------------------------------------------------------------
   // Assertions
   // --------------------------------------------------------------------------

   // --- Connection Controls ---

   /**
    * Asserts that the "Connect Wallet" button is visible.
    */
   async expectConnectWalletBtnIsVisible() {
      await expect(this.connectWalletBtn, 'Connect Wallet button[connectWalletBtn] is missing or not visible').toBeVisible();
      console.log('Connect Wallet button is visible');
   }

   /**
    * Asserts that the "Connect Wallet" button is not visible.
    */
   async expectConnectWalletBtnIsNotVisible() {
      await expect(this.connectWalletBtn, 'Connect Wallet button[connectWalletBtn] should not be visible').toBeHidden();
      console.log('Connect Wallet button is not visible');
   }

   // --- Account Information ---

   /**
    * Asserts that the "Account" button is visible.
    */
   async expectAccountBtnIsVisible() {
      await expect(this.accountBtn, 'Account button[accountBtn] is missing or not visible').toBeVisible();
      console.log('Account button is visible');
   }

   /**
    * Asserts that the "Account" button is not visible.
    */
   async expectAccountBtnIsNotVisible() {
      await expect(this.accountBtn, 'Account button[accountBtn] should not be visible').toBeHidden();
      console.log('Account button is not visible');
   }

   /**
    * Asserts that the "Account" button is enabled.
    */
   async expectAccountBtnIsEnabled() {
      await expect(this.accountBtn, 'Account button[accountBtn] should be enabled').toBeEnabled();
      console.log('Account button is enabled');
   }

   /**
    * Asserts that the "Account" button is disabled.
    */
   async expectAccountBtnIsDisabled() {
      await expect(this.accountBtn, 'Account button[accountBtn] should be disabled').toBeDisabled();
      console.log('Account button is disabled');
   }

   /**
    * Asserts that the number of NFTs figure is visible.
    */
   async expectNumberOfNftsFigureIsVisible() {
      await expect(this.numberOfNftsBtnFigure, 'Number of NFTs figure[numberOfNftsBtnFigure] is missing or not visible').toBeVisible();
      console.log('Number of NFTs figure is visible');
   }

   /**
    * Asserts that the number of NFTs figure is not visible.
    */
   async expectNumberOfNftsFigureIsNotVisible() {
      await expect(this.numberOfNftsBtnFigure, 'Number of NFTs figure[numberOfNftsBtnFigure] should not be visible').toBeHidden();
      console.log('Number of NFTs figure is not visible');
   }

   /**
    * Asserts that the header displays the correct wallet address prefix.
    * @param {string} address - The full wallet address to verify.
    */
   async expectCorrectAddressIsConnected(address: string) {
      const addressPrefix = address.substring(0, 4);
      await expect(this.accountBtn, `Account button[accountBtn] should contain address prefix ${addressPrefix}`).toContainText(new RegExp(addressPrefix, 'i'));
      console.log('Account verified successfully!');
   }
}
