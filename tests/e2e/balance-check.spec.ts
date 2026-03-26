import { test } from '../fixtures';

test.describe('Balance check @balance-check', () => {
   test.beforeEach(async ({ mintingPage }) => {
      await mintingPage.goto();
   });

   test('Balance check modal should not appear when funds are sufficient', async ({
      mintingPage,
      metamask,
      mintAccount,
      page,
   }) => {
      const transferValue: string = process.env.SUFFICIENT_FUNDS!;
      await mintAccount(transferValue);

      await mintingPage.connectWallet();

      await metamask.connectToDapp();

      await mintingPage.balanceCheckModal.expectContainerIsNotVisible();

      await mintingPage.mintingModal.expectMintBtnIsEnabled();

      await mintingPage.mintingModal.container.scrollIntoViewIfNeeded();
      await test.info().attach('sufficient-funds-state', {
         body: await page.screenshot(),
         contentType: 'image/png',
      });
   });

   test('User should not be able to mint with insufficient funds', async ({
      mintingPage,
      metamask,
      mintAccount,
      page,
   }) => {
      const transferValue: string = process.env.INSUFFICIENT_FUNDS!;
      await mintAccount(transferValue);

      await mintingPage.connectWallet();

      await metamask.connectToDapp();

      await mintingPage.balanceCheckModal.expectLowBalanceMessage(transferValue);

      await mintingPage.mintingModal.expectMintBtnIsDisabled();

      await mintingPage.balanceCheckModal.container.scrollIntoViewIfNeeded();
      await test.info().attach('insufficient-funds-state', {
         body: await page.screenshot(),
         contentType: 'image/png',
      });
   });

   test('User should not be able to mint after rechecking insufficient balance', async ({
      mintingPage,
      metamask,
      mintAccount,
      page,
   }) => {
      const transferValue: string = process.env.INSUFFICIENT_FUNDS!;
      await mintAccount(transferValue);

      await mintingPage.connectWallet();

      await metamask.connectToDapp();

      await mintingPage.balanceCheckModal.expectLowBalanceMessage(transferValue);

      await mintingPage.mintingModal.expectMintBtnIsDisabled();

      await mintingPage.balanceCheckModal.recheckBalance();

      await mintingPage.balanceCheckModal.expectLowBalanceMessage(transferValue);

      await mintingPage.mintingModal.expectMintBtnIsDisabled();

      await mintingPage.balanceCheckModal.container.scrollIntoViewIfNeeded();
      await test.info().attach('insufficient-funds-after-recheck', {
         body: await page.screenshot(),
         contentType: 'image/png',
      });
   });
});
