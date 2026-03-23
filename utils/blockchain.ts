import { ethers } from 'ethers';
import abi from '../abi.json' with { type: 'json' };

const AMOY_RPC_URL = process.env.AMOY_RPC_URL!;
const CONTRACT_ADDRESS = process.env.SMART_CONTRACT_ADDRESS!;
const GAS_PRICE_GWEI = process.env.GAS_PRICE_GWEI!;
const GAS_LIMIT = process.env.GAS_LIMIT!;

export default class BlockchainUtils {
    private provider: ethers.providers.JsonRpcProvider;
    private contract: ethers.Contract;

    constructor() {
        this.provider = new ethers.providers.JsonRpcProvider(AMOY_RPC_URL);
        this.contract = new ethers.Contract(CONTRACT_ADDRESS, abi, this.provider);
    }

    async getBalance(address: string): Promise<ethers.BigNumber> {
        return await this.provider.getBalance(address);
    }

    /**
     * Returns the balance of an address formatted to 4 decimal places.
     */
    async getFormattedBalance(address: string): Promise<string> {
        const balance = await this.getBalance(address);
        return parseFloat(ethers.utils.formatEther(balance)).toFixed(4);
    }

    async getTransactionCost(txHash: string): Promise<ethers.BigNumber> {
        const receipt = await this.provider.getTransactionReceipt(txHash);
        return receipt.gasUsed.mul(receipt.effectiveGasPrice);
    }

    async getLatestClaimTransaction(claimerAddress: string): Promise<string | null> {
        const filter = this.contract.filters.TokensClaimed?.(null, claimerAddress);
        if (!filter) return null;
        
        const logs = await this.contract.queryFilter(filter, -100);
        if (logs.length === 0) return null;
        
        const lastLog = logs[logs.length - 1];
        if (!lastLog) return null;
        
        return lastLog.transactionHash;
    }

    async getNftOwner(nftId: string): Promise<string> {
        return await this.contract.ownerOf(nftId);
    }

    async getNftBalance(address: string): Promise<number> {
        const balance = await this.contract.balanceOf(address);
        return balance.toNumber();
    }

    async getTotalMinted(): Promise<string> {
        const totalMinted = await this.contract.totalMinted();
        return totalMinted.toString();
    }

    async getAddressFromPrivateKey(privateKey: string): Promise<string> {
        const wallet = new ethers.Wallet(privateKey, this.provider);
        return await wallet.getAddress();
    }

    async fundAccount(masterPrivateKey: string, toAddress: string, amountEth: string): Promise<void> {
        const masterWallet = new ethers.Wallet(masterPrivateKey, this.provider);
        console.log(`[Blockchain] Funding ${toAddress} with ${amountEth} POL...`);
        const fundTx = await masterWallet.sendTransaction({
            to: toAddress,
            value: ethers.utils.parseEther(amountEth),
            gasPrice: ethers.utils.parseUnits(GAS_PRICE_GWEI, 'gwei'),
            gasLimit: Number(GAS_LIMIT),
        });
        await fundTx.wait();
        console.log(`[Blockchain] Funding transaction confirmed.`);
    }

    async sweepRemainingFunds(privateKey: string, toAddress: string): Promise<void> {
        const wallet = new ethers.Wallet(privateKey, this.provider);
        const address = await wallet.getAddress();
        const balance = await this.getBalance(address);

        if (balance.gt(0)) {
            const gasPrice = ethers.utils.parseUnits(GAS_PRICE_GWEI, 'gwei');
            const gasLimit = Number(GAS_LIMIT);
            const gasCost = gasPrice.mul(gasLimit);

            if (balance.gt(gasCost)) {
                const sweepAmount = balance.sub(gasCost);
                console.log(`[Blockchain] Sweeping ${ethers.utils.formatEther(sweepAmount)} POL from ${address} to ${toAddress}...`);
                const sweepTx = await wallet.sendTransaction({
                    to: toAddress,
                    value: sweepAmount,
                    gasPrice: gasPrice,
                    gasLimit: gasLimit,
                });
                await sweepTx.wait();
                console.log(`[Blockchain] Sweep transaction confirmed.`);
            } else {
                console.log(`[Blockchain] Balance of ${address} too low to sweep.`);
            }
        }
    }

    /**
     * Verifies that the balance changed correctly after a minting transaction.
     * Hides ethers math from the tests.
     */
    async expectBalanceAfterMint(
        address: string,
        initialBalance: ethers.BigNumber,
        nftPriceEth: string,
        nftQuantity: number = 1
    ): Promise<ethers.BigNumber> {
        console.log(`[Blockchain] Verifying balance change for address: ${address}`);
        console.log(`[Blockchain] Initial Balance: ${ethers.utils.formatEther(initialBalance)} POL`);

        const finalBalance = await this.getBalance(address);
        const txHash = await this.getLatestClaimTransaction(address);

        if (!txHash) {
            throw new Error(`No claim transaction found for ${address} in the last 100 blocks.`);
        }

        console.log(`[Blockchain] Found claim transaction: ${txHash}`);

        const gasCost = await this.getTransactionCost(txHash);
        const totalNftPrice = ethers.utils.parseEther(nftPriceEth).mul(nftQuantity);
        const expectedBalance = initialBalance.sub(totalNftPrice).sub(gasCost);

        console.log(`[Blockchain] NFT Price: ${nftPriceEth} POL x ${nftQuantity}`);
        console.log(`[Blockchain] Gas Cost: ${ethers.utils.formatEther(gasCost)} POL`);
        console.log(`[Blockchain] Expected Final Balance: ${ethers.utils.formatEther(expectedBalance)} POL`);
        console.log(`[Blockchain] Actual Final Balance:   ${ethers.utils.formatEther(finalBalance)} POL`);

        if (!finalBalance.eq(expectedBalance)) {
            const diff = finalBalance.sub(expectedBalance);
            console.error(`[Blockchain] BALANCE MISMATCH! Difference: ${ethers.utils.formatEther(diff)} POL`);
            throw new Error(
                `Balance mismatch for ${address}!\n` +
                `Expected: ${ethers.utils.formatEther(expectedBalance)} POL\n` +
                `Actual:   ${ethers.utils.formatEther(finalBalance)} POL`
            );
        }

        console.log(`[Blockchain] Balance verification successful!`);
        return finalBalance;
    }

    createRandomWallet() {
        return ethers.Wallet.createRandom().connect(this.provider);
    }
}
