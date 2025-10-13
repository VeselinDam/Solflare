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

    public async clickOnAddIconButton(): Promise<void> {
        await this.waitClickable(this.addIconButton);
        await this.click(this.addIconButton);
    }

    public async clickOnManageRecoveryPhraseButton(): Promise<void> {
        await this.waitClickable(this.manageRecoveryPhrase);
        await this.click(this.manageRecoveryPhrase);
    }

    public async isSwitchButtonDisabled(index: number): Promise<boolean> {
        const buttons = this.switchButtons;
        const button = buttons[index];

        await this.waitExist(button);
        return !(await button.isEnabled());
    }

    public async getSwitchButtonValue(index: number): Promise<string | null> {
        const buttons = this.switchButtons;
        const button = buttons[index];
        return this.getElementAttribute(button, 'value');
    }

    public async getManageRecoveryPhraseWalletTitleText(index: number): Promise<string> {
        const walletsTitles = this.manageRecoveryPhraseWalletTitle;
        const walletTitle = walletsTitles[index];
        return this.text(walletTitle);
    }

    public async clickOnSwitchButton(index: number): Promise<void> {
        const buttons = this.switchButtons;
        const button = buttons[index];

        await this.waitClickable(button);
        await this.click(button);
    }

    public async clickOnSaveButton(): Promise<void> {
        await this.waitClickable(this.saveButton);
        await this.click(this.saveButton);
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
