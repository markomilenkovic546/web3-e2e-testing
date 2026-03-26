# Web3 E2E Testing Framework

This project is a showcase of an E2E testing framework designed for decentralized applications (dApps), specifically focusing on NFT minting. 

The application under test is **Sitting Cats NFT**, a minting platform developed by my friend and colleague [Danilo](https://www.linkedin.com/in/danilo-bozinovic/).
**App URL:** [https://sitting-cats.vercel.app/](https://sitting-cats.vercel.app/)

---

## 🚀 Key Features
- **MetaMask Automation:** Full handling of wallet connectivity, network switching, and transaction confirmations via Synpress.
- **Action & Data Transparency:** Logs every action, actual data value, and result in real-time. This makes **debugging much faster** by showing exactly where a test failed and provides **full transparency** even on successful runs, allowing for a clear review of exactly what happened.
- **Visual Evidence & Artifacts:** Strategic use of Playwright's attachment system to capture screenshots and state evidence at every critical phase, ensuring a visual history of the dApp’s behavior.
- **On-Chain Verification:** Direct smart contract interaction using `ethers.js` to validate the "ground truth" of the blockchain (ownership, balances) independently of the UI.
- **Dynamic Account Lifecycle:** Custom logic to automatically create, fund, and sweep temporary wallets for isolated and repeatable test runs.
- **CI/CD Ready:** Pre-configured GitHub Actions pipeline for automated regression testing on every push.

---

## 🏗 Detailed Architecture

### 1. Component-Based Page Object Model (POM)
The framework uses a granular POM architecture. Instead of monolithic page objects, the UI is broken down into **Reusable Components** (`Header`, `MintingModal`, `NftGalleryModal`, etc.).
*   **Managing Complexity:** For detailed pages with many interactive elements, breaking them into smaller components prevents "God Objects" and makes the codebase much cleaner, easier to navigate, and simpler to maintain.
*   **Code Reuse:** Centralizing logic for shared elements (like Modals or Headers) ensures that changes in the UI only need to be updated in one place, even if the component is used across multiple pages.
*   **Integrated Logging:** Every component-level action is accompanied by descriptive console logs, ensuring the test execution is human-readable.

### 2. Advanced Fixture System (`tests/fixtures.ts`)
The project leverages Playwright's fixture system to abstract the complexity of Web3 setups:
*   **`mintAccount`**: A high-level fixture that manages the entire lifecycle of a temporary test wallet:
    1.  Generates a random wallet.
    2.  Funds it from a master account.
    3.  Imports it into MetaMask.
    4.  Performs the test.
    5.  Sweeps any remaining funds back to the master account.
*   **`masterAccount` & `maxMintedAccount`**: Pre-configured accounts for testing specific user states (e.g., users who have already reached their minting limit).

### 3. Blockchain Utilities (`utils/blockchain.ts`)
A dedicated utility class provides a direct bridge to the Amoy network using `ethers.js`.
*   **Cross-Layer Validation:** Used to cross-reference data shown on the UI (like NFT balances) with the actual on-chain state.
*   **Ground Truth:** Ensures that even if the UI is "lying" or slow to update, the test can verify the successful execution of the smart contract.

---

## 🛠 Tech Stack
- **Test Runner:** [Playwright Test](https://playwright.dev/docs/intro)
- **Web3 Integration:** [Synpress (v4)](https://github.com/Synthetixio/synpress)
- **Blockchain Interaction:** [Ethers.js](https://docs.ethers.org/v5/)
- **Language:** TypeScript
- **Reporting:** Monocart Reporter
- **CI/CD:** GitHub Actions

---

## 📁 Project Structure
```text
├── model/                  # Page Object Model
│   ├── components/         # Granular UI components (Modals, Header, etc.)
│   └── pages/              # Page-level logic
├── tests/                  
│   ├── e2e/                # Functional test suites (tagged with @minting, @account, etc.)
│   └── fixtures.ts         # Custom Playwright/Synpress fixtures
├── utils/                  # Blockchain (ethers.js) and helper utilities
├── test/wallet-setup/      # Synpress wallet initialization scripts
└── static-data/            # Mock data and collection details
```

---

## 🧹 Code Quality
The project uses **Prettier** for formatting and **TypeScript** for type safety.
- **Format code:** `yarn format`
- **Check linting/types:** `yarn lint`

---

## 🔧 Setup & Running

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd web3-e2e-tests
   ```

2. **Install dependencies:**
   ```bash
   yarn install
   ```

3. **Install Playwright Browsers:**
   ```bash
   npx playwright install chromium
   ```

4. **Environment Configuration:**
   Create a `.env` file based on `.env.example`:
   ```bash
   cp .env.example .env
   ```
   *Note: Fill in your RPC URL, private keys, and MetaMask credentials.*

5. **Initialize Synpress Cache (Create Wallet Cache):**
   ```bash
   npx synpress
   ```

6. **Run Tests:**
   - **All tests:** `yarn e2e`
   - **Minting flow only:** `yarn e2e:minting`
   - **Account/Gallery only:** `yarn e2e:account`
   - **Balance checks:** `yarn e2e:balance`

---

## 📊 Reports
After execution, a detailed visual HTML report is generated at `./test-results/report.html`.
