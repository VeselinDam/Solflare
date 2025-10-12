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
        expect(createWallet.recoveryPhraseTitle).toBeDisabled();
        expect(recoveryPhraseTitleText).toEqual('Confirm Your Recovery Phrase');

        // Fill in the recovery phrase input fields in the correct order
        await createWallet.fillRecoveryPhraseInputFields(recoveryPhrases);
        await createWallet.clickOnContinueButton();

        //Verify that we are on the Set Password page
        const passwordPageTitleText = await createWallet.getPasswordPageTitleText();
        expect(createWallet.passwordPageTitle).toBeDisabled();
        expect(passwordPageTitleText).toEqual('Set a Password for Your Wallet');
        await createWallet.fillPasswordInputField(await createWallet.newPasswordInputField, 'Test1234');
        await createWallet.fillPasswordInputField(await createWallet.repeatPasswordInputField, 'Test1234');
        await createWallet.clickOnContinueButton();

        //Verify that we are on the Success page
        const successPageTitleText = await successPage.getPageTitleText();
        expect(successPage.pageTitle).toBeDisabled();
        expect(successPageTitleText).toEqual('You’re All Set!');
        const portfolioPage = await successPage.clickOnAgreeLetsGoButton();

        // Verify that we are on the Portfolio page
        const portfolioPageTitleText = await portfolioPage.getPageTitleText();
        expect(portfolioPage.pageTitle).toBeDisabled();
        expect(portfolioPageTitleText).toEqual('Portfolio');
        const walletManagementPage = await portfolioPage.clickOnwalletManagementAvatar();

        // Verify that we are on the Wallet Management page
        const walletManagementPageTitleText = await walletManagementPage.getElementText(walletManagementPage.pageTitle);
        expect(walletManagementPage.pageTitle).toBeDisabled();
        expect(walletManagementPageTitleText).toEqual('My Wallets');
        const mainWalletText = await walletManagementPage.getElementText(walletManagementPage.mainWallet);
        expect(walletManagementPage.mainWallet).toBeDisabled();
        expect(mainWalletText).toEqual('Main Wallet');

        // Add a new wallet using the "Add" icon button
        await walletManagementPage.clickOnAddIconButton();
        await walletManagementPage.clickOnManageRecoveryPhraseButton();

        // Verify that the first switch button is disabled
        const isFirstSwitchDisabled = await walletManagementPage.isSwitchButtonDisabled(0);
        expect(isFirstSwitchDisabled).toBe(true);

        // Verify that the first switch button is active (value is "on")
        const isFirstSwitchEnabled = await walletManagementPage.getSwitchButtonValue(0);
        expect(isFirstSwitchEnabled).toBe("on");

        // Store the titles of the selected wallets
        const selectedWalletsTitles: string[] = [];
        selectedWalletsTitles.push(await walletManagementPage.getManageRecoveryPhraseWalletTitleText(0));

        // Select second and third switch buttons and store their titles
        await walletManagementPage.clickOnSwitchButton(2);
        selectedWalletsTitles.push(await walletManagementPage.getManageRecoveryPhraseWalletTitleText(2));
        await walletManagementPage.clickOnSwitchButton(3);
        selectedWalletsTitles.push(await walletManagementPage.getManageRecoveryPhraseWalletTitleText(3));
        await walletManagementPage.clickOnSaveButton();

        // Verify that we are on the Wallet Management page
        expect(walletManagementPage.pageTitle).toBeDisabled();
        expect(walletManagementPageTitleText).toEqual('My Wallets');

        // Verify that the subtitles of "My Wallets" match the selected wallets' titles
        const myWalletsSubtitles = await walletManagementPage.getMyWalletsSubtitles();
        expect(myWalletsSubtitles).toEqual(selectedWalletsTitles);
    });
});

