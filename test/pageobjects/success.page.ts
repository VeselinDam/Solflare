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

    public async clickOnAgreeLetsGoButton(): Promise<typeof PortfolioPage> {
        await this.waitClickable(this.agreeLetsGoButton);
        await this.click(this.agreeLetsGoButton);
        return PortfolioPage;
    }
}

export default new SuccessPage();
