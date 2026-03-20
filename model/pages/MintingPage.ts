import type { Locator, Page } from '@playwright/test';
import { expect, test } from '../../tests/fixtures';
import { Header } from '../components/Header';
import { MintingModal } from '../components/MintingModal';
import { NftGalleryModal } from '../components/NftGalleryModal';
import { BalanceCheckModal } from '../components/BalanceCheckModal';
import { NftCardModal } from '../components/NftCardModal';

/**
 * Represents the Minting Page and its components.
 */
export class MintingPage {
   readonly page: Page;
   readonly header: Header;
   readonly nftGalleryModal: NftGalleryModal;
   readonly mintingModal: MintingModal;
   readonly balanceCheckModal: BalanceCheckModal;
   readonly nftCardModal: NftCardModal;
   readonly notConnectedMessage: Locator;
   readonly testNetDisclamer: Locator;
   readonly wrongNetworkMessage: Locator;
   readonly switchNetworkBtn: Locator;

   constructor(page: Page) {
      this.page = page;
      this.header = new Header(page);
      this.nftGalleryModal = new NftGalleryModal(page);
      this.mintingModal = new MintingModal(page);
      this.balanceCheckModal = new BalanceCheckModal(page);
      this.nftCardModal = new NftCardModal(page);
      this.notConnectedMessage = page.locator('[data-cy="notice-not-connected"]').getByText('Not connected!', { exact: true })
      this.testNetDisclamer = page.locator('[data-cy="notice-not-connected"]', { hasText: '*Minting on this site uses testnet, so no real money is spent, letting you try NFT minting without financial risk.' })
      this.wrongNetworkMessage = page.getByText('Wrong network!', { exact: true })
      this.switchNetworkBtn = page.getByRole('button', { name: /Switch Network/i })
   }

   // --------------------------------------------------------------------------
   // Actions
   // --------------------------------------------------------------------------

   /**
    * Navigates to the home page.
    */
   async goto() {
      await test.step('Navigate to Minting Page', async () => {
         await this.page.goto('/');
      });
   }

   /**
    * Initiates the wallet connection process using MetaMask.
    */
   async connectWallet() {
      await test.step('Connect wallet', async () => {
         await this.header.clickConnect();
         const metamaskOption = this.page.locator('[data-testid="rk-wallet-option-io.metamask"]');
         await expect(metamaskOption, 'Expect MetaMask option[metamaskOption] to be visible').toBeVisible();
         await metamaskOption.click();
         console.log('MetaMask wallet option is clicked');
      });
   }

   /**
    * Clicks the "Switch Network" button.
    */
   async switchNetwork() {
      await test.step('Switch network', async () => {
         await this.expectSwitchNetworkBtnIsVisible();
         await this.switchNetworkBtn.click();
         console.log('Switch Network button is clicked');
      });
   }

   // --------------------------------------------------------------------------
   // Assertions
   // --------------------------------------------------------------------------

   // --- Connection Status ---

   /**
    * Asserts that the "Not connected!" message is visible.
    */
   async expectNotConnectedMessage() {
      await expect(this.notConnectedMessage, 'Expect "Not connected!" message to be visible').toBeVisible({ timeout: 120000 });
      console.log('Not connected message is displayed');
   }

   /**
    * Asserts that the testnet disclaimer is visible.
    */
   async expectTestNetDisclamer() {
      await expect(this.testNetDisclamer, 'Expect testnet disclaimer to be visible').toBeVisible({ timeout: 120000 });
      console.log('Testnet disclaimer is displayed');
   }

   /**
    * Asserts that the "Wrong network!" message is visible.
    */
   async expectWrongNetworkMessage() {
      await expect(this.wrongNetworkMessage, 'Expect "Wrong network!" message to be visible').toBeVisible({ timeout: 120000 });
      console.log('Wrong network message is displayed');
   }

   // --- Network Controls ---

   /**
    * Asserts that the "Switch Network" button is visible.
    */
   async expectSwitchNetworkBtnIsVisible() {
      await expect(this.switchNetworkBtn, 'Expect "Switch Network" button[switchNetworkBtn] to be visible').toBeVisible();
      console.log('Switch Network button is visible');
   }

   /**
    * Asserts that the "Switch Network" button is not visible.
    */
   async expectSwitchNetworkBtnIsNotVisible() {
      await expect(this.switchNetworkBtn, 'Expect "Switch Network" button[switchNetworkBtn] to be hidden').toBeHidden();
      console.log('Switch Network button is not visible');
   }

   /**
    * Asserts that the "Switch Network" button is enabled.
    */
   async expectSwitchNetworkBtnIsEnabled() {
      await expect(this.switchNetworkBtn, 'Expect "Switch Network" button[switchNetworkBtn] to be enabled').toBeEnabled();
      console.log('Switch Network button is enabled');
   }

   /**
    * Asserts that the "Switch Network" button is disabled.
    */
   async expectSwitchNetworkBtnIsDisabled() {
      await expect(this.switchNetworkBtn, 'Expect "Switch Network" button[switchNetworkBtn] to be disabled').toBeDisabled();
      console.log('Switch Network button is disabled');
   }
}
