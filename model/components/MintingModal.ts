import type { Locator, Page } from '@playwright/test';
import { expect } from '../../tests/fixtures';

/**
 * Represents the Minting Modal component and its interactions.
 */
export class MintingModal {
   readonly page: Page;
   readonly container: Locator;
   readonly decreaseQuantityBtn: Locator;
   readonly increaseQuantityBtn: Locator;
   readonly inputQuantity: Locator;
   readonly mintBtn: Locator;
   readonly nftPrice: Locator;
   readonly nftBalancePerPhase: Locator;
   readonly claimedNftBtn: Locator;
   readonly mintingInfoMessage: Locator;


   constructor(page: Page) {
      this.page = page;
      this.container = page.locator('[data-cy="container-minting"]');
      this.decreaseQuantityBtn = page.locator('[data-cy="btn-minus"]');
      this.increaseQuantityBtn = page.locator('[data-cy="btn-plus"]');
      this.inputQuantity = page.locator('[data-cy="input-quantity"]');
      this.mintBtn = page.locator('[data-cy="btn-mint"]');
      this.nftPrice = page.locator('[data-cy="price-total"]');
      this.nftBalancePerPhase = page.locator('[data-cy="nft-balance-per-phase"]');
      this.claimedNftBtn = page.locator('[data-cy="btn-claimed-nft"]');
      this.mintingInfoMessage = page.locator('[data-cy="container-info-message"]')
      
   }

   // --------------------------------------------------------------------------
   // Actions
   // --------------------------------------------------------------------------

   /**
    * Increases the NFT minting quantity by clicking the increase quantity button.
    */
   async increaseQuantity() {
      await this.expectIncreaseQuantityBtnIsVisible();
      await this.increaseQuantityBtn.click();
   }

   /**
    * Decreases the NFT minting quantity by clicking the decrease quantity button.
    */
   async decreaseQuantity() {
      await this.expectDecreaseQuantityBtnIsVisible();
      await this.decreaseQuantityBtn.click();
   }

   /**
    * Enters a specific NFT minting quantity.
    * @param {string} quantity - The quantity value to enter.
    */
   async enterQuantity(quantity: string) {
      await this.inputQuantity.fill(quantity);
   }

   /**
    * Initiates the NFT minting process.
    */
   async mint() {
      await this.expectMintBtnIsVisible();
      await this.mintBtn.click();
   }

   // --------------------------------------------------------------------------
   // Assertions
   // --------------------------------------------------------------------------

   // --- Container & Info ---

   /**
    * Asserts that the minting container is visible.
    */
   async expectContainerIsVisible() {
      await expect(this.container, 'Minting container[container] is missing or not visible').toBeVisible();
      console.log('Minting container is visible');
   }

   /**
    * Asserts that the minting container is not visible.
    */
   async expectContainerIsNotVisible() {
      await expect(this.container, 'Minting container[container] should not be visible').toBeHidden();
      console.log('Minting container is not visible');
   }

   /**
    * Asserts that the minting info message displays the expected text.
    * @param {string} message - The expected message text.
    */
   async expectMintingInfoMessage(message: string) {
      const infoMessage = this.mintingInfoMessage.getByText(message);
      await expect(infoMessage, 'Expected minting info message is not visible').toBeVisible({ timeout: 400000 });
      console.log('Correct info message is displayed:', await infoMessage.textContent())
   }

   // --- Quantity Controls ---

   /**
    * Asserts that the increase quantity button is visible.
    */
   async expectIncreaseQuantityBtnIsVisible() {
      await expect(this.increaseQuantityBtn, 'Increase quantity button[increaseQuantityBtn] is missing or not visible').toBeVisible();
      console.log('Increase quantity button is visible');
   }

   /**
    * Asserts that the increase quantity button is enabled.
    */
   async expectIncreaseQuantityBtnIsEnabled() {
      await expect(this.increaseQuantityBtn, 'Increase quantity button[increaseQuantityBtn] should be enabled').toBeEnabled();
      console.log('Increase quantity button is enabled');
   }

