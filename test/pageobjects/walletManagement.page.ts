import { $ } from '@wdio/globals'
import Page from './page';
import type { ChainablePromiseElement } from 'webdriverio';

/**
 * sub page containing specific selectors and methods for a specific page
 */
class WalletManagementPage extends Page {

    public get pageTitle(): ChainablePromiseElement {
        return $('//span[normalize-space()="My Wallets"]');
    }

    public get mainWallet(): ChainablePromiseElement {
        return $('//span[normalize-space()="Main Wallet"]');
    }

    public get addIconButton(): ChainablePromiseElement {
        return $('[data-testid="icon-btn-add"]');
    }

    public get sectionTitle(): ChainablePromiseElement {
        return $('[data-id="section-title"]');
    }

    public get manageRecoveryPhrase(): ChainablePromiseElement {
        return $('[data-testid="li-add-wallet-mnemonic-manage"]');
    }

    public get walletsSubtitles() {
        return $$('[data-testid="list-item-m-subtitle"]');
    }

    public get switchButtons(): ChainablePromiseArray {
        return $$('//button[starts-with(@data-testid, "tgl-li-wallets-")]');
    }

    public get saveButton(): ChainablePromiseElement {
        return $('[data-testid="btn-save"]');
    }

    public get manageRecoveryPhraseWalletTitle(): ChainablePromiseArray {
        return $$('//div[starts-with(@data-testid, "virtuoso-item-list")] //span[@class="_9rd95r0"]');
    }

    public async getElementText(element: ReturnType<typeof $>): Promise<string> {
        await element.waitForExist({ timeout: 10000 });
        return element.getText();
    }

    public async clickOnAddIconButton(): Promise<void> {
        await this.addIconButton.waitForClickable({ timeout: 10000 });
        await this.addIconButton.click();
    }

    public async clickOnManageRecoveryPhraseButton(): Promise<void> {
        await this.manageRecoveryPhrase.waitForClickable({ timeout: 10000 });
        await this.manageRecoveryPhrase.click();
    }

    public async isSwitchButtonDisabled(index: number): Promise<boolean> {
        const buttons = this.switchButtons;
        const button = buttons[index];

        await button.waitForExist({ timeout: 10000 });

        const ariaDisabled = await button.getAttribute('disabled');
        return ariaDisabled === 'true';
    }

    public async getSwitchButtonValue(index: number): Promise<string> {
        const buttons = this.switchButtons;
        const button = buttons[index];
        return button.getAttribute('value');
    }

    public async getManageRecoveryPhraseWalletTitleText(index: number): Promise<string> {
        const walletsTitles = this.manageRecoveryPhraseWalletTitle;
        const walletTitle = walletsTitles[index];
        return walletTitle.getText();
    }

    public async clickOnSwitchButton(index: number): Promise<void> {
        const buttons = this.switchButtons;
        const button = buttons[index];

        await button.waitForClickable({ timeout: 10000 });
        await button.click();
    }

    public async clickOnSaveButton(): Promise<void> {
        await this.saveButton.waitForClickable({ timeout: 10000 });
        await this.saveButton.click();
    }

    public async getMyWalletsSubtitles(): Promise<string[]> {
        await this.sectionTitle.waitForExist({
            timeout: 5000,
            timeoutMsg: "Section title Not Found"
        });

        const elements = await this.walletsSubtitles;
        const walletSubtitlesText: string[] = [];
        
        for (const el of elements) {
            walletSubtitlesText.push((await el.getText()).trim());
        }
        return walletSubtitlesText;
    }
}

export default new WalletManagementPage();
