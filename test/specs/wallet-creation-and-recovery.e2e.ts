import { expect } from '@wdio/globals';
import HomePage from '../pageobjects/home.page';
import successPage from '../pageobjects/success.page';

describe('Solflare Wallet Creation', () => {
    it('should create new wallet and verify recovery phrase management', async () => {
        await HomePage.open();

        await expect(HomePage.pageTitle).toHaveText('YOUR WALLET. YOUR KINGDOM.', { message: 'Home page title does not match expected text' });
        const createWallet = await HomePage.clickOnNeedNewWalletButton();

        // Verify that we are on the Create Wallet page
        await expect(createWallet.mainPageTitle).toHaveText('Keys to Your Kingdom', { message: 'Create Wallet page title does not match expected text' });
        const recoveryPhrases = await createWallet.getAllRecoveryPhrases();
        await createWallet.clickOnSaveMyRecoveryPhraseButton();

        // Confirm that we are on the recovery phrase confirmation page
        await expect(createWallet.recoveryPhraseTitle).toBeDisplayed();
        await expect(createWallet.recoveryPhraseTitle).toHaveText('Confirm Your Recovery Phrase', { message: 'Recovery Phrase title does not match expected text' });

        // Fill in the recovery phrase input fields in the correct order
        await createWallet.fillRecoveryPhraseInputFields(recoveryPhrases);
        await createWallet.clickOnContinueButton();

        //Verify that we are on the Set Password page
        await expect(createWallet.passwordPageTitle).toBeDisplayed();
        await expect(createWallet.passwordPageTitle).toHaveText('Set a Password for Your Wallet', { message: 'Password page title does not match expected text' });
        await createWallet.fillPasswordField('Test1234');
        await createWallet.fillRepeatPasswordInputFieldField('Test1234');
        await createWallet.clickOnContinueButton();

        //Verify that we are on the Success page
        await expect(successPage.pageTitle).toBeDisplayed();
        await expect(successPage.pageTitle).toHaveText('You’re All Set!', { message: 'Success page title does not match expected text' });
        const portfolioPage = await successPage.clickOnAgreeLetsGoButton();

        // Verify that we are on the Portfolio page
        await expect(portfolioPage.pageTitle).toBeDisplayed();
        await expect(portfolioPage.pageTitle).toHaveText('Portfolio', { message: 'Portfolio page title does not match expected text' });
        const walletManagementPage = await portfolioPage.clickOnwalletManagementAvatar();

        // Verify that we are on the Wallet Management page
        await expect(walletManagementPage.pageTitle).toBeDisplayed();
        await expect(walletManagementPage.pageTitle).toHaveText('My Wallets', { message: 'Wallet Management page title does not match expected text' });
        await expect(walletManagementPage.mainWallet).toBeDisplayed();
        await expect(walletManagementPage.mainWallet).toHaveText('Main Wallet', { message: 'Main Wallet title does not match expected text' });

        // Add a new wallet using the "Add" icon button
        await walletManagementPage.clickOnAddIconButton();
        await walletManagementPage.clickOnManageRecoveryPhraseButton();

        // Verify that the first switch button is disabled
        const isFirstSwitchDisabled = await walletManagementPage.isSwitchButtonDisabled(0);
        await expect(isFirstSwitchDisabled).toBe(true);

        // Verify that the first switch button is active (value is "on")
        const isFirstSwitchActive = await walletManagementPage.getSwitchButtonValue(0);
        await expect(isFirstSwitchActive).toBe("on");

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
        await expect(walletManagementPage.pageTitle).toBeDisplayed();
        await expect(walletManagementPage.pageTitle).toHaveText('My Wallets', { message: 'Wallet Management page title does not match expected text' });

        // Verify that the subtitles of "My Wallets" match the selected wallets' titles
        const myWalletsSubtitles = await walletManagementPage.getMyWalletsSubtitles();
        await expect(myWalletsSubtitles).toEqual(selectedWalletsTitles);
    });
});

