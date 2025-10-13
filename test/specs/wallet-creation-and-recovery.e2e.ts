import { expect } from '@wdio/globals';
import HomePage from '../pageobjects/home.page';
import successPage from '../pageobjects/success.page';

describe('Solflare Wallet Creation', () => {
    it('should create new wallet and verify recovery phrase management', async () => {
        await HomePage.open();

        const pageTitleText = await HomePage.getPageTitleText();
        await expect(pageTitleText).toHaveText('YOUR WALLET. YOUR KINGDOM.', { message: 'Home page title does not match expected text' });
        const createWallet = await HomePage.clickOnNeedNewWalletButton();

        // Verify that we are on the Create Wallet page
        const mainPageTitleText = await createWallet.getMainPageTitleText();
        expect(mainPageTitleText).toHaveText('Keys to Your Kingdom', { message: 'Create Wallet page title does not match expected text' });
        const recoveryPhrases = await createWallet.getAllRecoveryPhrases();
        await createWallet.clickOnSaveMyRecoveryPhraseButton();

        // Confirm that we are on the recovery phrase confirmation page
        const recoveryPhraseTitleText = await createWallet.getRecoveryPhraseTitleText();
        expect(createWallet.recoveryPhraseTitle).toBeDisabled();
        expect(recoveryPhraseTitleText).toHaveText('Confirm Your Recovery Phrase', { message: 'Recovery Phrase title does not match expected text' });

        // Fill in the recovery phrase input fields in the correct order
        await createWallet.fillRecoveryPhraseInputFields(recoveryPhrases);
        await createWallet.clickOnContinueButton();

        //Verify that we are on the Set Password page
        const passwordPageTitleText = await createWallet.getPasswordPageTitleText();
        expect(createWallet.passwordPageTitle).toBeDisabled();
        expect(passwordPageTitleText).toHaveText('Set a Password for Your Wallet', { message: 'Password page title does not match expected text' });
        await createWallet.fillPasswordField('Test1234');
        await createWallet.fillRepeatPasswordInputFieldField('Test1234');
        await createWallet.clickOnContinueButton();

        //Verify that we are on the Success page
        const successPageTitleText = await successPage.getPageTitleText();
        expect(successPage.pageTitle).toBeDisabled();
        expect(successPageTitleText).toHaveText('You’re All Set!', { message: 'Success page title does not match expected text' });
        const portfolioPage = await successPage.clickOnAgreeLetsGoButton();

        // Verify that we are on the Portfolio page
        const portfolioPageTitleText = await portfolioPage.getPageTitleText();
        expect(portfolioPage.pageTitle).toBeDisabled();
        expect(portfolioPageTitleText).toHaveText('Portfolio', { message: 'Portfolio page title does not match expected text' });
        const walletManagementPage = await portfolioPage.clickOnwalletManagementAvatar();

        // Verify that we are on the Wallet Management page
        const walletManagementPageTitleText = await walletManagementPage.getElementText(walletManagementPage.pageTitle);
        expect(walletManagementPage.pageTitle).toBeDisabled();
        expect(walletManagementPageTitleText).toHaveText('My Wallets', { message: 'Wallet Management page title does not match expected text' });
        const mainWalletText = await walletManagementPage.getElementText(walletManagementPage.mainWallet);
        expect(walletManagementPage.mainWallet).toBeDisabled();
        expect(mainWalletText).toHaveText('Main Wallet', { message: 'Main Wallet title does not match expected text' });

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
        expect(walletManagementPageTitleText).toHaveText('My Wallets', { message: 'Wallet Management page title does not match expected text' });

        // Verify that the subtitles of "My Wallets" match the selected wallets' titles
        const myWalletsSubtitles = await walletManagementPage.getMyWalletsSubtitles();
        expect(myWalletsSubtitles).toEqual(selectedWalletsTitles);
    });
});

