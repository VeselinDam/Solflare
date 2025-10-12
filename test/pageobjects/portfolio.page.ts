import { $ } from '@wdio/globals'
import Page from './page';
import type { ChainablePromiseElement } from 'webdriverio';
import WalletManagementPage from './walletManagement.page';

/**
 * sub page containing specific selectors and methods for a specific page
 */
class PortfolioPage extends Page {

    public get pageTitle(): ChainablePromiseElement {
        return $('[data-testid="section-header"]').$('span=Portfolio');
    }

    public get walletManagementAvatar(): ChainablePromiseElement {
        return $('[data-testid="section-wallet-picker"]').$('span=MW');
    }

    public async getPageTitleText(): Promise<string> {
        await this.pageTitle.waitForExist({ timeout: 10000 });
        return this.pageTitle.getText();
    }

    public async clickOnwalletManagementAvatar(): Promise<typeof WalletManagementPage> {
        await this.walletManagementAvatar.waitForClickable({ timeout: 10000 });
        await this.walletManagementAvatar.click();
        return WalletManagementPage;
    }
}

export default new PortfolioPage();
