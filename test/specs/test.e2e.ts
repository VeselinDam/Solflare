import { expect } from '@wdio/globals';
import HomePage from '../pageobjects/home.page';
import successPage from '../pageobjects/success.page';

describe('Solflare Wallet Creation', () => {
    it('should create new wallet and verify recovery phrase management', async () => {
        await HomePage.open();

        const pageTitleText = await HomePage.getPageTitleText();
        await expect(pageTitleText).toEqual('YOUR WALLET. YOUR KINGDOM.');
        const createWallet = await HomePage.clickNeedNewWalletButton();
        // Verify that we are on the Create Wallet page

        const mainPageTitleText = await createWallet.getMainPageTitleText();
        expect(mainPageTitleText).toEqual('Keys to Your Kingdom');
        const recoveryPhrases = await createWallet.getAllRecoveryPhrases();
        await createWallet.clickSaveMyRecoveryPhraseButton();

        // Confirm that we are on the recovery phrase confirmation page
        const recoveryPhraseTitleText = await createWallet.getRecoveryPhraseTitleText();
        expect(recoveryPhraseTitleText).toBeDisabled();
        expect(recoveryPhraseTitleText).toEqual('Confirm Your Recovery Phrase');

        // Fill in the recovery phrase input fields in the correct order
        await createWallet.fillRecoveryPhraseInputFields(recoveryPhrases);
        await createWallet.clickOnContinueButton();

        //Verify that we are on the Set Password page
        const passwordPageTitleText = await createWallet.getPasswordPageTitleText();
        expect(passwordPageTitleText).toBeDisabled();
        expect(passwordPageTitleText).toEqual('Set a Password for Your Wallet');
        await createWallet.fillPasswordInputField(await createWallet.newPasswordInputField, 'Test1234');
        await createWallet.fillPasswordInputField(await createWallet.repeatPasswordInputField, 'Test1234');
        await createWallet.clickOnContinueButton();

        //Verify that we are on the Success page
        const successPageTitleText = await successPage.getPageTitleText();
        expect(successPageTitleText).toBeDisabled();
        expect(successPageTitleText).toEqual('You’re All Set!');
        await successPage.clickOnAgreeLetsGoButton();

        await browser.pause(6000); 
    });
});

