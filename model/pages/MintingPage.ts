import type { Page } from '@playwright/test';
import { Header } from '../components/Header';
import { MintingModal } from '../components/MintingModal';
import { ShowcaseModal } from '../components/ShowcaseModal';
import { BalanceCheckModal } from '../components/BalanceCheckModal';

export class MintingPage {
   readonly page: Page;
   readonly header: Header;
   readonly showcaseModal: ShowcaseModal;
   readonly mintingModal: MintingModal;
   readonly balanceCheckModal: BalanceCheckModal;

   constructor(page: Page) {
      this.page = page;
      this.header = new Header(page);
      this.showcaseModal = new ShowcaseModal(page);
      this.mintingModal = new MintingModal(page);
      this.balanceCheckModal = new BalanceCheckModal(page);
   }

   async goto() {
      await this.page.goto('/');
   }

   async connectWallet() {
      await this.header.clickConnect();
      // We add the specific RainbowKit/ConnectKit selector here
      await this.page.locator('[data-testid="rk-wallet-option-io.metamask"]').click();
   }
}
