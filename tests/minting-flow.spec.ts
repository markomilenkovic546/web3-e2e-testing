import { expect, test } from './fixtures';

test.describe('Minting flow', () => {
    test.beforeEach(async ({ mintingPage }) => {
        await mintingPage.goto();
    });

    test('Default state of minting modal is correct once the user connects the wallet', async ({
        mintingPage,
        metamask,
        masterAccount,
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
    });

    test('User can mint a single NFT', async ({
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

        await mintingPage.mintingModal.expectMintingInfoMessage('Ready for minting');

        const initialBalance = await blockchainUtils.getBalance(address);

        await mintingPage.mintingModal.mint();

        await mintingPage.mintingModal.expectMintingInfoMessage(
            'Please confirm transaction in your wallet to continue.',
        );

        await page.waitForTimeout(3000);

        await metamask.confirmTransaction();

        await mintingPage.mintingModal.expectMintingInfoMessage('Waiting for the receipt');

        await mintingPage.mintingModal.expectMintingInfoMessage(
            'NFT successfully claimed. You can continue minting.',
        );

        // Verify balance change
        await blockchainUtils.expectBalanceAfterMint(address, initialBalance, process.env.NFT_PRICE!);

        await mintingPage.mintingModal.expectCorrectBalancePerPhase(1)

        await mintingPage.mintingModal.expectCorrectTotalPrice(1, Number(process.env.NFT_PRICE))

        await mintingPage.mintingModal.expectCorrectNFTQuantity('1')

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


        // Verify ownership on the smart contract

        const nftOwner = await getNftOwner(nftId);
        expect(nftOwner.toLowerCase()).toEqual(address.toLowerCase());
    });

    test('User can mint multiple NFTs one by one', async ({
        mintingPage,
        metamask,
        mintAccount,
        getNftOwner,
        getTotalMintedValue,
        blockchainUtils,
        page,
    }) => {
        const address = await mintAccount(process.env.TRANSFER_VALUE!);

        await mintingPage.connectWallet();

        await metamask.connectToDapp();

        // Get initial total minted value
        const initialTotalMinted = Number(await getTotalMintedValue());
        let currentBalance = await blockchainUtils.getBalance(address);

        // --- Mint First NFT ---
        await mintingPage.mintingModal.expectMintingInfoMessage('Ready for minting');

        await mintingPage.mintingModal.mint();

        await mintingPage.mintingModal.expectMintingInfoMessage(
            'Please confirm transaction in your wallet to continue.',
        );

        await page.waitForTimeout(3000);

        await metamask.confirmTransaction();

        await mintingPage.mintingModal.expectMintingInfoMessage(
            'NFT successfully claimed. You can continue minting.',
        );

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

        await mintingPage.nftCardModal.close();

        const firstNftOwner = await getNftOwner(firstNftId);
        expect(firstNftOwner.toLowerCase()).toEqual(address.toLowerCase());

        // --- Mint Second NFT ---
        await mintingPage.mintingModal.expectMintingInfoMessage('NFT successfully claimed. You can continue minting.');

        await mintingPage.mintingModal.mint();

        await mintingPage.mintingModal.expectMintingInfoMessage(
            'Please confirm transaction in your wallet to continue.',
        );

        await page.waitForTimeout(3000);

        await metamask.confirmTransaction();

        await mintingPage.mintingModal.expectMintingInfoMessage(
            'NFT successfully claimed. You can continue minting.',
        );

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

        const secondNftOwner = await getNftOwner(secondNftId);
        expect(secondNftOwner.toLowerCase()).toEqual(address.toLowerCase());

        // --- Verify in Gallery ---
        await mintingPage.nftCardModal.openNFTGallery();

        await mintingPage.nftGalleryModal.expectContainerIsVisible();

        // Second NFT should be visible and selected by default
        await mintingPage.nftGalleryModal.expectNftItemButtonIsVisible(secondNftId);
        await mintingPage.nftGalleryModal.expectNftCardIsVisible();
        await mintingPage.nftGalleryModal.expectNftId(secondNftId);
        await metamask.page.waitForTimeout(2000);
        await mintingPage.nftGalleryModal.expectNftCardTitle(secondNftName!);
        await mintingPage.nftGalleryModal.expectNftImageAltText(secondNftAltText);

        // Click on First NFT item button and verify details
        await mintingPage.nftGalleryModal.selectNftItem(firstNftId);
        await mintingPage.nftGalleryModal.expectNftId(firstNftId);
        await mintingPage.nftGalleryModal.expectNftCardTitle(firstNftName!);
        await mintingPage.nftGalleryModal.expectNftImageAltText(firstNftAltText);

        // Final check: total minted value should have increased by 2
        const finalTotalMinted = Number(await getTotalMintedValue());
        expect(finalTotalMinted).toEqual(initialTotalMinted + 2);
    });

    test('User cannot set the quantity value lower than 1', async ({
        mintingPage,
        metamask,
        masterAccount,
    }) => {
        await masterAccount();

        await mintingPage.connectWallet();

        await metamask.connectToDapp();

        await mintingPage.mintingModal.expectCorrectNFTQuantity('1');

        await mintingPage.mintingModal.expectDecreaseQuantityBtnIsDisabled();
    });

    test('User cannot increment quantity beyond the maximum allowed per phase', async ({
        mintingPage,
        metamask,
        mintAccount,
    }) => {
        await mintAccount(process.env.TRANSFER_VALUE!);

        await mintingPage.connectWallet();

        await metamask.connectToDapp();

        await mintingPage.mintingModal.enterQuantity(process.env.MAX_NFTS_PER_PHASE!);

        await mintingPage.mintingModal.expectIncreaseQuantityBtnIsDisabled();
    });
    test('Max quantity limit is adjusted accordingly after a successful mint', async ({
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

        await metamask.confirmTransaction();


        await mintingPage.mintingModal.expectMintingInfoMessage(
            'NFT successfully claimed. You can continue minting.',
        );

        await mintingPage.mintingModal.expectCorrectBalancePerPhase(1);

        const remainingAllowed = Number(process.env.MAX_NFTS_PER_PHASE!) - 1;
        await mintingPage.mintingModal.enterQuantity(remainingAllowed.toString());

        await mintingPage.mintingModal.expectIncreaseQuantityBtnIsDisabled();
    });


    test('NFT total price is correct according to quantity value', async ({
        mintingPage,
        metamask,
        mintAccount,
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
    });


});
