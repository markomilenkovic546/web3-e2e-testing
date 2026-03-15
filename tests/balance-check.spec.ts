import { expect, test } from './fixtures';

test.describe('Balance check', () => {
    test.beforeEach(async ({ mintingPage }) => {
        await mintingPage.goto();
    });

    test('Balance check modal is not displayed when funds are sufficient', async ({
        mintingPage,
        metamask,
        mintAccount,
    }) => {
        const transferValue: string = process.env.SUFFICIENT_FUNDS!;
        await mintAccount(transferValue);

        await mintingPage.connectWallet();

        await metamask.connectToDapp();

        await mintingPage.balanceCheckModal.expectContainerIsNotVisible();

        await mintingPage.mintingModal.expectMintBtnIsEnabled();

        console.log('Sufficient funds state verified successfully!');
    });

    test('User cannot mint if funds are insufficient', async ({
        mintingPage,
        metamask,
        mintAccount,
    }) => {
        const transferValue: string = process.env.INSUFFICIENT_FUNDS!;
        await mintAccount(transferValue);

        await mintingPage.connectWallet();

        await metamask.connectToDapp();

        await mintingPage.balanceCheckModal.expectLowBalanceMessage(transferValue);

        await mintingPage.mintingModal.expectMintBtnIsDisabled();

        console.log('Insufficient funds state verified successfully!');
    });

    test('User cannot mint after rechecking insufficient balance', async ({
        mintingPage,
        metamask,
        mintAccount,
    }) => {
        const transferValue: string = process.env.INSUFFICIENT_FUNDS!;
        await mintAccount(transferValue);

        await mintingPage.connectWallet();

        await metamask.connectToDapp();

        await mintingPage.balanceCheckModal.expectLowBalanceMessage(transferValue);

        await mintingPage.mintingModal.expectMintBtnIsDisabled();

        await mintingPage.balanceCheckModal.recheckBalance()

        await mintingPage.balanceCheckModal.expectLowBalanceMessage(transferValue);
        
        await mintingPage.mintingModal.expectMintBtnIsDisabled();
    });
});
