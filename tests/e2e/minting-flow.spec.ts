import { expect, test } from './fixtures';

test.describe('Minting flow', () => {
    test.beforeEach(async ({ mintingPage }) => {
        await mintingPage.goto();
    });

    test('User connects a wallet with no NFTs and the minting modal displays the correct state', async ({
        mintingPage,
        metamask,
        mintAccount,
        page
    }) => {
        await mintAccount(process.env.TRANSFER_VALUE!);

        await mintingPage.connectWallet();

        await metamask.connectToDapp();

        await mintingPage.mintingModal.expectContainerIsVisible();

        await mintingPage.mintingModal.expectIncreaseQuantityBtnIsEnabled();

        await mintingPage.mintingModal.expectDecreaseQuantityBtnIsDisabled();

        await mintingPage.mintingModal.expectMintBtnIsEnabled();

        await mintingPage.mintingModal.expectCorrectNFTQuantity('1')

        await mintingPage.mintingModal.expectMintingInfoMessage('Ready for minting')

        await mintingPage.mintingModal.expectCorrectTotalPrice(1, Number(process.env.NFT_PRICE!))

        await mintingPage.mintingModal.expectCorrectBalancePerPhase(0)

        await mintingPage.mintingModal.container.scrollIntoViewIfNeeded();

        await test.info().attach('minting-modal-state', {
            body: await page.screenshot(),
            contentType: 'image/png',
        });
    });

    test('User connects a wallet with multiple NFTs and the minting modal displays the correct state', async ({
        mintingPage,
        metamask,
        masterAccount,
        page
    }) => {
        await masterAccount();

        await mintingPage.connectWallet();

        await metamask.connectToDapp();

        await mintingPage.mintingModal.expectContainerIsVisible();

        await mintingPage.mintingModal.expectIncreaseQuantityBtnIsEnabled();

        await mintingPage.mintingModal.expectDecreaseQuantityBtnIsDisabled();

        await mintingPage.mintingModal.expectMintBtnIsEnabled();

        await mintingPage.mintingModal.expectCorrectNFTQuantity('1')

        await mintingPage.mintingModal.expectMintingInfoMessage('Ready for minting')

        await mintingPage.mintingModal.expectCorrectTotalPrice(1, Number(process.env.NFT_PRICE!))

        await mintingPage.mintingModal.expectCorrectBalancePerPhase(Number(process.env.MASTER_MINTED_COUNT!))

        await mintingPage.mintingModal.container.scrollIntoViewIfNeeded();

        await test.info().attach('minting-modal-state', {
            body: await page.screenshot(),
            contentType: 'image/png',
        });
    });

    test('User connects a wallet with maxiumum NFTs and the minting modal displays the correct state', async ({
        mintingPage,
        metamask,
        maxMintedAccount,
        page,
    }) => {
        await maxMintedAccount();

        await mintingPage.connectWallet();

        await metamask.connectToDapp();

        await mintingPage.mintingModal.expectContainerIsVisible();

        await mintingPage.mintingModal.expectIncreaseQuantityBtnIsDisabled()

        await mintingPage.mintingModal.expectDecreaseQuantityBtnIsDisabled();

        await mintingPage.mintingModal.expectInputQuantityIsDisabled()

        await mintingPage.mintingModal.expectMintBtnIsDisabled()

        await mintingPage.mintingModal.expectCorrectNFTQuantity('1')

        await mintingPage.mintingModal.expectMintingInfoMessage(`You've reached your limit for minting NFTs.`)

        await mintingPage.mintingModal.expectCorrectTotalPrice(1, Number(process.env.NFT_PRICE!))

        await mintingPage.mintingModal.expectCorrectBalancePerPhase(Number(process.env.MAX_NFTS_PER_PHASE!))

        await mintingPage.mintingModal.container.scrollIntoViewIfNeeded();

        await test.info().attach('minting-modal-state', {
            body: await page.screenshot(),
            contentType: 'image/png',
        });
    });
    test('User mints a single NFT and and procceeds to NFT gallery to view the minted NFTs', async ({
        mintingPage,
        metamask,
        mintAccount,
        getNftOwner,
        blockchainUtils,
        page,
    }) => {
        const address = await mintAccount(process.env.TRANSFER_VALUE!);

        await mintingPage.connectWallet();

        await metamask.connectToDapp();

        await mintingPage.mintingModal.container.scrollIntoViewIfNeeded();

        await mintingPage.mintingModal.expectMintingInfoMessage('Ready for minting');

        const initialBalance = await blockchainUtils.getBalance(address);

        await mintingPage.mintingModal.mint();

        await mintingPage.mintingModal.expectMintingInfoMessage(
            'Please confirm transaction in your wallet to continue.',
        );

        await page.waitForTimeout(3000);

        await test.info().attach('Please confirm tx...', {
            body: await page.screenshot(),
            contentType: 'image/png',
        });

        await metamask.confirmTransaction();

        await mintingPage.mintingModal.expectMintingInfoMessage('Waiting for the receipt');

        await test.info().attach('Waiting for the receipt', {
            body: await page.screenshot(),
            contentType: 'image/png',
        });

        await mintingPage.mintingModal.expectMintingInfoMessage(
            'NFT successfully claimed. You can continue minting.',
        );

        await test.info().attach('NFT successfully claimed', {
            body: await page.screenshot(),
            contentType: 'image/png',
        });

        // Verify balance change
        await blockchainUtils.expectBalanceAfterMint(address, initialBalance, process.env.NFT_PRICE!);

        await mintingPage.mintingModal.expectCorrectBalancePerPhase(1)

        await mintingPage.mintingModal.expectCorrectTotalPrice(1, Number(process.env.NFT_PRICE))

        await mintingPage.mintingModal.expectCorrectNFTQuantity('1')

        await test.info().attach('Minting modal details after succesfull minting', {
            body: await page.screenshot(),
            contentType: 'image/png',
        });

        // Get NFT details from the UI
        const nftId = await mintingPage.mintingModal.getClaimedNftId();
        const altText = await mintingPage.mintingModal.getClaimedNftAltText();
        const nftName = altText.split(' ')[0];

        // Open the NFT Card modal (NftCardModal)
        await mintingPage.mintingModal.clickOnClaimedNft();

        // Verify that correct info is displayed in the NftCardModal
        await mintingPage.nftCardModal.expectContainerIsVisible();
        await mintingPage.nftCardModal.expectNftId(nftId);
        await mintingPage.nftCardModal.expectNftCardTitle(nftName!);
        await mintingPage.nftCardModal.expectNftImageAltText(altText);

        await test.info().attach('NFT card modal', {
            body: await page.screenshot(),
            contentType: 'image/png',
        });

        // Open the NFT Gallery
        await mintingPage.nftCardModal.openNFTGallery();

        // Verify NFT Gallery
        await metamask.page.waitForTimeout(2000);
        await mintingPage.nftGalleryModal.expectContainerIsVisible();
        await mintingPage.nftGalleryModal.expectNftItemButtonIsVisible(nftId);

        // Verify that correct info is displayed in the NFT card inside gallery
        await mintingPage.nftGalleryModal.expectNftCardIsVisible();
        await mintingPage.nftGalleryModal.expectNftId(nftId);
        await mintingPage.nftGalleryModal.expectNftCardTitle(nftName!);
        await mintingPage.nftGalleryModal.expectNftImageAltText(altText);

        await test.info().attach('NFT gallery', {
            body: await page.screenshot(),
            contentType: 'image/png',
        });
        // Verify ownership on the smart contract

        const nftOwner = await getNftOwner(nftId);
        expect(nftOwner.toLowerCase()).toEqual(address.toLowerCase());
        console.log('[Blockchain] NFT owner:', nftOwner)
    });

    test('User mints a single NFT, closes the modal, and mints another NFT', async ({
        mintingPage,
        metamask,
        mintAccount,
        getNftOwner,
        blockchainUtils,
        page,
    }) => {
        const address = await mintAccount(process.env.TRANSFER_VALUE!);

        await mintingPage.connectWallet();

        await metamask.connectToDapp();

        let currentBalance = await blockchainUtils.getBalance(address);

        // --- Mint First NFT ---
        await mintingPage.mintingModal.expectMintingInfoMessage('Ready for minting');

        await mintingPage.mintingModal.mint();

        await mintingPage.mintingModal.expectMintingInfoMessage(
            'Please confirm transaction in your wallet to continue.',
        );

        await page.waitForTimeout(3000);

        await mintingPage.mintingModal.container.scrollIntoViewIfNeeded();
        await test.info().attach('Please confirm tx (1st mint)', {
            body: await page.screenshot(),
            contentType: 'image/png',
        });

        await metamask.confirmTransaction();

        await mintingPage.mintingModal.expectMintingInfoMessage(
            'NFT successfully claimed. You can continue minting.',
        );

        await mintingPage.mintingModal.container.scrollIntoViewIfNeeded();
        await test.info().attach('NFT successfully claimed (1st mint)', {
            body: await page.screenshot(),
            contentType: 'image/png',
        });

        // Verify balance change for first mint
        currentBalance = await blockchainUtils.expectBalanceAfterMint(address, currentBalance, process.env.NFT_PRICE!);

        await mintingPage.mintingModal.expectCorrectBalancePerPhase(1)

        await mintingPage.mintingModal.expectCorrectTotalPrice(1, Number(process.env.NFT_PRICE))

        await mintingPage.mintingModal.expectCorrectNFTQuantity('1')

        const firstNftId = await mintingPage.mintingModal.getClaimedNftId();
        const firstNftAltText = await mintingPage.mintingModal.getClaimedNftAltText();
        const firstNftName = firstNftAltText.split(' ')[0];

        await mintingPage.mintingModal.clickOnClaimedNft();

        await mintingPage.nftCardModal.expectContainerIsVisible();
        await mintingPage.nftCardModal.expectNftId(firstNftId);
        await mintingPage.nftCardModal.expectNftCardTitle(firstNftName!);
        await mintingPage.nftCardModal.expectNftImageAltText(firstNftAltText);

        await mintingPage.nftCardModal.container.scrollIntoViewIfNeeded();
        await test.info().attach('NFT card modal (1st mint)', {
            body: await page.screenshot(),
            contentType: 'image/png',
        });

        await mintingPage.nftCardModal.close();

        const firstNftOwner = await getNftOwner(firstNftId);
        expect(firstNftOwner.toLowerCase()).toEqual(address.toLowerCase());
        console.log('[Blockchain] First NFT owner:', firstNftOwner)

        // --- Mint Second NFT ---
        await mintingPage.mintingModal.expectMintingInfoMessage('NFT successfully claimed. You can continue minting.');

        await mintingPage.mintingModal.mint();

        await mintingPage.mintingModal.expectMintingInfoMessage(
            'Please confirm transaction in your wallet to continue.',
        );

        await page.waitForTimeout(3000);

        await mintingPage.mintingModal.container.scrollIntoViewIfNeeded();
        await test.info().attach('Please confirm tx (2nd mint)', {
            body: await page.screenshot(),
            contentType: 'image/png',
        });

        await metamask.confirmTransaction();

        await mintingPage.mintingModal.expectMintingInfoMessage(
            'NFT successfully claimed. You can continue minting.',
        );

        await mintingPage.mintingModal.container.scrollIntoViewIfNeeded();
        await test.info().attach('NFT successfully claimed (2nd mint)', {
            body: await page.screenshot(),
            contentType: 'image/png',
        });

        // Verify balance change for second mint
        await blockchainUtils.expectBalanceAfterMint(address, currentBalance, process.env.NFT_PRICE!);

        await mintingPage.mintingModal.expectCorrectBalancePerPhase(2)

        await mintingPage.mintingModal.expectCorrectTotalPrice(1, Number(process.env.NFT_PRICE))

        await mintingPage.mintingModal.expectCorrectNFTQuantity('1')

        const secondNftId = await mintingPage.mintingModal.getClaimedNftId();
        const secondNftAltText = await mintingPage.mintingModal.getClaimedNftAltText();
        const secondNftName = secondNftAltText.split(' ')[0];

        await mintingPage.mintingModal.clickOnClaimedNft();

        await mintingPage.nftCardModal.expectContainerIsVisible();
        await mintingPage.nftCardModal.expectNftId(secondNftId);
        await mintingPage.nftCardModal.expectNftCardTitle(secondNftName!);
        await mintingPage.nftCardModal.expectNftImageAltText(secondNftAltText);

        await mintingPage.nftCardModal.container.scrollIntoViewIfNeeded();
        await test.info().attach('NFT card modal (2nd mint)', {
            body: await page.screenshot(),
            contentType: 'image/png',
        });

        const secondNftOwner = await getNftOwner(secondNftId);
        expect(secondNftOwner.toLowerCase()).toEqual(address.toLowerCase());
        console.log('[Blockchain] Second NFT owner:', secondNftOwner)


    });


    test('User rejects transaction for minting, then mints again successfully', async ({
        mintingPage,
        metamask,
        mintAccount,
        getNftBalance,
        blockchainUtils,
        page,
    }) => {
        const address = await mintAccount(process.env.TRANSFER_VALUE!);

        await mintingPage.connectWallet();

        await metamask.connectToDapp();

        await mintingPage.mintingModal.expectMintingInfoMessage('Ready for minting');

        const initialBalance = await blockchainUtils.getBalance(address);
        const nftPrice = process.env.NFT_PRICE!;

        // --- First Attempt: Reject ---
        await mintingPage.mintingModal.mint();

        await mintingPage.mintingModal.expectMintingInfoMessage(
            'Please confirm transaction in your wallet to continue.',
        );

        await page.waitForTimeout(3000);

        console.log('Rejecting transaction in MetaMask...');
        await metamask.rejectTransaction();

        await mintingPage.mintingModal.expectMintingInfoMessage(
            "You've canceled the transaction. Try again?",
        );

        await mintingPage.mintingModal.container.scrollIntoViewIfNeeded();
        await test.info().attach('rejected-tx', {
            body: await page.screenshot(),
            contentType: 'image/png',
        });

        // --- Second Attempt: Confirm ---
        await mintingPage.mintingModal.mint();

        await mintingPage.mintingModal.expectMintingInfoMessage(
            'Please confirm transaction in your wallet to continue.',
        );

        await page.waitForTimeout(3000);

        await metamask.confirmTransaction();

        await mintingPage.mintingModal.expectMintingInfoMessage(
            'NFT successfully claimed. You can continue minting.',
        );

        await mintingPage.mintingModal.container.scrollIntoViewIfNeeded();
        await test.info().attach('confirmed-after-rejection', {
            body: await page.screenshot(),
            contentType: 'image/png',
        });

        // Verify balance change (only 1 NFT should be minted)
        await blockchainUtils.expectBalanceAfterMint(address, initialBalance, nftPrice);

        await mintingPage.mintingModal.expectCorrectBalancePerPhase(1);

        await mintingPage.mintingModal.expectCorrectTotalPrice(1, Number(nftPrice));

        await mintingPage.mintingModal.expectCorrectNFTQuantity('1');

        // Verify NFT ownership/balance on the smart contract
        const nftBalance = await getNftBalance(address);
        expect(nftBalance).toEqual(1);
        console.log('[Blockchain] Account NFT balance is correct:', 1)
    });


    test('User mints multiple NFTs at once', async ({
        mintingPage,
        metamask,
        mintAccount,
        blockchainUtils,
        page,
        getNftBalance
    }) => {
        const address = await mintAccount(process.env.TRANSFER_VALUE!);

        await mintingPage.connectWallet();

        await metamask.connectToDapp();

        await mintingPage.mintingModal.expectMintingInfoMessage('Ready for minting');

        const initialBalance = await blockchainUtils.getBalance(address);
        const nftPrice = Number(process.env.NFT_PRICE!);
        const quantityToMint = 3;

        await mintingPage.mintingModal.enterQuantity(quantityToMint.toString());
        await mintingPage.mintingModal.expectCorrectTotalPrice(quantityToMint, nftPrice);

        await mintingPage.mintingModal.mint();

        await mintingPage.mintingModal.expectMintingInfoMessage(
            'Please confirm transaction in your wallet to continue.',
        );

        await page.waitForTimeout(3000);

        await mintingPage.mintingModal.container.scrollIntoViewIfNeeded();
        await test.info().attach('Please confirm tx (3 NFTs)', {
            body: await page.screenshot(),
            contentType: 'image/png',
        });

        await metamask.confirmTransaction();

        await mintingPage.mintingModal.expectMintingInfoMessage(
            'NFTs successfully claimed. You can continue minting.',
        );

        await mintingPage.mintingModal.container.scrollIntoViewIfNeeded();
        await test.info().attach('NFTs successfully claimed (3 NFTs)', {
            body: await page.screenshot(),
            contentType: 'image/png',
        });

        // Verify balance change
        const totalCost = (nftPrice * quantityToMint).toString();
        await blockchainUtils.expectBalanceAfterMint(address, initialBalance, totalCost);

        await mintingPage.mintingModal.expectCorrectBalancePerPhase(quantityToMint)

        await mintingPage.mintingModal.expectCorrectTotalPrice(1, nftPrice)

        await mintingPage.mintingModal.expectCorrectNFTQuantity('1')

        await test.info().attach('Minting modal details after succesfull multiple minting', {
            body: await page.screenshot(),
            contentType: 'image/png',
        });

        await mintingPage.mintingModal.clickOnClaimedNft()

        // Verify the message about multiple NFTs shown
        await mintingPage.nftCardModal.expectShownNftCountMessageVisible(quantityToMint);

        // Verify NFT ownership/balance on the smart contract
        const nftBalance = await getNftBalance(address);
        expect(nftBalance).toEqual(quantityToMint);
        console.log('[Blockchain] Account NFT balance is correct:', nftBalance)
    });


    test('User cannot set the quantity value lower than 1', async ({
        mintingPage,
        metamask,
        masterAccount,
        page,
    }) => {
        await masterAccount();

        await mintingPage.connectWallet();

        await metamask.connectToDapp();

        await mintingPage.mintingModal.expectCorrectNFTQuantity('1');

        await mintingPage.mintingModal.expectDecreaseQuantityBtnIsDisabled();

        await mintingPage.mintingModal.container.scrollIntoViewIfNeeded();
        await test.info().attach('quantity-lower-than-1-disabled', {
            body: await page.screenshot(),
            contentType: 'image/png',
        });
    });

    test('User cannot increment quantity beyond the maximum allowed per phase', async ({
        mintingPage,
        metamask,
        mintAccount,
        page,
    }) => {
        await mintAccount(process.env.TRANSFER_VALUE!);

        await mintingPage.connectWallet();

        await metamask.connectToDapp();

        await mintingPage.mintingModal.enterQuantity(process.env.MAX_NFTS_PER_PHASE!);

        await mintingPage.mintingModal.expectIncreaseQuantityBtnIsDisabled();

        await mintingPage.mintingModal.container.scrollIntoViewIfNeeded();
        await test.info().attach('max-quantity-limit', {
            body: await page.screenshot(),
            contentType: 'image/png',
        });
    });
    test('Max quantity limit adjusts accordingly after a successful mint', async ({
        mintingPage,
        page,
        metamask,
        mintAccount,
    }) => {
        await mintAccount(process.env.TRANSFER_VALUE!);

        await mintingPage.connectWallet();

        await metamask.connectToDapp();

        await mintingPage.mintingModal.expectMintingInfoMessage('Ready for minting');

        await mintingPage.mintingModal.mint();

        await mintingPage.mintingModal.expectMintingInfoMessage(
            'Please confirm transaction in your wallet to continue.',
        );

        await page.waitForTimeout(3000);

        await mintingPage.mintingModal.container.scrollIntoViewIfNeeded();
        await test.info().attach('Please confirm tx', {
            body: await page.screenshot(),
            contentType: 'image/png',
        });

        await metamask.confirmTransaction();


        await mintingPage.mintingModal.expectMintingInfoMessage(
            'NFT successfully claimed. You can continue minting.',
        );

        await mintingPage.mintingModal.container.scrollIntoViewIfNeeded();
        await test.info().attach('NFT successfully claimed', {
            body: await page.screenshot(),
            contentType: 'image/png',
        });

        await mintingPage.mintingModal.expectCorrectBalancePerPhase(1);

        const remainingAllowed = Number(process.env.MAX_NFTS_PER_PHASE!) - 1;
        await mintingPage.mintingModal.enterQuantity(remainingAllowed.toString());

        await mintingPage.mintingModal.expectIncreaseQuantityBtnIsDisabled();

        await mintingPage.mintingModal.container.scrollIntoViewIfNeeded();
        await test.info().attach('max-quantity-adjusted', {
            body: await page.screenshot(),
            contentType: 'image/png',
        });
    });



    test('NFT total price is correct according to quantity value', async ({
        mintingPage,
        metamask,
        mintAccount,
        page,
    }) => {
        await mintAccount(process.env.TRANSFER_VALUE!);

        await mintingPage.connectWallet();

        await metamask.connectToDapp();

        await mintingPage.mintingModal.expectMintingInfoMessage('Ready for minting');

        const nftPrice = Number(process.env.NFT_PRICE!);
        const nftClaimLimit = Number(process.env.MAX_NFTS_PER_PHASE!);

        await mintingPage.mintingModal.expectCorrectTotalPrice(1, nftPrice);

        for (let i = 2; i <= nftClaimLimit; i++) {
            await mintingPage.mintingModal.increaseQuantity();
            await mintingPage.mintingModal.expectCorrectTotalPrice(i, nftPrice);
        }

        await mintingPage.mintingModal.container.scrollIntoViewIfNeeded();
        await test.info().attach('total-price-correct', {
            body: await page.screenshot(),
            contentType: 'image/png',
        });
    });


});
