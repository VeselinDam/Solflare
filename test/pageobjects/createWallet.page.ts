import { $ } from '@wdio/globals'
import Page from './page';
import type { ChainablePromiseElement } from 'webdriverio';

/**
 * sub page containing specific selectors and methods for a specific page
 */
class CreateWallet extends Page {

    public get mainPageTitle(): ChainablePromiseElement {
        return $('//h1[contains(normalize-space(.),"Keys to Your Kingdom")]');
    }

    public get newPasswordInputField() {
        return $('[data-testid="input-new-password"]');
    }

    public get repeatPasswordInputField() {
        return $('[data-testid="input-repeat-password"]');
    }

    public get passwordPageTitle(): ChainablePromiseElement {
        return $('[data-testid="form-onboarding-set-password"] h2');
    }

    public get continueButton(): ChainablePromiseElement {
        return $('[data-testid="btn-continue"]');
    }

    public get comfirmRecoveryPhraseLocator(): string {
        return '[data-testid="form-onboarding-create-confirm-mnemonic"] input[data-testid^="input-recovery-phrase-"]:not([readonly])';
    }

    public get recoveryPhraseLocator(): string {
        return 'input[data-testid^="input-recovery-phrase-"][readonly]';
    }

    public get recoveryPhraseTitle(): ChainablePromiseElement {
        return $('[data-testid="form-onboarding-create-confirm-mnemonic"] h1');
    }

    public get recoveryPhraseInputs(): ChainablePromiseArray {
        return $$(this.recoveryPhraseLocator);
    }

    public get saveMyRecoveryPhraseButton(): ChainablePromiseElement {
        return $('[data-testid="btn-saved-my-recovery-phrase"]');
    }

    public async clickOnSaveMyRecoveryPhraseButton(): Promise<void> {
        await this.waitClickable(this.saveMyRecoveryPhraseButton);
        await this.click(this.saveMyRecoveryPhraseButton);
    }

    public async clickOnContinueButton(): Promise<void> {
        await this.waitClickable(this.continueButton);
        await this.click(this.continueButton);
    }

    public async fillPasswordField(password: string): Promise<void> {
        await this.fillInputField(this.newPasswordInputField, password);
    }

    public async fillRepeatPasswordInputFieldField(repeatPassword: string): Promise<void> {
        await this.fillInputField(this.repeatPasswordInputField, repeatPassword);
    }

    /**
    * Waiting for all 12 fields to load and appear for entering the recovery phrase.
    */
    async waitForRecoveryPhrasesToLoad(): Promise<void> {
        const sel = this.recoveryPhraseLocator;
        await browser.waitUntil(async () => {
            const count = await browser.execute(
                (sel: string) => document.querySelectorAll(sel).length, sel);
            return (count as number) === 12;
        }, { timeout: 10000, timeoutMsg: 'Expected 12 recovery inputs to be present' });
    }

    public async getAllRecoveryPhrases(): Promise<string[]> {
        await this.waitForRecoveryPhrasesToLoad();

        const sel = this.recoveryPhraseLocator;

        const values = await browser.execute((selector: string) => {
            const elements = document.querySelectorAll<HTMLInputElement>(selector);
            return Array.from(elements).map(el => el.value);
        }, sel);

        return values as string[];
    }

    public async fillRecoveryPhraseInputFields(values: string[]): Promise<void> {
        const element = this.comfirmRecoveryPhraseLocator;

        await browser.waitUntil(async () => {
            const count = await browser.execute((selector: string) => {
                return document.querySelectorAll(selector).length;
            }, element);
            return count >= values.length;
        }, {
            timeout: 10000,
            timeoutMsg: 'Input recovery phrases not present',
        });

        const targets = (await $$(element)) as unknown as WebdriverIO.Element[];

        const n = Math.min(values.length, targets.length);
        for (let i = 0; i < n; i++) {
            await targets[i].setValue(values[i]);
        }
    }
}

export default new CreateWallet();