   /**
    * Asserts that the increase quantity button is disabled.
    */
   async expectIncreaseQuantityBtnIsDisabled() {
      await expect(this.increaseQuantityBtn, 'Increase quantity button[increaseQuantityBtn] should be disabled').toBeDisabled();
      console.log('Increase quantity button is disabled');
   }

   /**
    * Asserts that the decrease quantity button is visible.
    */
   async expectDecreaseQuantityBtnIsVisible() {
      await expect(this.decreaseQuantityBtn, 'Decrease quantity button[decreaseQuantityBtn] is missing or not visible').toBeVisible();
      console.log('Decrease quantity button is visible');
   }

   /**
    * Asserts that the decrease quantity button is enabled.
    */
   async expectDecreaseQuantityBtnIsEnabled() {
      await expect(this.decreaseQuantityBtn, 'Decrease quantity button[decreaseQuantityBtn] should be enabled').toBeEnabled();
      console.log('Decrease quantity button is enabled');
   }

   /**
    * Asserts that the decrease quantity button is disabled.
    */
   async expectDecreaseQuantityBtnIsDisabled() {
      await expect(this.decreaseQuantityBtn, 'Decrease quantity button[decreaseQuantityBtn] should be disabled').toBeDisabled();
      console.log('Decrease quantity button is disabled');
   }

   /**
    * Asserts that the NFT quantity input has the correct value.
    * @param {string} nftInputQuantity - The expected quantity value.
    */
   async expectCorrectNFTQuantity(nftInputQuantity: string) {
      await expect(this.inputQuantity, 'Incorrect NFT quantity value').toHaveAttribute('value', nftInputQuantity)
      console.log('Correct NFT input quantity is displayed:', await this.inputQuantity.inputValue())
   }

   // --- Minting Actions ---

   /**
    * Asserts that the mint button is visible.
    */
   async expectMintBtnIsVisible() {
      await expect(this.mintBtn, 'Mint button[mintBtn] is missing or not visible').toBeVisible();
      console.log('Mint button is visible');
   }

   /**
    * Asserts that the mint button is enabled.
    */
   async expectMintBtnIsEnabled() {
      await expect(this.mintBtn, 'Mint button[mintBtn] should be enabled').toBeEnabled();
      console.log('Mint button is enabled');
   }

   /**
    * Asserts that the mint button is disabled.
    */
   async expectMintBtnIsDisabled() {
      await expect(this.mintBtn, 'Mint button[mintBtn] should be disabled').toBeDisabled();
      console.log('Mint button is disabled');
   }

   /**
    * Asserts that the claimed NFT button is visible.
    */
   async expectClaimedNftBtnIsVisible() {
      await expect(this.claimedNftBtn, 'Claimed NFT button[claimedNftBtn] is missing or not visible').toBeVisible();
      console.log('Claimed NFT button is visible');
   }


   // --- Business Logic & Data ---

   /**
    * Asserts that the total price is correctly calculated and displayed.
    * @param {number} quantity - The number of NFTs.
    * @param {number} nftPricePerUnit - The price per individual NFT.
    */
   async expectCorrectTotalPrice(quantity: number, nftPricePerUnit: number) {
      const calculatedTotalPrice = Number((quantity * nftPricePerUnit).toFixed(3))
      await expect(this.nftPrice, 'Incorrect total price is displayed').toHaveText(`Total price: ${calculatedTotalPrice} POL`)
      console.log('Correct total price is displayed:', await this.nftPrice.textContent())
   }

   /**
    * Asserts that the balance per phase is correctly displayed.
    * @param {number} balancePerPhase - The number of NFTs claimed in the current phase.
    */
   async expectCorrectBalancePerPhase(balancePerPhase: number) {
      const nftLabel = balancePerPhase === 1 ? 'NFT' : 'NFTs';
      await expect(this.nftBalancePerPhase, 'Incorrect balance per phase is displayed').
         toHaveText(`${balancePerPhase} of ${process.env.MAX_NFTS_PER_PHASE} ${nftLabel} claimed`)
      console.log('Correct balance per phase info is displayed:', await this.nftBalancePerPhase.textContent())
   }
}
