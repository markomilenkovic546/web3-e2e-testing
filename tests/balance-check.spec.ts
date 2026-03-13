import { expect, test } from './fixtures';

test.describe('Balance check', () => {
    test.beforeEach(async ({ mintingPage }) => {
        await mintingPage.goto();
    });

    test('Balance check modal is not displayed when the funds are sufficient', async ({
        mintingPage,
        metamask,
        mintAccount,
    }) => {
        // Setup: Create and connect a wallet with insufficient funds
        const transferValue: string = process.env.SUFFICIENT_FUNDS!;
        await mintAccount(transferValue);

        // Action: Connect to the dApp
        await mintingPage.connectWallet();
        await metamask.connectToDapp();

        // Verify the low balance notice is not displayed and mint button is enabled
        await expect(mintingPage.balanceCheckModal.container).not.toBeVisible()
        await expect(mintingPage.mintingModal.mintBtn).toBeEnabled();

        console.log('Sufficient funds state verified successfully!');
    });

    test('User cannot mint if the founds is insufficient', async ({
        mintingPage,
        metamask,
        mintAccount,
    }) => {
        // Setup: Create and connect a wallet with insufficient funds
        const transferValue: string = process.env.INSUFFICIENT_FUNDS!;
        await mintAccount(transferValue);

        // Action: Connect to the dApp
        await mintingPage.connectWallet();
        await metamask.connectToDapp();

        // Assertions: Verify the low balance notice is displayed and mint button is disabled
        await expect(mintingPage.balanceCheckModal.container).toContainText(
            `You're low on POL!Your current balance is ${transferValue} POL.`,
        );
        await expect(mintingPage.mintingModal.mintBtn).toBeDisabled();

        console.log('Insufficient funds state verified successfully!');
    });

    test('User cannot mint after rechecking the insufficient balance', async ({
        mintingPage,
        metamask,
        mintAccount,
    }) => {
        // Setup: Create and connect a wallet with insufficient funds
        const transferValue: string = process.env.INSUFFICIENT_FUNDS!;
        await mintAccount(transferValue);

        // Action: Connect to the dApp
        await mintingPage.connectWallet();
        await metamask.connectToDapp();

        // Assertions: Verify the low balance notice is displayed and mint button is disabled
        await expect(mintingPage.balanceCheckModal.container).toContainText(
            `You're low on POL!Your current balance is ${transferValue} POL.`,
        );
        await expect(mintingPage.mintingModal.mintBtn).toBeDisabled();

        // Click the recheck button to recheck the balance
        await mintingPage.balanceCheckModal.recheckBalance()

        // Assertions: Verify that after recheck the low balance notice is displayed and mint button is disabled
        await expect(mintingPage.balanceCheckModal.container).toContainText(
            `You're low on POL!Your current balance is ${transferValue} POL.`,
        );
        await expect(mintingPage.mintingModal.mintBtn).toBeDisabled();
    });
});