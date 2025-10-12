import { $ } from '@wdio/globals'
import Page from './page';
import type { ChainablePromiseElement } from 'webdriverio';
import PortfolioPage from './portfolio.page';

/**
 * sub page containing specific selectors and methods for a specific page
 */
class SuccessPage extends Page {

    public get pageTitle(): ChainablePromiseElement {
        return $('[data-testid="section-onboarding-success"] span.css-151sp5y');
    }

    public get agreeLetsGoButton(): ChainablePromiseElement {
        return $('[data-testid="btn-explore"]');
    }

    public async getPageTitleText(): Promise<string> {
        await this.pageTitle.waitForExist({ timeout: 10000 });
        return this.pageTitle.getText();
    }

    public async clickOnAgreeLetsGoButton(): Promise<typeof PortfolioPage> {
        await this.agreeLetsGoButton.waitForClickable({ timeout: 10000 });
        await this.agreeLetsGoButton.click();
        return PortfolioPage;
    }
}

export default new SuccessPage();
