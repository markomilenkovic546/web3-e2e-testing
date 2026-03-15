import type { Locator, Page } from '@playwright/test';
import { expect } from '../../tests/fixtures';
import { Header } from '../components/Header';
import { MintingModal } from '../components/MintingModal';
import { ShowcaseModal } from '../components/ShowcaseModal';
import { BalanceCheckModal } from '../components/BalanceCheckModal';

/**
 * Represents the Minting Page and its components.
 */
export class MintingPage {
   readonly page: Page;
   readonly header: Header;
   readonly showcaseModal: ShowcaseModal;
   readonly mintingModal: MintingModal;
   readonly balanceCheckModal: BalanceCheckModal;
   readonly notConnectedMessage: Locator;
   readonly testNetDisclamer: Locator;
   readonly wrongNetworkMessage: Locator;
   readonly switchNetworkBtn: Locator;

   constructor(page: Page) {
      this.page = page;
      this.header = new Header(page);
      this.showcaseModal = new ShowcaseModal(page);
      this.mintingModal = new MintingModal(page);
      this.balanceCheckModal = new BalanceCheckModal(page);
      this.notConnectedMessage = page.locator('[data-cy="notice-not-connected"]').locator('span', { hasText: 'Not connected!' })
      this.testNetDisclamer = page.locator('[data-cy="notice-not-connected"]', { hasText: '*Minting on this site uses testnet, so no real money is spent, letting you try NFT minting without financial risk.' })
      this.wrongNetworkMessage = page.locator('span', { hasText: 'Wrong network!'})
      this.switchNetworkBtn = page.getByRole('button', { name: /Switch Network/i })
   }

   // --------------------------------------------------------------------------
   // Actions
   // --------------------------------------------------------------------------

   /**
    * Navigates to the home page.
    */
   async goto() {
      await this.page.goto('/');
   }

   /**
    * Initiates the wallet connection process using MetaMask.
    */
   async connectWallet() {
      await this.header.clickConnect();
      const metamaskOption = this.page.locator('[data-testid="rk-wallet-option-io.metamassk"]');
      await expect(metamaskOption, 'MetaMask option[metamaskOption] is missing or not visible').toBeVisible();
      await metamaskOption.click();
   }

   /**
    * Clicks the "Switch Network" button.
    */
   async switchNetwork() {
      await this.expectSwitchNetworkBtnIsVisible();
      await this.switchNetworkBtn.click();
   }

   // --------------------------------------------------------------------------
   // Assertions
   // --------------------------------------------------------------------------

   // --- Connection Status ---

   /**
    * Asserts that the "Not connected!" message is visible.
    */
   async expectNotConnectedMessage() {
      await expect(this.notConnectedMessage, 'Not connected message should be visible').toBeVisible({ timeout: 120000 });
      console.log('Not connected message is displayed');
   }

   /**
    * Asserts that the testnet disclaimer is visible.
    */
   async expectTestNetDisclamer() {
      await expect(this.testNetDisclamer, 'Testnet disclaimer should be visible').toBeVisible({ timeout: 120000 });
      console.log('Testnet disclaimer is displayed');
   }

   /**
    * Asserts that the "Wrong network!" message is visible.
    */
   async expectWrongNetworkMessage() {
      await expect(this.wrongNetworkMessage, 'Wrong network message should be visible').toBeVisible({ timeout: 120000 });
      console.log('Wrong network message is displayed');
   }

   // --- Network Controls ---

   /**
    * Asserts that the "Switch Network" button is visible.
    */
   async expectSwitchNetworkBtnIsVisible() {
      await expect(this.switchNetworkBtn, 'Switch Network button[switchNetworkBtn] is missing or not visible').toBeVisible();
      console.log('Switch Network button is visible');
   }

   /**
    * Asserts that the "Switch Network" button is not visible.
    */
   async expectSwitchNetworkBtnIsNotVisible() {
      await expect(this.switchNetworkBtn, 'Switch Network button[switchNetworkBtn] should not be visible').toBeHidden();
      console.log('Switch Network button is not visible');
   }

   /**
    * Asserts that the "Switch Network" button is enabled.
    */
   async expectSwitchNetworkBtnIsEnabled() {
      await expect(this.switchNetworkBtn, 'Switch Network button[switchNetworkBtn] should be enabled').toBeEnabled();
      console.log('Switch Network button is enabled');
   }

   /**
    * Asserts that the "Switch Network" button is disabled.
    */
   async expectSwitchNetworkBtnIsDisabled() {
      await expect(this.switchNetworkBtn, 'Switch Network button[switchNetworkBtn] should be disabled').toBeDisabled();
      console.log('Switch Network button is disabled');
   }
}
