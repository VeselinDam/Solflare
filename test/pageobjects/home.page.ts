import { $ } from '@wdio/globals'
import Page from './page';
import type { ChainablePromiseElement } from 'webdriverio';
import CreateWallet from './createWallet.page';

/**
 * sub page containing specific selectors and methods for a specific page
 */
class HomePage extends Page {

    public open() {
        return super.open('');
    }

    public get pageTitle(): ChainablePromiseElement {
        return $('[data-testid="section-onboarding-main-page"] h1');
    }

    public get needNewWalletButton(): ChainablePromiseElement {
        return $('[data-testid="btn-need-new-wallet"]');
    }

    public async getPageTitleText(): Promise<string> {
        await this.pageTitle.waitForExist({ timeout: 10000 });
        return this.pageTitle.getText();
    }

    public async clickNeedNewWalletButton(): Promise<typeof CreateWallet> {
        await this.needNewWalletButton.waitForClickable({ timeout: 10000 });
        await this.needNewWalletButton.click();
        return CreateWallet;
    }
}

export default new HomePage();
